from datetime import datetime, timedelta, timezone
import jwt
from config import SECRET_KEY, ALGORITHM

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise Exception("Token expired")

def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, algorithm=ALGORITHM)

def decode_refresh_token(refresh_token: str):
    try:
        return jwt.decode(refresh_token, algorithms=[ALGORITHM])
    except:
        raise Exception("Refresh token expired")
    
