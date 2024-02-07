"use client";

import {
  setNewChatChatPage
} from "@/lib/redux/slice/UserChatSlice";
import { setChatId, setRunUseEffect } from "@/lib/redux/slice/WebSocketSlice";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useDispatch } from "react-redux";
import webSocketService from "./WebSocketService";
import RecentChatHistory from "./sub_components/RecentChatHistory";
import { Button } from "./ui/button";

const LeftNavBar = () => {
  const dispatch = useDispatch();
  function newChatHandle() {
    const ws = webSocketService.getSocket();
    if (ws === null) {
      webSocketService.setSocket();
    } else {
      ws.close();
      webSocketService.setSocket();
    }
    // for handling multiple clicks because if the value is same then the useEffect function is not run again and again in UserInput Component
    dispatch(setChatId(null));
    dispatch(setRunUseEffect(Math.random()));
    dispatch(setNewChatChatPage(null));
  }
  return (
    <header className="">
      {/* for lg screens */}
      <div className="w-[350px] h-screen border-2">
        <div className="flex items-center gap-x-2 m-5 ml-0">
          <h1>Name Here</h1>
          <span>(Logo here)</span>
        </div>

        <div className="mt-10">
          <Button onClick={newChatHandle} className="w-[98%] mx-auto">
            + New Chat
          </Button>
        </div>

        {/* chat history  */}
        <ScrollArea className="w-full h-[65vh] border  overflow-y-scroll">
          <RecentChatHistory />
        </ScrollArea>
      </div>
    </header>
  );
};

export default LeftNavBar;
