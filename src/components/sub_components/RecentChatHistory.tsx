"use client";

import { deleteChatByUserIdChatId, getChatDataByUserId } from "@/lib/RequestQueries";
import { setChatPageActiveChat, setEmptyRealTimeUserChat, setUserHistoryChat } from "@/lib/redux/slice/UserChatSlice";
import { setChatId, setRunUseEffect } from "@/lib/redux/slice/WebSocketSlice";
import { useAppSelector } from "@/lib/redux/store";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { MdDelete } from "react-icons/md";
import { VscDebugContinueSmall } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import webSocketService from "../WebSocketService";
import { Card } from "../ui/card";
const RecentChatHistory = () => {
  const user_id = useAppSelector((state) => state.AuthReducer.value.user_id);
  const [loading,setLoading] = useState(false)
  const userChatHistory = useAppSelector(
    (state) => state.UserChatReducer.value.userHistoryChat
  );
  const dispatch = useDispatch();
  useEffect(() => {
    async function getRecentHistory() {
      const res = await getChatDataByUserId(user_id);
      dispatch(setUserHistoryChat(res.data));
    }

    getRecentHistory();
  }, []);

  function editChatHandle(chat_id:string){
    // adding the chat in chatPageData for display particular chat

    dispatch(setChatPageActiveChat(chat_id))
    dispatch(setEmptyRealTimeUserChat(null))
    const ws = webSocketService.getSocket();
    if (ws === null) {
      webSocketService.setSocket();
    } else {
      ws.close();
      webSocketService.setSocket();
    }
    dispatch(setChatId(chat_id));
    // for running again and again useEffect
    dispatch(setRunUseEffect(Math.random()))

  }

  async function deleteChatHandle(chat_id:string){
    setLoading(true)
    dispatch(
        setUserHistoryChat(
            userChatHistory.filter((item)=>item.id !== chat_id)))
    await deleteChatByUserIdChatId(user_id, chat_id)
setLoading(false)  
}
  return (
    <div className="flex flex-col items-start gap-y-5">
      {userChatHistory.length>0&& userChatHistory?.map((item) => {
        return (
          <Card
            key={item.id}
            className="w-full h-10 group md:h-14  relative rounded-3xl"
          >
            <p
              className="w-full h-full flex items-center justify-start   text-nowrap text-ellipsis overflow-hidden
            px-1.5 
            "
            >
              {
               item.conversation_history.length>0&& item.conversation_history[item.conversation_history.length - 1]
                  .content
              }
            </p>

            <div
              onClick={() => (
                editChatHandle(item.id)
        )}
              className="  absolute top-0 left-0 group-hover:w-[calc(100%-50px)]  overflow-hidden w-0 h-full
             duration-150 ease-in-out  bg-gray-600 dark:bg-neutral-400 bg-opacity-75 dark:bg-opacity-80   
             flex items-center justify-center group-hover:border border-green-500 dark:border-green-600
             rounded-l-3xl
text-3xl

hover:text-green-500 dark:hover:text-green-600 cursor-pointer

             "
            >
              <VscDebugContinueSmall />
            </div>
            <div
              onClick={() => (
                deleteChatHandle(item.id)
              )}
              className="absolute right-0 top-0 group-hover:h-full w-[50px] h-0 overflow-hidden
            duration-150 ease-linear  bg-gray-600 dark:bg-neutral-400 bg-opacity-75 dark:bg-opacity-80   
            flex items-center justify-center group-hover:border border-red-500 dark:border-red-600
             rounded-r-3xl
             text-3xl 
            hover:text-red-500 dark:hover:text-red-600 cursor-pointer"
            >
                {
                loading?
                <span className="hover:text-white animate-spin">
                    <AiOutlineLoading3Quarters/>
                     </span>:

              <MdDelete />
                }
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default RecentChatHistory;
