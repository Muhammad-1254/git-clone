import axios from "axios"


export const getChatByUserIdCharId = async (user_id:string, chat_id:string)=>{
    try {
        
        const res = await axios.get(`/api/v1/users/chat/${user_id}/${chat_id}`)
        console.log({res})
        return res.data
    } catch (error:any) {   
        console.log({error})
    }
}


export const getChatDataByUserId = async(user_id:string)=>{
    const res = await axios.get(
        `/api/v1/users/chat/${user_id}`
      );
      console.log({res})
      return res;
}

export const deleteChatByUserIdChatId = async (user_id:string, chat_id:string) => {
    const res = await axios.delete(
        `/api/v1/users/chat/delete/${user_id}/${chat_id}`
        );
        return res
    }



export const webSocketChatApiAddress =  "/api/v1/users/chat/socket/chat"
export const webSocketVoiceApiAddress =  "ws://localhost:8000/api/v1/users/chat/socket/chat/voice"