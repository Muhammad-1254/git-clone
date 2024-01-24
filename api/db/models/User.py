from sqlalchemy import (ARRAY, JSON, Boolean, Column, ForeignKey, Integer,
                        String)
from sqlalchemy.orm import relationship

from db.database import Base
from db.models.mixin import Timestamp


class User(Timestamp, Base):
    __tablename__ ='users'
    id = Column(String, primary_key=True, index=True)
    username=Column(String, nullable=False)
    email=Column(String, unique=True, nullable=False)
    password=Column(String, nullable=False)
    userchats=relationship('UserChat', back_populates='owner')
    
    
class UserChat(Timestamp,Base):
    __tablename__ ='userchats'
    
    id = Column(Integer, primary_key=True ,index=True)
    user_id=Column(String, ForeignKey('users.id'), nullable=False)
    conversation_history = Column(ARRAY(JSON))
    owner=relationship('User', back_populates='userchats')
    
    

