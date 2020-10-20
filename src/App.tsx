import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
// import MessageList, { RefObject } from "./MessageList";
import { Message, Event } from "./Types";
import Input from "./Input";
import { generateGuid } from './util';
import { MessageRow } from "./components/MessageRow";
import TypingIndicator from "./components/TypingIndicator"
import { colors } from "./constants";

const Main = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  font-family: "Roboto";
`;

const MessageList = styled.div`
  flex: 1;
  padding: 32px;
  box-sizing: border-box;
  background-color: ${colors.aliceBlue};
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  & > * ~ * {
    margin-top: 6px;
  }
`;

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
  const user = useMemo(generateGuid, [])
  const [typing, setTyping] = useState(false);

  const addMessageToState = (message: Message) => {
    setMessages((messages) => [...messages, message]);
  };

  const sendEvent = (event: Event) => {
    if (options.useSockets && socket.current) {
      socket.current.send(JSON.stringify({ ...event, user }));
      if (event.type === "message") {
        addMessageToState({
          type: event.type,
          text: event.text || "",
          direction: "outgoing",
        });
      }
    }
  };

  const fakeType = () => {
    setTyping(true)
    // setTimeout(() => setTyping(false), 1000)
  }
  const connect = () => {
    if (options.useSockets) {
      console.log("connecting");
      socket.current = new WebSocket(options.wsUrl);

      if (socket) {
        socket.current.addEventListener("open", (event) => {
          console.log("CONNECTED TO SOCKET");
          reconnectCount.current = 0;
          sendEvent({
            type: "hello",
            channel: "socket",
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
          console.log(message)
          switch (message.type) {
            case "typing":
              fakeType()
              break
            case "message":
              setTyping(false)
              addMessageToState({ ...message, direction: "incoming" });
              break
            default:
              break;
          }
          

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
    <Main>
      <MessageList>
        {messages.map((message, index) => (
          <MessageRow key={index} message={message} sendEvent={sendEvent} />
        ))}
        
        {typing && <TypingIndicator/>}
      </MessageList>
      <Input sendEvent={sendEvent} />
    </Main>
  );
};

export default App;
