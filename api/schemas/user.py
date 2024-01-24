from uuid import UUID

from pydantic import BaseModel


class UserBase(BaseModel):
    email:str


class UserAuth(UserBase):
    password:str
    
class TokenData(UserBase):
    id:str
    
class UserCreate(UserBase):
    username:str
    password:str
    
class UserSystem(UserBase):
    id:UUID
    email:str
    password:str
