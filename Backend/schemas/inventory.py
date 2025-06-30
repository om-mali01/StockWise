from pydantic import BaseModel
from fastapi import UploadFile, File,Form

class AddInventory(BaseModel):
    name: str
    category: str
    sub_category: str
    sku: str
    description: str | None = None
    price: int

class UpdateProduct(BaseModel):
    name: str = Form(...),
    category: str = Form(...),
    sub_category: str = Form(...),
    description: str | None = Form(None),
    price: int = Form(...),
    image: UploadFile | None = File(None)

class AddProduct(BaseModel):
    name: str = Form(...),
    category: str = Form(...),
    sub_category: str = Form(...),
    sku: str = Form(...),
    description: str | None = Form(None),
    price: int = Form(...),
    image: UploadFile | None = File(None)