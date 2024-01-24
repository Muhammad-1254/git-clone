'use client'

import axios from 'axios'
import { useState } from 'react'


const UserChat = () => {
    const [input, setInput] = useState('')
    const [chats,setChats]:any = useState([])
    async function handleBtn() {  
        let body = {prompt:input, user_id:'3f2c8a5c-b96d-41bb-90f4-e08617e3f521'}
        
        try {
            console.log("func starts")
           const response =await axios.post('/api/v1/users/chat/new',body)
           console.log("res starts")

            const data = await response.data
            console.log({data})
            console.log('detail',data.detail.data)
            setChats([...chats, data.detail.data])
            console.log({chats})
        } catch (error:any) {
            console.log({error})
        }
    }
    return (
    <div>
        
        <div>
        <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='enter you query'
            type='text'
            className='w-full p-2 rounded-lg text-black'
            />
            <button onClick={handleBtn} className='bg-blue-500 text-white p-2 rounded-lg'>
submit
                </button>
        </div>
        
        <div className='bg-red-600 w-80 h-80'>
            {chats.length>0&& chats.map((item:any,index:number) => (
                <p key={index}>
                    <p>{item.role}</p>
                    <p>{item.content}</p>

                </p>
            ))}
        </div>
        
    </div>
  )
}

export default UserChat