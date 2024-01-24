'use client'

import { useEffect, useState } from "react"


const WebSocketTest = () => {
    const [messageData, setMessageData] = useState('')
    const [message, setMessage] = useState('')
   const [socket, setSocket]  = useState<WebSocket| null> (null);
    useEffect(()=>{
   const newSocket = new WebSocket('ws://localhost:8000/api/v1/users/chat/socket/temp')
   newSocket.onopen = () => {
      console.log('websocket connected connected')
      console.log({newSocket})
   }
   newSocket.onmessage = (event) => {
      console.log('message revcived')
      setMessageData(event.data)
   }
   newSocket.onclose = () => {
      newSocket.close()
   }
   setSocket(newSocket)
 },[])



 async function sendMessageBtn(){
   if (socket && socket.readyState === WebSocket.OPEN){
      socket.send(message)
      setMessage('')
   }

}
  return (
   <div>

    <div className="flex flex-col items-center justify-center w-screen h-screen bg-black text-white">
        <input className="text-black" type="text" value={message} onChange={(e)=>setMessage(e.target.value)}/>
        <button onClick={sendMessageBtn}> send</button>
    </div>
    <div>
      <h1 className="text-xl font-semibold">Response data</h1>
      <p className="text-xs font-semibold">{messageData}</p>
    </div>
   </div>
  )
}

export default WebSocketTest