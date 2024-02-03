'use client'

import { useState } from "react"
import { Input } from "./ui/input"

const UserInput = () => {
    const [message, setMessage] =useState('')
    const [isWebSocketOn,setIsWebSocketOn] = useState(false)


    


  return (
    <div>
        <Input 
        value={message}
        onChange={(e)=>setMessage(e.target.value)}
        placeholder="Type your message"
    disabled={isWebSocketOn}
        />
    </div>
  )
}

export default UserInput