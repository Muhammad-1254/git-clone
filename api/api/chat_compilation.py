import asyncio
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, WebSocket, status
from sqlalchemy import delete
from sqlalchemy.orm import Session, joinedload

from db.database import get_db
from db.models.User import User, UserChat
from openai_chat.openai_connection import chat_completion, chat_completion_temp
from schemas.chat import Chat, ChatCreate, ChatNewCreate, ChatPrevConversation

router = APIRouter()


# creating new chat history
@router.post("/new")
async def create_new_chat(chat_data: ChatNewCreate, db: Session = Depends(get_db)):
    """Create new chat with Chat compilation API"""
    
    try:
        # checking if user_id exist or not
        user_exist = db.query(User).filter(User.id == chat_data.user_id).first()
        if user_exist is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='user not found')
        conversation_history = []
        conversation_history.append({"role":"user","content":chat_data.prompt})
        # get answer from chat bot
        message = chat_completion(prompt=chat_data.prompt,
                                conversation_history=conversation_history)
        print(f"message: {message}")
        conversation_history.append({'role': 'assistant', 'content': message})
        new_chat = UserChat(user_id=chat_data.user_id,
                            conversation_history=conversation_history,)
        db.add(new_chat)
        db.commit()
        db.refresh(new_chat)
        return HTTPException(status_code=status.HTTP_200_OK, detail={'message':'send successfully','data':new_chat.conversation_history[-1]},)        
    except Exception as e:
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={'message':'something went wrong','error':e.args})


@router.post("/conversation")
async def create_chat(chat_data: ChatCreate, db: Session = Depends(get_db)):
    """Resume your conversation with Chat Compilation API"""
    try:
        # getting conversation history
        history = db.query(UserChat).filter(UserChat.id == chat_data.chat_id).first()
        if history is None:
        
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='record not found')
        elif history.user_id != chat_data.user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Something went wrong')
        print(f"history: {history}")
        # get answer from chat bot
        message = chat_completion(prompt=chat_data.prompt,
                                conversation_history=history.conversation_history)

        db.query(UserChat).filter(UserChat.id == chat_data.chat_id).update(
            {"conversation_history": history.conversation_history+[{"role":"user","content":chat_data.prompt},{"role": "assistant", "content": message}]})

        print(f"message: {message}")

        db.commit()
        db.refresh(history)
        return HTTPException(status_code=status.HTTP_200_OK, detail={'message':'send successfully','data':message})
    except Exception as e:
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={'message':'something went wrong','error':e.args})

@router.post('/prev_conversation')
async def chat_with_previous_conversation(chat_data: ChatPrevConversation, db: Session = Depends(get_db)):
    """Start new Chat with Previous Chat Chat Compilation API"""
    # getting conversation history
    try:
        
        history = db.query(UserChat).filter(UserChat.id == chat_data.chat_id).first()
        if history is None:
        
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='record not found')
        elif history.user_id != chat_data.user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Something went wrong')
        

        print(f"history: {list(history.conversation_history)}")


        # get answer from chat bot
        message = chat_completion(prompt=chat_data.prompt,
                                conversation_history=history.conversation_history)
        print(f"message: {message}")
        history.conversation_history.append({"role":"user","content":chat_data.prompt})
        history.conversation_history.append({'role': 'assistant', 'content': message})
        
        new_chat = UserChat(user_id=chat_data.user_id,
                            conversation_history=history.conversation_history,)
        db.add(new_chat)
        db.commit()
        db.refresh(new_chat)
        return HTTPException(status_code=status.HTTP_200_OK, detail={'message':'send successfully','data':new_chat})
    except Exception as e:
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={'message':'something went wrong','error':e.args})


@router.delete('/delete/{user_id}/{chat_id}')
async def delete_chat_by_id(user_id: str, chat_id: str, db: Session = Depends(get_db)):
    """Delete conversation history from table Chat Compilation API"""

    delete_chat = db.query(UserChat).filter(UserChat.id == chat_id)
    if delete_chat.first() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail={'error':'chat record not found not found','data':[]})

    if delete_chat.first().user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail={'message':'user not found with that id','data':[]})
    try:
        delete_chat.delete(synchronize_session=False)
        print(f"delete_chat: {delete_chat}")
        db.commit()
        return HTTPException(status_code=status.HTTP_200_OK, detail=f"chat with id {chat_id} deleted")
    except Exception as e:
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={'message':'something went wrong','error':e.args})
    
    
# creating new chat history
@router.websocket('/chat')
async def websocket_endpoint(websocket: WebSocket, ):

    """Create new chat with Chat compilation API"""
    pass    
    
from api.websocket.web_sockets import websocket_manager

temp_list = []
# creating new chat history
@router.get("/new/temp")
async def create_new_chat(user_id:str, db: Session = Depends(get_db)):
    """Create new chat with Chat compilation API"""
    
    try:
        # checking if user_id exist or not
        user_exist = db.query(User).filter(User.id == user_id).first()

        if user_exist is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='user not found')
        temp_list.append(user_id)
        print(f"temp_list: {temp_list}")
        return HTTPException(status_code=status.HTTP_200_OK, detail='send successfully')        
    except Exception as e:
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={'message':'something went wrong','error':e.args})

data = ''
@router.websocket('/socket/temp')
async def websocket_endpoint(websocket: WebSocket, ):
    """Create new chat with Chat compilation API"""
    try:
        await websocket.accept()
        while True:
            data = await websocket.receive_text()
            print(f"data: {data}")

            # get answer from chat bot
            # message = await 
            # print(f"message: {message}")
            async for text in chat_completion_temp(prompt=data,):
                await websocket.send_text(text)
            # await websocket.send_text(f"message: {message}")
            await asyncio.sleep(0.1)
    except Exception as e:
        print(f"error: {e}")
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={'message':'something went wrong','error':e.args})
    # finally:
    #     await websocket.close()
    #     print(f"temp_list: {temp_list}")


