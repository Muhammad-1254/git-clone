import { createSlice } from "@reduxjs/toolkit";

export enum ChatType {
  newChat,
  previousChat,
}
type TWebSocketSlice = {
  chat_id: null | string;
  userMessage: string;
  modelResponse: string;
  chatType: ChatType | null;
  isSocketOpen: false;
  userFieldComponent:null|JSX.Element
  runUseEffect:number
  isVoiceMessage:boolean,
  audio:Blob|null|string
};

const initialState: TWebSocketSlice = {
  isSocketOpen: false,
  chat_id: null,
  modelResponse: "",
  userMessage: "",
  chatType: null,
  userFieldComponent:null,
  runUseEffect:0,
  isVoiceMessage:false,
  audio:null
};

const WebSocketSlice = createSlice({
  name: "webSocketSlice",
  initialState: {
    value: initialState,
  },
  reducers: {
    setIsSocketOpen: (state, action) => {
      state.value.isSocketOpen = action.payload;
    },
    setChatId: (state, action) => {
      state.value.chat_id = action.payload;
    },
    setUserMessage: (state, action) => {
      state.value.userMessage = action.payload;
    },
    setModelResponse: (state, action) => {
      state.value.modelResponse = state.value.modelResponse + action.payload;
    },
    setChatType: (state, action) => {
      state.value.chatType = action.payload;
    },
    setUserFieldComponent:(state,action)=>{ 
        state.value.userFieldComponent = action.payload;
    },
    setRunUseEffect:(state, action)=>{
      state.value.runUseEffect = action.payload
    },
    setIsVoiceMessage:(state, action)=>{
      state.value.isVoiceMessage =action.payload;
    },
    setAudio:(state, action)=>{
      state.value.audio = action.payload
    }
    
  },
});

export const {
  setIsSocketOpen,
  setChatId,
  setModelResponse,
  setUserMessage,
  setChatType,
  setUserFieldComponent,
  setRunUseEffect,
  setIsVoiceMessage,
  setAudio
} = WebSocketSlice.actions;
export default WebSocketSlice.reducer;
