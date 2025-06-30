from fastapi import FastAPI, HTTPException, Depends, status, APIRouter
from utils.jwt_handler import decode_access_token
from database import cursor, connection
from passlib.context import CryptContext
from typing import Annotated, Literal, List
from fastapi.security import OAuth2PasswordBearer
from schemas.stock import Update_inventory
from fastapi.responses import JSONResponse
from fastapi import UploadFile, File, Form

domain_url = "http://172.17.0.109:8000"
# this is used to check the pwd_context.verify(user.password, stored_password)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# below line will check if client sends the Token or not, it will not verify token is correct or wrong
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(tags=["stock"])

@router.get("/getStock")
def get_stock(sku: str):
        get_item_id = '''SELECT * FROM ItemDetails WHERE sku=%s'''
        cursor.execute(get_item_id, (sku,))
        item_id = cursor.fetchone()
        if not item_id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sku not found")

        cursor.execute(f"SELECT current_stock FROM stock WHERE item_id={item_id[0]}")
        current_stock = cursor.fetchone()[0]

        return JSONResponse(content={"current_stock": current_stock}, status_code=200)

@router.get("/stock_type")
def get_stock_type():
    stock_types = [
        {
            "id": 1,
            "stock_type":"stock_in"
        },
        {
            "id": 2,
            "stock_type":"stock_out"
        }
    ]
    return stock_types

from pydantic import BaseModel
from typing import List

class Item(BaseModel):
    name: str
    quantity: int

@router.post("/items-test/")
async def create_items(items: List[Item]):
    mylist = []
    for product in items:
        mylist.append(items[Item.name])
    return {"items": items}

@router.post("/items/")
async def create_items(current_user: Annotated[str, Depends(oauth2_scheme)], items: List[Update_inventory]):
    try:
        payload = decode_access_token(current_user)
        user_name = payload["sub"]
        user_role = payload["role"]

        if not user_name:
            return JSONResponse(content={"detail":"user not found"}, status_code=404)
        if user_role not in ["super_admin", "inventory_manager", "warehouse_staff"]:
            return JSONResponse(content={"detail":"don't have access"}, status_code=403)

        for product in items:
            get_item_id = '''SELECT item_id FROM ItemDetails WHERE sku=%s'''
            cursor.execute(get_item_id, (items.sku,))
            item_id = cursor.fetchone()[0]

            cursor.execute(f"SELECT current_stock FROM stock WHERE item_id={item_id}")
            current_stock = cursor.fetchone()[0]

            if items.stock_type == "stock_in":
                items.stock += current_stock
            if items.stock_type == "stock_out":
                if items.stock > current_stock:
                    return JSONResponse(content={"detail": "current stock is less than stock out value"}, status_code=500)
                current_stock -= items.stock
                items.stock = current_stock
            
            # return item.stock

            cursor.execute("SELECT item_price FROM ItemDetails WHERE sku=%s", (items.sku, ))
            price = cursor.fetchone()[0]
            # return price
            stock_value = items.stock*price
            
            update_stock = '''UPDATE stock SET
                            current_stock = %s, stock_value=%s, 
                            WHERE item_id=%s'''
            cursor.execute(update_stock, (items.stock, stock_value, item_id))
            connection.commit()

            cursor.execute("UPDATE ItemDetails SET item_price = %s WHERE sku=%s", (stock_value, items.sku))
            connection.commit()

        return JSONResponse(content={"details": "Stock updated"}, status_code=200)
    except:
        HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="internal server error")

