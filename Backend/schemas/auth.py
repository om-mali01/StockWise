from pydantic import BaseModel

class RegistrationUser(BaseModel):
    user_name: str
    name: str
    email: str
    mobile_no: str | None = None
    password: str
    role: str

class LoginUser(BaseModel):
    user_name: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    msg: str
    role: str
