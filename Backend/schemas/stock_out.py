from pydantic import BaseModel

class item(BaseModel):
    stock_quantity : int
    item_sku: str