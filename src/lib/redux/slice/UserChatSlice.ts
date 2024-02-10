import { createSlice } from "@reduxjs/toolkit";

export type TUserHistoryChat={
    id:string,
    user_id:string,
    created_at:string,
    updated_at:string,
    conversation_history:{
        role:string,
        content:string,
    }[],

}

export type TRealTimeUserChat = {
        role:string,
        content:string,
}
export type TUserChat={
    userHistoryChat:TUserHistoryChat[],
    realTimeUserChat:TRealTimeUserChat[],
    chatPageActiveChat:string|null
}

const initialState:TUserChat ={
    userHistoryChat:[],
    chatPageActiveChat:null,
    realTimeUserChat:[]
}





const UserChatSlice = createSlice({
    name:'userChatSlice',
    initialState:{
        value:initialState
    },
    reducers:{
        
        // store user chat only
        setUserHistoryChat:(state, action)=>{
            state.value.userHistoryChat = action.payload
        },
        setAddingNewChatHistory:(state,action)=>{
           // checking if new chat then adding new chat else adding to existing chat
        let tempList = []
        state.value.chatPageActiveChat = action.payload.id
        for(let i=0;i<state.value.userHistoryChat.length;i++){
        let data = state.value.userHistoryChat
            if(state.value.userHistoryChat[i].id === action.payload.id){
                tempList= [state.value.userHistoryChat[i].conversation_history.map(item=>item), ...action.payload.conversation_history]
                state.value.userHistoryChat[i].conversation_history = tempList
                console.log({tempList})
                console.log('after adding to userChat: ',state.value.userHistoryChat[i].conversation_history.length)
                return;
            }
        }
        state.value.userHistoryChat  = [...state.value.userHistoryChat , action.payload]



           
        },
        // chat page data
        setRealTimeUserChat:(state, action)=>{
          if(action.payload.userMessage){
            state.value.realTimeUserChat = [...state.value.realTimeUserChat, {role:'user', content:action.payload.userMessage}, {role:'assistant',content:''}]
          }else if(action.payload.modelResponse){
            let temLen = state.value.realTimeUserChat.length-1;
            let spliceValue = state.value.realTimeUserChat.splice(temLen, 1)[0]
            state.value.realTimeUserChat = [...state.value.realTimeUserChat,{role:'assistant', content: spliceValue.content+ action.payload.modelResponse}]
          }
        },
        setEmptyRealTimeUserChat:(state,action)=>{
            state.value.realTimeUserChat = []
        },
        // chat page data
        setChatPageActiveChat:(state, action)=>{  
            state.value.chatPageActiveChat = action.payload
        },
        // if new chat then chat all chat data should be removed
        setNewChatChatPage:(state,action)=>{
                state.value.realTimeUserChat = []
                state.value.chatPageActiveChat = null
           
        }


    }
})

export const { setUserHistoryChat, setRealTimeUserChat, setChatPageActiveChat, setAddingNewChatHistory,setEmptyRealTimeUserChat, setNewChatChatPage, } = UserChatSlice.actions;   
export default UserChatSlice.reducer;

