from fastapi import APIRouter, HTTPException, Depends, status
from utils.jwt_handler import decode_access_token
from database import cursor, connection
from passlib.context import CryptContext
from schemas.stock import Update_inventory, Update_Inventory_Scan
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
from utils.Barcode.barcode_generator import generate_barcodes
from fastapi import UploadFile, File, Form
from fastapi.responses import JSONResponse
import os
import pandas as pd
from schemas.inventory import UpdateProduct, AddProduct

# this is used to check the pwd_context.verify(user.password, stored_password)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# below line will check if client sends the Token or not, it will not verify token is correct or wrong
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(tags=["inventory"])

@router.post("/addProduct")
async def add_inventory(
    current_user: Annotated[str, Depends(oauth2_scheme)],
    data: AddProduct = Form(media_type="multipart/form-data")
):
    try:
        payload = decode_access_token(current_user)
        user_name = payload["sub"]
        user_role = payload["role"]
        if not user_name:
            return JSONResponse(content={"message": "User not available", "status": False}, status_code=404)
        if user_role not in ["inventory_manager", "super_admin"]:
            return JSONResponse(content={"message": "Don't have access", "status": False}, status_code=403)

        cursor.execute("SELECT sku FROM ItemDetails WHERE sku=%s", (data.sku,))
        if cursor.fetchone():
            return JSONResponse(content={"message": "SKU is already taken", "status": False}, status_code=404)

        image_url = None

        if data.image:
            image_filename = f"{data.sku}_{data.image.filename}"
            with open(f"All_Images/images/{image_filename}", "wb") as f:
                f.write(await data.image.read())
            image_url = f"/images/{image_filename}"

        cursor.execute("SELECT category_id FROM Category WHERE category_name=%s", (data.category,))
        category_id = cursor.fetchone()
        if not category_id:
            cursor.execute("INSERT INTO Category (category_name) VALUES (%s)", (data.category,))
            connection.commit()
            cursor.execute("SELECT category_id FROM Category WHERE category_name=%s", (data.category,))
            category_id = cursor.fetchone()[0]
        else:
            category_id = category_id[0]

        cursor.execute("SELECT subcategory_id FROM SubCategory WHERE subcategory_name=%s", (data.sub_category,))
        subcategory_id = cursor.fetchone()
        if not subcategory_id:
            cursor.execute(
                "INSERT INTO SubCategory (category_id, subcategory_name) VALUES (%s, %s)", 
                (category_id, data.sub_category)
            )
            connection.commit()
            cursor.execute("SELECT subcategory_id FROM SubCategory WHERE subcategory_name=%s", (data.sub_category,))
            subcategory_id = cursor.fetchone()[0]
        else:
            subcategory_id = subcategory_id[0]

        barcode_data = generate_barcodes(data.sku)

        cursor.execute(
            """
            INSERT INTO ItemDetails 
            (item_name, item_price, item_category_id, item_subcategory_id, item_description, sku, barcode, barcode_url, item_img_url) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (
                data.name, data.price, category_id, subcategory_id, 
                data.description, data.sku, barcode_data["barcode_number"], 
                barcode_data["barcode_img"], image_url
            )
        )
        connection.commit()

        cursor.execute("SELECT item_id FROM ItemDetails WHERE sku=%s", (data.sku,))
        item_id = cursor.fetchone()[0]

        cursor.execute('''INSERT INTO stock (item_id, current_stock, stock_value, reorder_level)
               VALUES (%s, %s, %s, %s)
               ''', (item_id, 0, 0, 0))
        connection.commit()

        return JSONResponse(content={"message": "Data added successfully", "status": True}, status_code=200)

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"An unexpected error occurred: {str(e)}"
        )

@router.delete("/deleteItem")
def delete_item(sku: str, current_user: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = decode_access_token(current_user)
        user_name = payload.get("sub")
        user_role = payload.get("role")

        if not user_name:
            return JSONResponse(content={"message": "User not available", "status": False}, status_code=401)

        if user_role not in ["super_admin", "inventory_manager"]:
            return JSONResponse(content={"message": "Don't have access", "status": False}, status_code=403)

        check_sku_db = "SELECT sku FROM ItemDetails WHERE sku=%s"
        cursor.execute(check_sku_db, (sku,))
        sku_result = cursor.fetchone()

        if not sku_result:
            return JSONResponse(content={"message": "SKU not found", "status": False}, status_code=404)

        img_query = "SELECT barcode_url, item_img_url FROM ItemDetails WHERE sku=%s"
        cursor.execute(img_query, (sku,))
        img = cursor.fetchone()
        # print(img)

        if img:
            try:
                cwd = os.getcwd()
                os.remove(f"{cwd}/All_Images/{img[0]}")
                os.remove(f"{cwd}/All_Images{img[1]}")
                # print(f"{cwd}/All_Images/{img[0]}")
                # print(f"{cwd}/All_Images{img[1]}")

            except FileNotFoundError as e:
                return JSONResponse(content={"message": "Image file not found", "status": False}, status_code=404)
        else:
            return JSONResponse(content={"message": "Something went wrong while fetching image data", "status": False}, status_code=500)

        delete_item_query = "DELETE FROM ItemDetails WHERE sku=%s"
        cursor.execute(delete_item_query, (sku,))
        connection.commit()

        return JSONResponse(content={"message": "Data Deleted", "status": True}, status_code=200)

    except HTTPException as http_err:
        raise http_err
    except FileNotFoundError as file_err:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"File error: {file_err}")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Unexpected error: {e}")
 
@router.post("/uploadfile")
async def upload_file(file: UploadFile, current_user: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = decode_access_token(current_user)
        user_name = payload["sub"]
        user_role = payload["role"]
        if not user_name:
            return JSONResponse(content={"message": "User Name not found", "status": False}, status_code=404)

        if user_role not in ["super_admin", "inventory_manager"]:
            return JSONResponse(content={"message": "Don't have access", "status": False}, status_code=403)

        content = await file.read()
        df = pd.read_excel(io=content)
        dictionary = df.to_dict(orient="records")
        errors = []
        for data in dictionary:
            item_name = data["Item Name"]
            item_category = data["Item Category"]
            item_subcategory = data["Item SubCategory"]
            item_description = data["Description"]
            item_sku = data["sku"]
            item_price = data["price"]
    
            check_sku_db = '''SELECT sku FROM ItemDetails WHERE sku=%s'''
            cursor.execute(check_sku_db, (item_sku,))
            sku_result = cursor.fetchone()

            if sku_result:
                errors.append(sku_result[0])
                continue

            check_category_db = '''SELECT category_id FROM Category WHERE category_name = %s'''
            cursor.execute(check_category_db, (item_category,))
            category_row = cursor.fetchone()

            if category_row:
                new_cat_id = category_row[0]
            else:
                cursor.execute('''INSERT INTO Category (category_name) VALUES (%s)''', (item_category,))
                connection.commit()
                cursor.execute('''SELECT category_id FROM Category WHERE category_name = %s''', (item_category,))
                new_cat_id = cursor.fetchone()[0]

            check_subcategory_db = '''SELECT subcategory_id FROM SubCategory WHERE subcategory_name = %s'''
            cursor.execute(check_subcategory_db, (item_subcategory,))
            subcategory_row = cursor.fetchone()

            if subcategory_row:
                new_sub_id = subcategory_row[0]
            else:
                cursor.execute('''INSERT INTO SubCategory (category_id, subcategory_name) VALUES (%s, %s)''', (new_cat_id, item_subcategory))
                connection.commit()
                cursor.execute('''SELECT subcategory_id FROM SubCategory WHERE subcategory_name = %s''', (item_subcategory,))
                new_sub_id = cursor.fetchone()[0]

            data = generate_barcodes(item_sku)
            barcode_number = data.get("barcode_number")
            barcode_img = data.get("barcode_img")

            insert_item_query = """
            INSERT INTO ItemDetails (item_name, item_category_id, item_subcategory_id, item_description, sku, barcode, barcode_url, item_price) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            cursor.execute(insert_item_query, (item_name, new_cat_id, new_sub_id, item_description, item_sku, barcode_number, barcode_img, item_price))
            connection.commit()

            cursor.execute("SELECT item_id FROM ItemDetails WHERE sku=%s", (item_sku,))
            item_id = cursor.fetchone()[0]

            cursor.execute('''INSERT INTO stock (item_id, current_stock, stock_value, reorder_level)
                VALUES (%s, %s, %s, %s)
                ''', (item_id, 0, 0, 0))
            connection.commit()
            
        if not errors:
            return JSONResponse(content={"msg": "Data added", "status": True}, status_code=200)
        else:
            return JSONResponse(content={"msg": f"{errors} these SKU's are already available, Remaining items added", "status": True}, status_code=409)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{e}")
    
@router.put("/updateProduct",name="product update")
async def update_item(
    sku: str, current_user: Annotated[str, Depends(oauth2_scheme)], data:UpdateProduct= Form(media_type="multipart/form-data")):
    try:
        payload = decode_access_token(current_user)
        user_name = payload["sub"]
        user_role = payload["role"]
        if not user_name:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token or user not authenticated.")

        if user_role not in ["super_admin", "inventory_manager"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="don't have access")
        
        check_sku_db = "SELECT sku FROM ItemDetails WHERE sku=%s"
        cursor.execute(check_sku_db, (sku,))
        sku_result = cursor.fetchone()

        if not sku_result:
            return {"msg": "SKU is Invalid"}
        
        check_category_db = "SELECT category_id FROM Category WHERE category_name = %s"
        cursor.execute(check_category_db, (data.category,))
        category_row = cursor.fetchone()

        if category_row:
            new_cat_id = category_row[0]
        else:
            cursor.execute("INSERT INTO Category (category_name) VALUES (%s)", (data.category,))
            connection.commit()
            cursor.execute("SELECT category_id FROM Category WHERE category_name = %s", (data.category,))
            new_cat_id = cursor.fetchone()[0]

        check_subcategory_db = "SELECT subcategory_id FROM SubCategory WHERE subcategory_name = %s"
        cursor.execute(check_subcategory_db, (data.sub_category,))
        subcategory_row = cursor.fetchone()

        if subcategory_row:
            new_sub_id = subcategory_row[0]
        else:
            cursor.execute("INSERT INTO SubCategory (category_id, subcategory_name) VALUES (%s, %s)", (new_cat_id, data.sub_category))
            connection.commit()
            cursor.execute("SELECT subcategory_id FROM SubCategory WHERE subcategory_name = %s", (data.sub_category,))
            new_sub_id = cursor.fetchone()[0]

        image_url = None
        if data.image:
            image_filename = f"{sku}_{data.image.filename}"
            with open(f"All_Images/images/{image_filename}", "wb") as f:
                f.write(await data.image.read())
            image_url = f"/images/{image_filename}"

        # print(image)
        if not data.image:
            update_item_query = """
                                    UPDATE ItemDetails SET
                                    item_name = %s,item_price=%s, item_category_id = %s, item_subcategory_id = %s, item_description = %s
                                    WHERE sku = %s
                                """
            cursor.execute(update_item_query, (data.name, data.price, new_cat_id, new_sub_id, data.description, sku))
            connection.commit()
        else:
            update_item_query = """
            UPDATE ItemDetails SET
            item_name = %s,item_price=%s, item_category_id = %s, item_subcategory_id = %s, item_description = %s, item_img_url = %s
            WHERE sku = %s
            """
            cursor.execute(update_item_query, (data.name, data.price, new_cat_id, new_sub_id, data.description, image_url, sku))
            connection.commit()

        get_item_id = '''SELECT item_id FROM ItemDetails WHERE sku=%s'''
        cursor.execute(get_item_id, (sku,))
        item_id = cursor.fetchone()[0]
        # return item_id

        cursor.execute(f"SELECT current_stock FROM stock WHERE item_id={item_id}")
        current_stock = cursor.fetchone()[0]

        cursor.execute(f"UPDATE stock SET stock_value={current_stock*data.price} where item_id={item_id}")
        connection.commit()

        return JSONResponse(content={"msg": "Product updated !"}, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}")

@router.put("/updateInventory")
def update_inventory(item: Update_inventory, current_user: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = decode_access_token(current_user)
        user_name = payload["sub"]
        user_role = payload["role"]

        previous_stock = item.stock

        if not user_name:
            return JSONResponse(content={"detail":"user not found"}, status_code=404)
        if user_role not in ["super_admin", "inventory_manager", "warehouse_staff"]:
            return JSONResponse(content={"detail":"don't have access"}, status_code=403)
            
        check_sku_db = "SELECT sku FROM ItemDetails WHERE sku=%s"
        cursor.execute(check_sku_db, (item.sku,))
        sku_result = cursor.fetchone()
        # return sku_result

        if not sku_result:
            return JSONResponse(content={"message": "SKU not found", "status": False}, status_code=404)
        
        get_item_id = '''SELECT item_id FROM ItemDetails WHERE sku=%s'''
        cursor.execute(get_item_id, (item.sku,))
        item_id = cursor.fetchone()[0]

        cursor.execute(f"SELECT current_stock FROM stock WHERE item_id={item_id}")
        current_stock = cursor.fetchone()[0]

        if item.stock_type == "stock_in":
            item.stock += current_stock
        if item.stock_type == "stock_out":
            if item.stock > current_stock:
                return JSONResponse(content={"detail": "current stock is less than stock out value"}, status_code=500)
            current_stock -= item.stock
            item.stock = current_stock
        
        # return item.stock

        cursor.execute("SELECT item_price FROM ItemDetails WHERE sku=%s", (item.sku, ))
        price = cursor.fetchone()[0]
        # return price
        stock_value = item.stock*price
        
        update_stock = '''UPDATE stock SET
                        current_stock = %s, stock_value=%s, reorder_level=%s
                        WHERE item_id=%s
                        RETURNING stock_id'''
        cursor.execute(update_stock, (item.stock, stock_value, item.reorder_level, item_id))
        stock_id = cursor.fetchone()[0] 
        connection.commit()

        if item.stock_type == "stock_in":
            transaction_type = "IN"
        if item.stock_type == "stock_out":
            transaction_type = "OUT"

        transaction_table = ("INSERT INTO stock_transactions (stock_id, item_id, transaction_type, quantity, remarks, sku) VALUES (%s, %s, %s, %s, %s, %s)")
        cursor.execute(transaction_table, (stock_id, item_id, transaction_type, previous_stock, "None", item.sku))

        # cursor.execute("UPDATE ItemDetails SET item_price = %s WHERE sku=%s", (stock_value, item.sku))
        connection.commit()

        return JSONResponse(content={"details": "Stock updated"}, status_code=200)
    except:
        HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="internal server error")

@router.patch("/updateInventoryScan")
def update(item: Update_Inventory_Scan, current_user: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = decode_access_token(current_user)
        user_name = payload["sub"]
        user_role = payload["role"]

        if not user_name:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="user not found")
        if user_role not in ["super_admin", "inventory_manager", "warehouse_staff"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have access")
        
        check_sku = "SELECT sku FROM ItemDetails WHERE sku=%s"
        cursor.execute(check_sku, (item.sku,))
        sku = cursor.fetchone()[0]
        # return sku

        if not sku:
            return JSONResponse(content={"detail": "SKU is invalid"}, status_code=404)

        get_item_id = "SELECT item_id FROM ItemDetails WHERE sku=%s"
        cursor.execute(get_item_id, (sku,))
        item_id = cursor.fetchone()[0]

        cursor.execute("SELECT item_price FROM ItemDetails WHERE sku=%s", (item.sku, ))
        price = cursor.fetchone()[0]
        stock_value = price*item.stock

        cursor.execute("SELECT current_stock From stock WHERE item_id=%s", (item_id,))
        old_stock = cursor.fetchone()[0]

        stock = 0
        if item.stock > old_stock:
            transaction_type = "IN"
            stock = item.stock - old_stock
        elif item.stock < old_stock:
            transaction_type = "OUT"
            stock = old_stock - item.stock

        update_stock = """
            UPDATE stock 
            SET current_stock = %s, stock_value = %s 
            WHERE item_id = %s 
            RETURNING stock_id;
        """
        cursor.execute(update_stock, (item.stock, stock_value, item_id))
        stock_id = cursor.fetchone()[0]
        # return stock_id

        transaction_table = ("INSERT INTO stock_transactions (stock_id, item_id, transaction_type, quantity, remarks, sku) VALUES (%s, %s, %s, %s, %s, %s)")
        cursor.execute(transaction_table, (stock_id, item_id, transaction_type, stock, "None", item.sku))
        connection.commit()

        return JSONResponse(content={"detail": "Stock Updated"}, status_code=200)

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Internal Server Error: {e}")