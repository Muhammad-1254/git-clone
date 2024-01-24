import os
from typing import Annotated

from fastapi import (APIRouter, Depends, File, Form, HTTPException, Request,
                     UploadFile, status)
from fastapi.responses import StreamingResponse

from api.utils.chat_compilation_utils import (conversation_voice,
                                              speech_to_text, text_to_speech,
                                              upload_file)
from db.database import get_db
from schemas.chat import ChatConversationVoice, ChatCreate

router = APIRouter()


# if chat_id is None: then creates new chat else chat_history by user_id
@router.post('/voice_conversation')
async def conversation_by_voice(user_id:str=Form(), chat_id:str=Form(None),
                                file:Annotated[UploadFile,bytes] = Depends(upload_file),
                                db=Depends(get_db)):
    print(f'file name: {file.filename}')
    print(f'chat_id: {chat_id}')
    res = await conversation_voice(chat_data=ChatConversationVoice(user_id=user_id,chat_id=chat_id), 
                             file=upload_file(file),
                             db=db,
              
                             )
    print(f'response {res}')
    return res







#temp 

# @router.post("/uploadfile/")
# async def create_upload_file(file: UploadFile = File(...)):
#     return {"filename": file.filename}

# @router.get("/getfile")
# async def get_file():
#     file_path = "storage/temp_voices/7b33b633-a54c-4b06-b57e-3416611a4776_system.mp3"
#     return StreamingResponse(open(file_path, "rb"), media_type="audio/mpeg")