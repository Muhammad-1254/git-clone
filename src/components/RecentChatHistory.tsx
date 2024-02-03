"use client";
import { useToast } from "@/components/ui/use-toast";
import { deleteChatByUserIdChatId, getChatDataByUserId } from "@/lib/RequestQueries";
import { TChatDataState, addMessage, deleteMessage } from "@/lib/redux/slice/ChatDataSlice";
import { setApiRes } from "@/lib/redux/slice/PromptChatData";
import { ChatType, setChatType, setIsOpen } from '@/lib/redux/slice/WebSocketSlice';
import { AppDispatch, useAppSelector } from "@/lib/redux/store";
import { AxiosError } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdDeleteOutline, MdOutlineNotStarted } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
const RecentChatHistory = () => {
  const [loading,setLoading] = useState(false);
  const [delLoading,setDeLoading] = useState(false)
  const dispatch = useDispatch<AppDispatch>();
  const chatData = useAppSelector((state) => state.ChatDataReducer.value);
  const newChat = useAppSelector((state)=>state.LoadingSlice.value.loadDataWhenPrompting)
  const { toast } = useToast();
  const user_id = '7b33b633-a54c-4b06-b57e-3416611a4776'
  const editChatState = useAppSelector((state)=>state.PromptChatReducer.value)
  const isWebSocketOpen = useAppSelector((state)=>state.WebSocketReducer.value.isOpen)
  useEffect(() => {

    async function getHistoryData() {
      try {
  setLoading(true)        
       const res = await getChatDataByUserId(user_id)
        let tempList: TChatDataState[] = [];
        tempList = filterChatData(res);
        console.log({tempList})
        dispatch(addMessage([...tempList]));
        setLoading(false)
      } catch (error: any | AxiosError) {
        if (error == AxiosError) {
          console.log({ error });
        }
        console.log({ error });
        setLoading(false)
      }
    }

    getHistoryData();
  }, []);

  const onDeleteChatBtnHandle = async (chat_id:string) => {

    try {
        setDeLoading(true)
      const res = await deleteChatByUserIdChatId(user_id, chat_id)
        dispatch(deleteMessage(chat_id))
        toast({
          description: "The chat is deleted",
        });
      console.log(res.data.detail);
      setDeLoading(false)
    } catch (error: any) {
      console.log({ error });
      setDeLoading(false)
    }
  };

 function editChatHandle(chat_id:string) {
  if (isWebSocketOpen){
    dispatch(setIsOpen(false))
  }
  dispatch(setApiRes({
    chat_id,
    message:null
  }))
  dispatch(setChatType(ChatType.previousChat))    
  console.log('edit change state click:', {editChatState})
  
  dispatch(setIsOpen(true))

}


// function newChatHandle(){
//   dispatch(setApiRes({
//     chat_id:null,
//   }))
//   dispatch(setIsOpen(true))
  
// dispatch(setChatType(ChatType.newChat))
// }

  return (
    <>
      {/* <ScrollArea className="rounded-md border   overflow-y-scroll"> */}
      <div className="flex flex-col gap-y-3 py-3">
        {chatData?.map((item, index) => 
        
        
          (
          <Card onClick={()=>{}} 
           key={index} className="relative group">
            <p
              className={`

        text-xs md:text-sm lg:text-base  cursor-pointer
        py-2 pl-2 
        whitespace-nowrap overflow-hidden text-ellipsis
        
                        `}
            >
              {item?.conversation_history?.length > 0
                ? item?.conversation_history[
                    item.conversation_history.length - 1
                  ].content

                : 
null
}
            </p>
            {/* div for hover  */}
            
            <div
              className={`group-hover:flex group-hover:bg-slate-600 opacity-90 group-hover:max-w-full group-hover:w-full
               z-50 hidden duration-1000 ease-linear w-0  max-w-0 h-full rounded-xl
              absolute top-0
              items-center 
              ${""}
              `}
            >

              {delLoading?
              <div className=" mx-auto text-white text-2xl font-bold animate-spin">
                <AiOutlineLoading3Quarters/></div>:
              <>
              <p
                className="text-white/85 w-[70%]
                pl-3  "
              >
                {moment(item.created_at).format("DD MMM YYYY")}
              </p>
                <Button 
                onClick={()=> editChatHandle(item.chat_id)}
                variant={'link'}
                className="w-[30%] pl-3 text-xl md:text-2xl text-white/70 hover:text-white
                translate-x-2
                hover:translate-x-4
                 duration-100 scale-110 ease-linear cursor-pointer "
                >
                <MdOutlineNotStarted />

                </Button>
              <Button
              variant={"link"}
              disabled={delLoading}
                onClick={() => onDeleteChatBtnHandle(item.chat_id)}
                className="w-[30%] pl-3 text-xl md:text-2xl text-red-500 hover:text-red-600 hover:translate-x-2 duration-100 ease-linear scale-110  cursor-pointer"
              >
                <MdDeleteOutline />
                </Button>
              </>
              }

            </div>
             
            
          </Card>
        ))}
      </div>
      {/* </ScrollArea> */}
    </>
  );
};

export default RecentChatHistory;

function filterChatData(res:any) {
  let tempList: TChatDataState[] = [];
  let dataLen = res.data.length - 1;
  let data = res.data;
  for (let i = dataLen; i >= 0; i--) {
    tempList.push({
      chat_id: data[i].id,
      user_id:data[i].user_id,
      created_at: data[i].created_at,
      updated_at: data[i].updated_at,
      conversation_history: data[i].conversation_history,
    });
  }

  return tempList;
}
