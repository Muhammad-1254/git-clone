from fastapi import UploadFile
from pydantic import BaseModel


class Chat(BaseModel):
    user_id: str
    conversation_history: list[dict]



class ChatCreateBase(BaseModel):
    prompt:str


    
class ChatNewCreate(BaseModel):
    user_id:str

    
class ChatCreate(ChatNewCreate):
    chat_id:str
    
class ChatPrevConversation(ChatCreate):
    chat_id:str

class ChatConversationVoice(BaseModel):
    user_id:str
    chat_id:str|None=None

    
    # id = Column(Integer, primary_key=True ,index=True)
    # user_id=Column(String, ForeignKey('users.id'), nullable=False)
    # conversation_history = Column(ARRAY(JSON))
    # owner=relationship('User', back_populates='user_chats')
    # id = Column(Integer, primary_key=True ,index=True)
    # user_id=Column(String, ForeignKey('users.id'), nullable=False)
    # conversation_history = Column(ARRAY(JSON))
    # owner=relationship('User', back_populates='user_chats')
    