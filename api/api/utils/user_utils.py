import os

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from db.database import get_db
from db.models.User import User
from schemas.user import TokenData, UserAuth

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"


def get_user_by_email_or_id(email:str = None, id:str=None, db:Session=None):
    if email:
        return db.query(User).filter(User.email == email).first()
    elif id:
        return db.query(User).filter(User.id == id).first()
    else:
        return None


context = CryptContext(schemes=['bcrypt'], deprecated='auto')


def verify_password(password:str, hash_password:str)->bool:
    return  context.verify(password, hash_password)

def get_hashed_password(password:str)->str: 
    return context.hash(password)

def authenticate_user(user:UserAuth, db:Session):
    user_exist = get_user_by_email_or_id(email=user.email, db=db)
    if user_exist is None:
        return None
    if not verify_password(user.password, user_exist.password) :
        return  HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Incorrect email or password', headers={'WWW-Authenticate':'Bearer'})    
    return user_exist

def create_access_token(user:TokenData):
    to_encode={
        'id':user.id,
        'email':user.email
    }
    encoded_jwt =jwt.encode(to_encode,SECRET_KEY, ALGORITHM)
    return encoded_jwt
    
    
    
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token",scheme_name='JWT' )  
    
async def get_current_user(token:str=Depends(oauth2_scheme)):
    print('get_current_user')
    try:
        print(f'token :{token}')
        payload = jwt.decode(token,  SECRET_KEY, ALGORITHM)
        print(f'payload: {payload}')
        if payload is None:
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED, detail='Could not validate credentials',
                headers={'WWW-Authenticate':'Bearer'}
                )
        token_data =TokenData(email=payload['email'], id=payload['id'])
        print(f'token_data: {token_data.email}')
    except JWTError:
        raise HTTPException(
                status.HTTP_401_UNAUTHORIZED, detail='JWT Error',
                headers={'WWW-Authenticate':'Bearer'}
            )
    user = get_user_by_email_or_id(email=token_data.email,db=Depends(get_db))
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='user not found')
    return user
