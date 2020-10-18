import React, { useEffect, useRef, useState } from "react";
import { library } from "../node_modules/webpack/types";
// import MessageList, { RefObject } from "./MessageList";
import { Message } from "./Types";

interface Options {
  useSockets: boolean;
  wsUrl: string;
  maxReconnect: number;
  reconnectTimeout: number;
}

interface Props {
  options: Options;
}

const App = ({ options }: Props) => {
  const reconnectCount = useRef(0);
  // const ref = useRef<RefObject>(null);
  const socket = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessageToState = (message: Message) => {
    setMessages((messages) => [...messages, message]);
  };

  const deliverMessage = (message: any) => {
    if (options.useSockets && socket.current) {
      socket.current.send(JSON.stringify(message));
    }
  };

  const connect = () => {
    if (options.useSockets) {
      console.log("connecting");
      socket.current = new WebSocket(options.wsUrl);

      if (socket) {
        socket.current.addEventListener("open", (event) => {
          console.log("CONNECTED TO SOCKET");
          reconnectCount.current = 0;
          deliverMessage({
            type: "hello",
            user: 1,
            channel: "socket",
          });
          // if (ref.current) {
          //   ref.current.sayHi();
          // }
          deliverMessage({
            type: "message",
            text: "REEEEEEE1",
            user: 1,
          });
          deliverMessage({
            type: "message",
            text: "REEEEEEE2",
            user: 1,
          });
          deliverMessage({
            type: "message",
            text: "REEEEEEE3",
            user: 1,
          });
          deliverMessage({
            type: "message",
            text: "REEEEEEE4",
            user: 1,
          });
        });

        socket.current.addEventListener("error", (event) => {
          console.error("ERROR", event);
        });

        socket.current.addEventListener("close", () => {
          console.log("SOCKET CLOSED!");
          if (reconnectCount.current < options.maxReconnect) {
            setTimeout(function () {
              console.log("RECONNECTING ATTEMPT ", ++reconnectCount.current);
              connect();
            }, options.reconnectTimeout);
          }
        });

        socket.current.addEventListener("message", (event) => {
          let message = JSON.parse(event.data);
          console.log(message);
          // debugger;
          addMessageToState(message);
        });
      }
    }
  };

  useEffect(() => {
    connect();
    return () => {
      socket.current && socket.current.close();
    };
  }, []);

  return (
    <ul>
      {console.log(messages)}
      {messages.map((el) => (
        <li>{el.text}</li>
      ))}
    </ul>
  );
};

export default App;
