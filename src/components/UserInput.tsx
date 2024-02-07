"use client";

import { getChatByUserIdCharId } from "@/lib/RequestQueries";
import { setAddingNewChatHistory, setRealTimeUserChat } from "@/lib/redux/slice/UserChatSlice";
import {
  setUserMessage
} from "@/lib/redux/slice/WebSocketSlice";
import { useAppSelector } from "@/lib/redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import webSocketService from "./WebSocketService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const UserInput = () => {
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
              // dispatch(setEmptyRealTimeUserChat(null))
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
    dispatch(setRealTimeUserChat({userMessage}))
    const ws = webSocketService.getSocket()
   if (ws !== null){
    ws.send(userMessage)
    dispatch(setUserMessage(""))
   }
   
  }

  return (
    <div className="flex flex-col items-start justify-normal gap-y-5">
      <div className="">
        <p>{modelResponse}</p>
      </div>
        <h1>User Input Field</h1>
      <div  className="flex  items-center gap-x-2">
        
        <Input
          value={userMessage}
          onChange={(e) => dispatch(setUserMessage(e.target.value))}
          placeholder="Enter your message"
        />
        <Button onClick={sendMessageHandle}>Send message</Button>
      </div>
    </div>
  );
};

export default UserInput;
