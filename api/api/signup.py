# from uuid import uuid4

# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session

# from api.utils.user_utils import get_hashed_password, get_user_by_email_or_id
# from db.database import get_db
# from db.models.User import User
# from schemas.user import UserCreate

# router = APIRouter()



# @router.post('/signup', summary='create_user')
# async def create_user(user:UserCreate, db:Session=Depends(get_db)):
#     user_exist = get_user_by_email_or_id(email=user.email,db=db)
#     if user_exist is not None:
#         return HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User already exist')
    
#     new_user = User(
#         id=str(uuid4()),
#         username=user.username,
#         email=user.email,
#         password=get_hashed_password(user.password)
#     )
#     print(f'new_user; {new_user}')
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return new_user