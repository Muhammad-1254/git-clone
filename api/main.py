
import asyncio
from uuid import uuid4

from auth.auth import get_session_cookie_value
from db.database import engine
from db.models.User import Base
from fastapi import Depends, FastAPI, Request, Response, WebSocket, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from schemas.user import UserAuth, UserSystem

from api import chat_compilation, login, signup, whisper
from api.utils.user_utils import get_current_user

Base.metadata.create_all(bind=engine)


app = FastAPI()

with open('index.html') as f:
    html_content = f.read()


@app.get('/')
async def index():
    return HTMLResponse(html_content)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) :
    """
    Websocket for AI responses
    """
    await websocket.accept()
    while True:
        message = await websocket.receive_text()
        await websocket.send_text(message)
        asyncio.sleep(5)

origins=[
    'http:localhost:3000'
]
# developing mode allowing all origins
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
     allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.middleware('http')
# async def adding_session_id(request:Request, call_next):
#     session_id =  has_session_id =  request.cookies.get('gpt_clone_access_token')
#     print(f'session id: {session_id}')
#     if session_id is None:
#         print('session id is none')
#         # creating a new session id temp for  now after we will ad jwt token
#         session_id = str(uuid4())
#         print('creating session id:',session_id)
#         request.cookies.setdefault('gpt_clone_access_token', session_id)
#     response: Response = await call_next(request)
#     print(f'request cookie set: {request.cookies.get("gpt_clone_access_token")}')
#     print(f'response: {response}')
#     if has_session_id is None:
#         print('session id is none')
#         # response.set_cookie(key='gpt_clone_access_token', value=session_id, httponly=True)
#         response.headers['Set-Cookie'] = \
#             f'gpt_clone_access_token={session_id}; Path=/; HttpOnly'
#         print("again finding cookie :",request.cookies.get('gpt_clone_access_token'))
#     return response

# @app.get("/assign-session", status_code=status.HTTP_200_OK)
# async def assign_session(cookie: str = Depends(get_session_cookie_value)):
#     if cookie is None:
#         return {"message": "No cookie found"}
#     return {"message": "Cookie found", "cookie": cookie}




# @app.get('/me')
# async def protected(user:UserSystem = Depends(get_current_user)):
#     print(f'user: {user}')
#     print("protected function starts")
#     return user



# @app.


app.include_router(login.router,)
app.include_router(signup.router)
app.include_router(chat_compilation.router, prefix='/api/v1/users/chat')
app.include_router(whisper.router, prefix='/api/v1/users/chat/voice')













if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app='main:app', host='0.0.0.0',
                port=8000, reload=True, workers=1)                