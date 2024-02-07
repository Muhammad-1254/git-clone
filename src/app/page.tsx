"use client";

import ChatSection from "@/components/ChatSection";
import LeftNavBar from "@/components/LeftNavBar";
import UserMenu from "@/components/UserMenu";
import webSocketService from "@/components/WebSocketService";
import {
  setChatId
} from "@/lib/redux/slice/WebSocketSlice";
import { useAppSelector } from "@/lib/redux/store";
import { useDispatch } from "react-redux";

const Page = () => {
  
  const UserFieldComponent = useAppSelector(
    (state) => state.WebSocketReducer.value.userFieldComponent
  );
  const dispatch = useDispatch();

  function newChatHandle() {
    const ws = webSocketService.getSocket();
    if (ws === null) {
      webSocketService.setSocket();
    } else {
      ws.close();
      webSocketService.setSocket();
    }
    dispatch(setChatId(null));
    // dispatch(setUserFieldComponent(<UserInput  />));
  }

  function previousChatHandle() {
    const ws = webSocketService.getSocket();
    if (ws === null) {
      webSocketService.setSocket();
    } else {
      ws.close();
      webSocketService.setSocket();
    }
    console.log(webSocketService.getSocket())
    dispatch(setChatId("415"));
    // dispatch(setUserFieldComponent(<UserInput />));
  }
  return (
    <main className="w-[350px] md:w-[765px] lg:w-screen h-auto lg:h-screen mx-auto lg:mx-0 border-2 border-red-600
    flex 
    ">
<section className="">

      <LeftNavBar/>
</section>
    {/* <div className="flex w-full h-full flex-col items-center justify-between ">
      <div className="flex items-center gap-x-5 mt-5">
        <Button onClick={newChatHandle}>New Chat</Button>
        <Button onClick={previousChatHandle}>Previous Chat</Button>
      </div>

      <div className="mb-5">
        <UserInput/>
      </div>
    </div> */}

    <section className="lg:mx-auto overflow-y-scroll">
    <ChatSection/>
    <UserMenu/>
    
    </section>
    </main>
  );
};

export default Page;
