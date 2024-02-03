'use client'
import { webSocketChatApiAddress } from '@/lib/RequestQueries'
import { WebSocketClient } from '@/lib/WebSocketClient'
import { setSendMessage } from '@/lib/redux/slice/WebSocketSlice'
import { useAppSelector } from '@/lib/redux/store'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'

  

export default  function WebSocketTemp() {
    const user_id = useAppSelector((state) => state.AuthReducer.value.user_id);
    const chat_id =  useAppSelector((state) => state.PromptChatReducer.value.apiRes.chat_id);
    const isWebSocketOpen = useAppSelector((state)=>state.WebSocketReducer.value.isOpen)  
    const isSendMessage = useAppSelector((state)=>state.WebSocketReducer.value.sendMessage)
    const userMessage = useAppSelector((state)=>state.PromptChatReducer.value.userMessage)
    



    const socketMemo = useMemo(()=>{
    const socket= new WebSocket(webSocketChatApiAddress)

return socket
    },[])

    const dispatch = useDispatch()
    console.log('webSocketTemp run')
    useEffect(()=>{
        async function webSocketHandler(){
            const webSocketClientProps = {
              user_id,
              chat_id,
              userMessage,
              isSendMessage,

              socket:socketMemo,
              dispatch,
            };
            console.log({webSocketClientProps})
            await WebSocketClient(webSocketClientProps)
          }
          webSocketHandler()
        
    },[])

    if(isSendMessage){
        console.log({userMessage})
        socketMemo.send(userMessage)
        dispatch(setSendMessage(false))
    }
return<></>

}

