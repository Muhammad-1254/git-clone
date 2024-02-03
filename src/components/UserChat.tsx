"use client";

import { AppDispatch, useAppSelector } from "@/lib/redux/store";
import { useDispatch } from "react-redux";
const UserChat = () => {
  const dispatch = useDispatch<AppDispatch>();
  const messageList = useAppSelector(
    (state) => state.PromptChatReducer.value.apiRes.messageList
  );
  console.log("messageList:", messageList);
  
  return (
    <div className="w-[500px] h-[350px] absolute bottom-0 bg-gray-600 overflow-y-scroll">
      {messageList.map((message, index) => (
        <span key={index} className="text-white">
          {message.message}
        </span>
      ))}
    </div>
  );
};

export default UserChat;
