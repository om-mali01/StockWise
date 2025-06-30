from fastapi import APIRouter, HTTPException, Depends, status
from utils.jwt_handler import decode_access_token
from database import cursor, connection
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated, Literal
from fastapi.responses import JSONResponse
from schemas.stock_out import item

# this is used to check the pwd_context.verify(user.password, stored_password)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# below line will check if client sends the Token or not, it will not verify token is correct or wrong
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(tags=["inventory"])

# @router.patch("/stock_out")
# def stock_out(item: item, current_user: Annotated[str, Depends(oauth2_scheme)]):
#     try:
#         payload = decode_access_token(current_user)
#         user_name = payload["sub"]
#         user_role = payload["role"]
#         if not user_name:
#             return JSONResponse(content={"detail":"user not available", "status":False}, status_code=404)
#         if user_role not in ["super_admin", "inventory_manager", "warehouse_staff"]:
#             return JSONResponse(content={"detail":"don't have access", "status":False}, status_code=403)

#         check_sku_db = "SELECT sku FROM ItemDetails WHERE sku=%s"
#         cursor.execute(check_sku_db, (item.item_sku,))
#         sku_result = cursor.fetchone()

#         if not sku_result:
#             return JSONResponse(content={"message": "SKU not found", "status": False}, status_code=404)
        
#         if item.stock_quantity < 0:
#             return JSONResponse(content={"detail": "enter atleast 1 qty", "status": False}, status_code=500)
        
#         get_item_id = '''SELECT item_id, item_price FROM ItemDetails WHERE sku=%s'''
#         cursor.execute(get_item_id, (item.item_sku,))
#         data = cursor.fetchone()
#         item_id = data[0]
#         item_price = data[1]
        
#         cursor.execute(f"SELECT current_stock FROM stock WHERE item_id={item_id}")
#         current_stock = cursor.fetchone()[0]

#         if current_stock < item.stock_quantity:
#             return JSONResponse(content={"details": "current stock is less than you selected", "status":False})
#         if not current_stock > 0:
#             return JSONResponse(content={"details": "stock is empty", "status":False}, status_code=200)

#         current_stock -= item.stock_quantity
#         stock_value = current_stock*item_price

#         update_stock = '''UPDATE stock SET
#                         current_stock = %s, stock_value=%s
#                         WHERE item_id=%s;'''
#         cursor.execute(update_stock, (current_stock, stock_value, item_id))
#         connection.commit()
        
#         return JSONResponse(content={"msg": "stock updated !"}, status_code=200)

#     except Exception as e:
#         raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}")

