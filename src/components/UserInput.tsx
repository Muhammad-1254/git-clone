"use client";
import { webSocketChatApiAddress } from "@/lib/RequestQueries";
import { addChatWhenPrompting } from "@/lib/UtilsFunctions";
import { addNewMessage } from "@/lib/redux/slice/ChatDataSlice";
import { enableLoadChatDataEnable } from "@/lib/redux/slice/LoadingSlice";
import { setApiRes, setIsSocketClose } from "@/lib/redux/slice/PromptChatData";
import { AppDispatch, useAppSelector } from "@/lib/redux/store";
import { useEffect, useRef, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { Button } from "./ui/button";

const UserInput = () => {
  const [message, setMessage] = useState("");
  const [textAreaHeight, setTextAreaHeight] = useState(40);
  const [textAreaWidth, setTextAreaWidth] = useState(300);
  //   const [messageData, setMessageData] = useState<string[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const socket = useRef<WebSocket | null>(null);
  const user_id = useAppSelector((state) => state.AuthReducer.value.user_id);
  const apiRes = useAppSelector(
    (state) => state.PromptChatReducer.value.apiRes
  );
  const isSocketClose = useAppSelector(
    (state) => state.PromptChatReducer.value.isSocketClose
  );

  useEffect(() => {
    if (typeof window != "undefined") {
      let screenWidth = window.innerWidth;
      if (screenWidth > 1500) {
        setTextAreaWidth(450);
      } else if (screenWidth > 780) {
        setTextAreaWidth(400);
      } else if (screenWidth > 400) {
        setTextAreaWidth(300);
      } else {
        setTextAreaWidth(280);
      }
    }
  }, []);

  useEffect(() => {
    //web socket  starts here
    async function websocket() {
      try {
        let messageContent = "";
        let chat_id = apiRes.chat_id;
        const newSocket = await new WebSocket(webSocketChatApiAddress);
        socket.current = newSocket;

        console.log("websocket connected", socket.current);

        socket.current.onopen = async () => {
          console.log("websocket connected connected");
          const body = {
            user_id,
            chat_id,
          };
          //     if(socket.current?.CONNECTING === WebSocket.CONNECTING){
          //       console.log("before pro")
          // await new Promise((resolve) => setTimeout(resolve, 1000));
          // console.log("after pro")

          //     }
          console.log({ body });
          dispatch(setIsSocketClose(false))
          if (socket.current?.OPEN) {
            socket.current.send(JSON.stringify({ body }));
          }
        };
        socket.current.onmessage = async (event) => {
          // console.log({ event });
          var load_data = JSON.parse(event.data);
          if (load_data.is_stream) {
            messageContent += load_data.message;
            dispatch(
              setApiRes({
                message: { message: messageContent },
                is_stream: true, //is this if stream is true then previous array should be remove from store.if stream false then add list to store
              })
            );
          } else {
            // if chat is new i.e null then we send again chat id for continue our conversation
            if (chat_id === null) {
              const body = {
                chat_id: load_data.chat_id,
              };
              // @ts-ignore
              socket.current.send(JSON.stringify({ body }));
              dispatch(
                setApiRes({
                  chat_id: load_data.chat_id,
                })
              );
            }
          }
          if (!load_data.is_stream) {
            
            await new Promise((resolve) => setTimeout(resolve, 1000));

            dispatch(
              setApiRes({
                is_stream: load_data.is_stream,
              })
            );
            console.log({ messageContent });
              messageContent ='' 
            
            dispatch(enableLoadChatDataEnable(load_data.chat_id));
            if (load_data.chat_id) {

              const chat = await addChatWhenPrompting(
                user_id,
                load_data.chat_id
              );
              dispatch(addNewMessage(chat));
              console.log("data added");
            }
          }
        };

        socket.current.onclose = () => {
          console.log("websocket closed", { socket });
          // @ts-ignore
          socket.current.close();
          socket.current = null;
        };
      } catch (error: any) {
        console.log({ error });
        console.log("websocket closed", { socket });
        socket.current?.close();
        socket.current = null;
      }
    }

    websocket();
  }, []);

  useEffect(() => {
    if (isSocketClose) {
      socket.current?.close();
      console.log("socket closed", socket.current);
    }
  }, [isSocketClose]);

  async function inputText(text: string) {
    console.log(text);
    if (text === "\n") {
      await onSubmit();
      return;
    }

    setMessage(text);

    if (text.length > 40) {
      setTextAreaHeight((text.length / 40) * 30);
      console.log(textAreaHeight);
    } else {
      setTextAreaHeight(40);
    }
  }

  async function onSubmit() {
    try {
      setBtnLoading(true);
      // @ts-ignore
      socket.current.send(message);
      setBtnLoading(false);
    } catch (error: any) {
      console.log({ error });
      setBtnLoading(false);
    }
  }

  return (
    <div className="">
      <div
        className="
flex items-end justify-normal
       mb-4 md:mb-6 lg:mb-8 
        "
      >
        <textarea
          className={`textArea resize-none   border rounded-l-2xl rounded-r-none
overflow-hidden py-[6px] px-2 
`}
          value={message}
          onChange={(event) => inputText(event.target.value)}
          style={{ height: `${textAreaHeight}px`, width: `${textAreaWidth}px` }}
        />

        <Button
          disabled={btnLoading}
          onClick={() => onSubmit()}
          type="button"
          className="md:w-14 lg:w-[72px] h-[38px] rounded-r-2xl rounded-l-none"
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
            "Send"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UserInput;
