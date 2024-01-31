"use client";
import RecentChatHistory from "@/components/RecentChatHistory";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { useRef } from "react";

const ChatHistory = () => {

const socket = useRef<WebSocket|null>(null);
  return (
    <section className="border w-[20%] h-full">
      <div className="w-full">
        <div className="w-full flex items-center justify-between px-4">
          {/* name and logo  */}
          <div className="flex items-center justify-normal gap-x-1 lg:my-8">
            <span>(Logo)</span>
            <h1>GPT-Clone</h1>
          </div>

          {/* level or credits  */}
          <div>Credits</div>
        </div>

        {/* for new chat  */}
        <div className=" flex justify-end  pr-3">
          <Button className="py-5 px-8  " variant={"outline"}>
            + New Chat
          </Button>
        </div>
        <Separator className="mt-3 mb-1.5 " />

        <div className=" w-full  border flex flex-col items-start ">
          <h2 className="text-xl font-semibold border-b pl-3">Recent</h2>
          <div className="w-[95%] h-[50vh] overflow-y-scroll mx-auto">

            <RecentChatHistory />
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default ChatHistory;
