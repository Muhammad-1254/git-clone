"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
const UserInput = () => {
  const [message, setMessage] = useState("");
  const [isWebSocketOn, setIsWebSocketOn] = useState(false);
  const [response,setResponse] = useState('')
  const socket = useRef<WebSocket | null>(null);
  useEffect(() => {
    socket.current = new WebSocket(
      "ws://localhost:8000/api/v1/users/chat/socket/chat"
    );
    socket.current.onopen =  async() => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Web socket open!");
      const body = {
        user_id: "7b33b633-a54c-4b06-b57e-3416611a4776",
        chat_id: null,
      };
      socket.current?.send(JSON.stringify(body));
    };
    socket.current.onmessage = (event) => {
      console.log(event.data);
  setResponse(response+event.data.message)
    }
    socket.current.onerror = (error) => {
      console.log("Web socket error!", error);
      socket.current?.close() 
    }
    socket.current.onclose = () => {
      console.log("Web socket closed!");
    socket.current?.close()  
    }
  }, []);

  function SendMessage() {
    if (socket.current === null) {
      return;
    }
    socket.current.send(message);
  }

  return (
    <div>
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
        disabled={isWebSocketOn}
      />
      <Button onClick={() => SendMessage()}>Send</Button>
    </div>
  );
};

export default UserInput;
