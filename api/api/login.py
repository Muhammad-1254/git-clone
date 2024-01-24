from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload

# from api.utils.utils import authenticate_user, create_access_token
from api.utils.user_utils import (authenticate_user, create_access_token,
                                  get_user_by_email_or_id, verify_password)
from db.database import get_db
from db.models.User import User
from schemas.user import TokenData, UserAuth, UserSystem

router = APIRouter()



@router.post('/login',summary='login user and create access token')
async def login(user:UserAuth, db:Session=Depends(get_db)):

    user_exist = authenticate_user(user ,db)
    
    print(f'user_exist: {user_exist}')
    if user_exist is not None:
        return {'message':'login successfully', 'user':user_exist}
    

    
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='user not found')
    
    # return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Something wen\'t wrong')


@router.get('/api/v1/users/{user_id}',)
async def get_user_data(user_id:str,db:Session=Depends(get_db)):
    db_user = db.query(User).options(joinedload(User.userchats)).filter(User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

    
    
@router.post('/token', summary='get access token')
async def get_token(form_data: OAuth2PasswordRequestForm=Depends(),db:Session=Depends(get_db)):
    print(f"form_data: {form_data.username}")
    user_exist = get_user_by_email_or_id(email=form_data.username, db=db)
    
    if user_exist is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    hashed_password = user_exist.password
    if not verify_password(form_data.password, hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    print(f'user_id: {user_exist.id}')
    print(f'email: {user_exist.email}')
    return {
        "access_token": create_access_token(user=TokenData(id=user_exist.id, email=user_exist.email)),
        "refresh_token":''
        # "refresh_token": utils.create_refresh_token(user_exist.email),
    }



