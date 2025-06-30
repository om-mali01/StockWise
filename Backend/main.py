from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, inventory, get_data, stock, stock_out, manage_user
from fastapi.staticfiles import StaticFiles
app = FastAPI()

app.mount("/All_Images", StaticFiles(directory="All_Images"), name="All_Images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(inventory.router)
app.include_router(get_data.router)
app.include_router(stock.router)
app.include_router(stock_out.router)
app.include_router(manage_user.router)

@app.get("/")
def root():
    return {"message": "Welcome to the FastAPI Project!"}

def access2():
    access_roles = ["super_admin", "inventory_manager"]
    return access_roles

def access1():
    access_roles = ["inventory_manager", "super_admin", "warehouse_staff"]
    return access_roles