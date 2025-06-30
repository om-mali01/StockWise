from fastapi import HTTPException, Depends, status, APIRouter
from utils.jwt_handler import decode_access_token
from database import cursor, connection
from passlib.context import CryptContext
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer
from schemas.manage_users import Update_user

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter(tags=["manage_users"])

@router.put("/update_user")
def update_user(user: Update_user, current_user: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = decode_access_token(current_user)
        user_name = payload["sub"]
        role = payload["role"]
        
        if not user_name:
            return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"msg": "User not found"})
        if role not in ["super_admin"]:
            return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"msg": "You don't have access"})

        update_query = """UPDATE users SET
                        name = %s, mobile_number=%s, email=%s, role=%s 
                        WHERE user_name=%s"""
        cursor.execute(update_query, (user.name, user.phone_number, user.email, user.role, user.user_name))
        connection.commit()
        return {"msg": "User updated successfully", "status": True, "status_code":200}
    except Exception as e:
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={"msg": f"Internal server error {e}"})
    
@router.delete("/delete_user")
def delete_user(delete_username: str, current_user: Annotated[str, Depends(oauth2_scheme)]):
    try:
        payload = decode_access_token(current_user)
        user_name = payload["sub"]
        role = payload["role"]
        if not user_name:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={"msg": "User not found"})
        if role not in ["super_admin"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={"msg": "You don't have access"})
    
        cursor.execute("DELETE FROM users WHERE user_name = %s", (delete_username,))
        connection.commit()

        return {"msg": "User deleted !!"}
        
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{e}")
