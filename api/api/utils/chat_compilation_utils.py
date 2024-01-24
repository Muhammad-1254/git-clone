import json
from typing import Annotated

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from db.database import get_db
from db.models.User import UserChat
from openai_chat.openai_connection import (chat_completion,
                                           spt_chat_compilation,
                                           tts_chat_compilation)
from schemas.chat import ChatConversationVoice, ChatCreate


def upload_file(file: UploadFile): 
    # checking file type
    if file.content_type !='audio/mpeg':
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='File is not audio')
    # checking file size
    file_size = file.size /1024 # in kb
    if file_size > 1024: # 1 mb
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='File size is too large')
    elif file_size < 5:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='File size is too small')
    return file

async def speech_to_text(user_id:str,file: UploadFile): 
    file_name = f"storage/temp_voices/{user_id}_user.mp3"
    with open(file_name, 'wb') as f:
        f.write(await file.read())
        f.close()
        print(f'storage voice: {f.name}')
    prompt = spt_chat_compilation(file_name)
    return prompt

async def text_to_speech(user_id:str,prompt:str): 
    file_name = f"storage/temp_voices/{user_id}_system.mp3"
    tts_chat_compilation(file_name, prompt)
    
    


    
async def conversation_voice(chat_data:ChatConversationVoice, file:UploadFile,
                             db:Session):
    try:
        if chat_data.chat_id is not None:
            
            history = db.query(UserChat).filter(UserChat.id == chat_data.chat_id).first()
            print(f"history: {history}")
            if history.user_id != chat_data.user_id:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={'message':'Record not found or may be wrong user_id', 'data':[]} )
            
            print('id match')
            # create chat with conversation history
            system_res = await speech_to_text(chat_data.user_id,file)
            print(f"system_res: {system_res}")
            
            print(f"db_chat['conversation_history']: {history.conversation_history}")
            message = chat_completion(prompt=system_res,conversation_history=history.conversation_history)
            print(f'message: {message}')
            await text_to_speech(user_id=chat_data.user_id,prompt=message)
            db.query(UserChat).filter(UserChat.id == chat_data.chat_id).update(
        {"conversation_history": history.conversation_history+[{"role":"user","content":system_res},{"role": "assistant", "content": message}]})
            db.commit()
            db.refresh(history)        
            audio_file_path =f'storage/temp_voices/{chat_data.user_id}_system.mp3'
            return HTTPException(status_code=status.HTTP_200_OK, detail={'message':'send successfully','data':history.conversation_history[-1], 'voice':file},)
                
                
                
        
        
        else:
            conversation_history = []
            system_res = await speech_to_text(chat_data.user_id,file)
            conversation_history.append({'role': 'user', 'content': system_res})
            message = chat_completion(prompt=system_res,conversation_history=conversation_history)
            await text_to_speech(user_id=chat_data.user_id,prompt=message)
            print(f"message: {message}")  
            conversation_history.append({'role': 'assistant', 'content': message})
            new_chat = UserChat(user_id=chat_data.user_id,conversation_history=conversation_history,)
            db.add(new_chat)
            db.commit()
            db.refresh(new_chat)
            return new_chat.id
        
    except Exception as e:
        return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={'message':'something went wrong','error':e.args})
    
        
        
    
    
    