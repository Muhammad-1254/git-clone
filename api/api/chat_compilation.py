import asyncio
from uuid import uuid4

from db.database import get_db
from db.models.User import User, UserChat
from fastapi import (APIRouter, Depends, HTTPException, WebSocket,
                     WebSocketException, status)
from openai_chat.openai_connection import chat_completion, chat_completion_temp
from schemas.chat import Chat, ChatCreate, ChatNewCreate, ChatPrevConversation
from sqlalchemy import delete
from sqlalchemy.orm import Session, joinedload

router = APIRouter()


# # creating new chat history
# @router.post("/new")
# async def create_new_chat(chat_data: ChatNewCreate, db: Session = Depends(get_db)):
#     """Create new chat with Chat compilation API"""
    
#     try:
#         # checking if user_id exist or not
#         user_exist = db.query(User).filter(User.id == chat_data.user_id).first()
#         if user_exist is None:
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='user not found')
#         conversation_history = []
#         conversation_history.append({"role":"user","content":chat_data.prompt})
#         # get answer from chat bot
#         message = chat_completion(prompt=chat_data.prompt,
#                                 conversation_history=conversation_history)
#         print(f"message: {message}")
#         conversation_history.append({'role': 'assistant', 'content': message})
#         new_chat = UserChat(user_id=chat_data.user_id,
#                             conversation_history=conversation_history,)
#         db.add(new_chat)
#         db.commit()
#         db.refresh(new_chat)
#         return HTTPException(status_code=status.HTTP_200_OK, detail={'message':'send successfully','data':new_chat.conversation_history[-1]},)        
#     except Exception as e:
#         return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={'message':'something went wrong','error':e.args})


# @router.post("/conversation")
# async def create_chat(chat_data: ChatCreate, db: Session = Depends(get_db)):
#     """Resume your conversation with Chat Compilation API"""
#     try:
#         # getting conversation history
#         history = db.query(UserChat).filter(UserChat.id == chat_data.chat_id).first()
#         if history is None:
        
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='record not found')
#         elif history.user_id != chat_data.user_id:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Something went wrong')
#         print(f"history: {history}")
#         # get answer from chat bot
#         message = chat_completion(prompt=chat_data.prompt,
#                                 conversation_history=history.conversation_history)

#         db.query(UserChat).filter(UserChat.id == chat_data.chat_id).update(
#             {"conversation_history": history.conversation_history+[{"role":"user","content":chat_data.prompt},{"role": "assistant", "content": message}]})

#         print(f"message: {message}")

#         db.commit()
#         db.refresh(history)
#         return HTTPException(status_code=status.HTTP_200_OK, detail={'message':'send successfully','data':message})
#     except Exception as e:
#         return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={'message':'something went wrong','error':e.args})

# @router.post('/prev_conversation')
# async def chat_with_previous_conversation(chat_data: ChatPrevConversation, db: Session = Depends(get_db)):
#     """Start new Chat with Previous Chat Chat Compilation API"""
#     # getting conversation history
#     try:
        
#         history = db.query(UserChat).filter(UserChat.id == chat_data.chat_id).first()
#         if history is None:
        
#             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='record not found')
#         elif history.user_id != chat_data.user_id:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Something went wrong')
        

#         print(f"history: {list(history.conversation_history)}")


#         # get answer from chat bot
#         message = chat_completion(prompt=chat_data.prompt,
#                                 conversation_history=history.conversation_history)
#         print(f"message: {message}")
#         history.conversation_history.append({"role":"user","content":chat_data.prompt})
#         history.conversation_history.append({'role': 'assistant', 'content': message})
        
#         new_chat = UserChat(user_id=chat_data.user_id,
#                             conversation_history=history.conversation_history,)
#         db.add(new_chat)
#         db.commit()
#         db.refresh(new_chat)
#         return HTTPException(status_code=status.HTTP_200_OK, detail={'message':'send successfully','data':new_chat})
#     except Exception as e:
#         return HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={'message':'something went wrong','error':e.args})


@router.delete('/delete/{user_id}/{chat_id}')
async def delete_chat_by_id(user_id: str, chat_id: str, db: Session = Depends(get_db)):
    """Delete conversation history from table Chat Compilation API"""
    print(f'delete chat_id: {chat_id}')
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
    
 

temp_list = []
@router.websocket("/socket/chat") #/socket/chat
async def create_chat(websocket:WebSocket, db: Session = Depends(get_db)):
    """"""
    try:
        await websocket.accept()
        body = await websocket.receive_json()
        print(f"body: {body}")
        user_id = body['user_id']
        chat_id = body['chat_id']
        print(f"user_id: {user_id}")
        print(f"chat_id: {chat_id}")
        if user_id not in temp_list:
            temp_list.append(user_id)
        
        while True:

        # getting conversation history if new chat then creating history
        
            bot_answer = ""
            
            # user_chat = db.query(UserChat).filter(UserChat.id == chat_id).first()
            # if user_chat is None:
            #     user_chat = UserChat(user_id=user_id,conversation_history=[],)         
            #     db.add(user_chat)
            #     db.commit()
            #     db.refresh(user_chat)   
            # elif user_chat.user_id != user_id:
                
            #     raise WebSocketException(code=status.HTTP_401_UNAUTHORIZED, reason='Something went wrong')
            # print(f"history: {user_chat}")
            
            print('waiting for prompt')
            prompt = await websocket.receive_text()
            
            print(f"prompt: {prompt}")
            
            if chat_id is not None:
                user_chat = db.query(UserChat).filter(UserChat.id == chat_id).first()   
            else:
                user_chat = UserChat(user_id=user_id,conversation_history=[])
                print(f'user_chat: {user_chat}')
            
            
            conversation_history = list(user_chat.conversation_history)
            conversation_history.append({'role': 'user', 'content': prompt})
            # print(f'')
            # get answer from chat bot
            async for text in chat_completion_temp(conversation_history):
                await websocket.send_json({
                    'is_stream':True,
                    'message':text,
                    'chat_id':None,
                })
                bot_answer += text
            
            #developing mode 
            # for letters in _data:
            #     await websocket.send_json({
            #             'is_stream':True,
            #             'message':letters,
            #             'chat_id':None,
            #         })
                # await asyncio.sleep(0.01)
                
            conversation_history.append({'role': 'assistant', 'content': bot_answer})
            if chat_id is not None:
                db.query(UserChat).filter(UserChat.id == user_chat.id).update(
                {"conversation_history": conversation_history})
                db.commit()
            else:
                user_chat.conversation_history = conversation_history
                print(f'user_id: {user_chat.id}')
                print(f'conversation_history: {list(user_chat.conversation_history)}')
                db.add(user_chat)
                db.commit()
                db.refresh(user_chat)
                print(f'user_id: {user_chat.id}')
            
            await websocket.send_json({
                    'is_stream':False,
                    'message':'message completed successfully',
                    'chat_id':user_chat.id,
                })
            print(f'chat_id: {user_chat.id}')
            
            # if chat_id is None:
            #     db.add(user_chat)
            #     db.commit()
            #     db.refresh(user_chat)
            
                
                
            # for first time if user start new conversation then assign the chat_id with new chat id 
            if chat_id is None:
                temp_chat_id  = await websocket.receive_json()
                chat_id = temp_chat_id['chat_id']
                print(f'tempChatId: {temp_chat_id}')
            
    except KeyboardInterrupt as e:
        print(f"error: {e}")
        return WebSocketException(code=status.HTTP_500_INTERNAL_SERVER_ERROR, reason="something went wrong")
    except Exception as e:
        print(f"error: {e}")
        return WebSocketException(code=status.HTTP_500_INTERNAL_SERVER_ERROR, reason="something went wrong")
    finally:
        print("websocket close from finally")
        await websocket.close()
        
        
        
        
@router.get('/{user_id}', summary='Get all previous chat data by user_id')
async def get_user_data(user_id:str,db:Session=Depends(get_db)):  
    # Todo - use joined load or any thing else for querying database
    # getting User table chat table data
    db_user = db.query(UserChat).filter(UserChat.user_id == user_id).all()    
    
    if len(list(db_user))==0:
        return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User or user_chats not found")
    sorted_data :list[UserChat]= sortByDate(db_user)
    # print(f'sorted_data: {sorted_data}')
    if len(sorted_data)>10:
        for data in sorted_data[10:]:
            db.query(UserChat).filter(UserChat.id == data.id).delete(synchronize_session=False) 
        db.commit()
   
    return sorted_data[:10]

        
       
# this function sort data by date 
def sortByDate(user_chats:list[UserChat])->list[UserChat]:
    sorted_data = sorted(user_chats, key=lambda x: x.created_at,reverse=True)
    return sorted_data


@router.get('/{user_id}/{chat_id}', summary='Get previous chat data by user_id and chat_id')
async def get_user_data_by_id(user_id:str,chat_id:str,db:Session=Depends(get_db)):
    chat_data = db.query(UserChat).filter(UserChat.id == chat_id).first()
    if chat_data.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return chat_data
    
    
    
    
    
    
#     @router.get('/{user_id}', summary='Get all previous chat data by user_id')
# async def get_user_data(user_id:str,db:Session=Depends(get_db)):
#     # db_user = db.query(UserChat).filter(UserChat.user_id == user_id).first()
#     # print(f'db_user: {db_user} ')    
#     db_user = db.query(User).filter(User.id == user_id).first()
#     if len(list(db_user.userchats))==0:
#         return []
#     db_user = db.query(User).options(joinedload(User.userchats)).filter(User.id == user_id,).first()
#     if db_user is None:
#         raise HTTPException(status_code=404, detail="User not found")
    
        
#     sorted_data :list[UserChat]= sortByDate(db_user.userchats)
#     if len(sorted_data)>10:
#         for data in sorted_data[10:]:
#             db.query(UserChat).filter(UserChat.id == data.id).delete(synchronize_session=False) 
#     db.commit()
#     user = {
#         'user_id':db_user.id,
#         'username':db_user.username,
#         'email':db_user.email,
#         'user_chats':sorted_data[:10]
#     }
#     print(f'user: {user}')
#     return user






_data = """
You can use [Tailwind](https://tailwindcss.com)'s Typography plugin to style rendered Markdown from sources such as Astro's [**content collections**](/en/guides/content-collections/).

This recipe will teach you how to create a reusable Astro component to style your Markdown content using Tailwind's utility classes.

## Prerequisites

An Astro project that:

	- has [Astro's Tailwind integration](/en/guides/integrations-guide/tailwind/) installed.
	- uses Astro's [content collections](/en/guides/content-collections/).

## Setting Up \`@tailwindcss/typography\`

First, install \`@tailwindcss/typography\` using your preferred package manager.

<PackageManagerTabs>
 	<Fragment slot="npm">
	\`\`\`shell 
	npm install -D @tailwindcss/typography
	\`\`\`
	</Fragment>
  	<Fragment slot="pnpm">
	\`\`\`shell 
	pnpm add -D @tailwindcss/typography
	\`\`\`
	</Fragment>
  	<Fragment slot="yarn">
	\`\`\`shell
	yarn add --dev @tailwindcss/typography
	\`\`\`
	</Fragment>
</PackageManagerTabs>

Then, add the package as a plugin in your Tailwind configuration file.

\`\`\`diff lang="js"
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    // ...
  },
  plugins: [
+   require('@tailwindcss/typography'),
    // ...
  ],
}
\`\`\`

## Recipe

1. Create a \`<Prose /> \` component to provide a wrapping \`<div>\` with a \`<slot />\` for your rendered Markdown. Add the style class \`prose\` alongside any desired [Tailwind element modifiers](https://tailwindcss.com/docs/typography-plugin#element-modifiers) in the parent element.

    \`\`\`astro title="src/components/Prose.astro"
    ---
    ---
    <div 
      class="prose dark:prose-invert 
      prose-h1:font-bold prose-h1:text-xl 
      prose-a:text-blue-600 prose-p:text-justify prose-img:rounded-xl 
      prose-headings:underline">
      <slot />
    </div>
    \`\`\`
    :::tip
    The \`@tailwindcss/typography\` plugin uses [**element modifiers**](https://tailwindcss.com/docs/typography-plugin#element-modifiers) to style child components of a container with the \`prose\` class. 

    These modifiers follow the following general syntax: 

      \`\`\`
      prose-[element]:class-to-apply
      \`\`\` 

    For example, \`prose-h1:font-bold\` gives all \`<h1>\` tags the \`font-bold\` Tailwind class.
    :::

2. Query your collection entry on the page you want to render your Markdown. Pass the \`<Content />\` component from \`await entry.render()\` to \`<Prose />\` as a child to wrap your Markdown content in Tailwind styles.

    \`\`\` astro title="src/pages/index.astro"
    ---
    import Prose from '../components/Prose.astro';
    import Layout from '../layouts/Layout.astro';
    import { getEntry } from 'astro:content';

    const entry = await getEntry('collection', 'entry');
    const { Content } = await entry.render();
    ---
    <Layout>
      <Prose>
        <Content />
      </Prose>
    </Layout>
    \`\`\`

## Resources"""