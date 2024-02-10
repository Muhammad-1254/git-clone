"use client";

import { getChatByUserIdCharId } from "@/lib/RequestQueries";
import { setAddingNewChatHistory, setEmptyRealTimeUserChat, setRealTimeUserChat } from "@/lib/redux/slice/UserChatSlice";
import {
  setUserMessage
} from "@/lib/redux/slice/WebSocketSlice";
import { useAppSelector } from "@/lib/redux/store";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoSend } from "react-icons/io5";
import { useDispatch } from "react-redux";
import webSocketService from "./WebSocketService";
import { Button } from "./ui/button";


const UserInput = () => {
  // const [textAreaWidth, setTextAreaWidth] = useState(0)
  const [textAreaHeight,setTextAreaHeight] = useState(55)
  const [lineHeight, setLineHeight] = useState(55)
  const [btnLoading, setBtnLoading] = useState(false)
  const user_id = useAppSelector((state)=>state.AuthReducer.value.user_id)
  const userMessage = useAppSelector(
    (state) => state.WebSocketReducer.value.userMessage
  );
  const modelResponse = useAppSelector(
    (state) => state.WebSocketReducer.value.modelResponse
  );
  const chat_id = useAppSelector(
    (state) => state.WebSocketReducer.value.chat_id
  );
  const runUseEffect = useAppSelector((state)=>state.WebSocketReducer.value.runUseEffect)

  const dispatch = useDispatch();



  useEffect(() => {
    let tempChatId = chat_id;
    try {
       const ws = webSocketService.getSocket()
      // const ws = WebSocketService.getSocket();
      if (ws !== null) {
        ws.onopen = () => {
          console.log("WS open");
          const body = {
            user_id,
            chat_id: tempChatId,
          };
          ws.send(JSON.stringify(body));
          ws.onmessage = async (e) => {
            let loadData = JSON.parse(e.data);
            if (loadData.is_stream) {
              dispatch(setRealTimeUserChat({modelResponse:loadData.message}))
              // dispatch(setModelResponse(loadData.message));
            } else {
              if (tempChatId === null) {
                tempChatId = loadData.chat_id;
                const body = {
                  chat_id: tempChatId,
                };
                ws.send(JSON.stringify(body));
              }

               // fetch that upper user chat 
               const data = await getChatByUserIdCharId(user_id, loadData.chat_id)
              console.log('new chat fetch :',data)
              dispatch(setAddingNewChatHistory({...data, user_id}))
              dispatch(setEmptyRealTimeUserChat(null))
            }
          };
          ws.onclose = () => {
            console.log("WS close");
          };
          ws.onerror = () => {
            console.log("WS error");
          };
        };
      }
    } catch (error: any) {
      console.log("error happens in WS uesEffect");
    }
  }, [runUseEffect ]);

  function sendMessageHandle() {
    setBtnLoading(true)
    dispatch(setRealTimeUserChat({userMessage}))
    const ws = webSocketService.getSocket()
   if (ws !== null){
    ws.send(userMessage)
    dispatch(setUserMessage(""))
   }
   setBtnLoading(false)
   
  }


  async function inputText(text: string) {
    console.log(text);
  

    dispatch(setUserMessage(text))
    let tAreaHeightBe = 70
    const  initialTextAreaHeight = 55
  let textLength = text.length
    if (textLength%tAreaHeightBe===0) {
      
      setTextAreaHeight((textAreaHeight/100)*initialTextAreaHeight*2.1);
      setLineHeight(23)
      console.log(text.length)
      console.log(textAreaHeight);
    } else if(textLength<tAreaHeightBe || textLength ===0) {
      setTextAreaHeight(55); 
      setLineHeight(55)
    }
  }
  return (
     
    <div
    style={{height:`${textAreaHeight}px`}}
    className={` relative flex items-end   w-full bg-secondary
 h-[55px]
 ${textAreaHeight>56?"rounded-2xl":'rounded-3xl'}    
    `}
  >
    <textarea
      className={`textarea w-[75%] bg-secondary resize-none   px-3 ${textAreaHeight>56?"rounded-2xl":'rounded-3xl'}
      ring-offset-0 outline-none
`}
      value={userMessage}
      onChange={(event) => inputText(event.target.value)}
      style={{ height: `${textAreaHeight}px`, lineHeight:`${lineHeight}px` }}
    />

    <Button
      disabled={btnLoading}
      onClick={sendMessageHandle}
      type="button"
      variant={'ghost'}
      className="absolute  bottom-[9px] right-[5%]  "
    >
      {btnLoading ? (
        <div
          className="
      text-2xl font-bold animate-spin
      "
        >
          <AiOutlineLoading3Quarters />
        </div>
      ) : (
        <IoSend />
      )}
    </Button>
  </div>
  );
};

export default UserInput;
