import React, { useEffect, useMemo, useRef, useState, useReducer } from "react";
import styled from "styled-components";
// import MessageList, { RefObject } from "./MessageList";
import { Message, Event } from "./Types";
import Input from "./Input";
import { generateGuid } from "./util";
import MessageRow from "./components/MessageRow";
import TypingIndicator from "./components/TypingIndicator";
import messageReducer from "./reducers/messageReducer";
import { colors } from "./constants";
import { receiveMessage } from "./reducers/actions";
import MessageHeader from "./components/MessageHeader";
import { useSpring, animated } from "react-spring";

const Face = styled(animated.img)`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background-color: ${colors.persianGreenLight};
  border: 5px solid white;
  box-shadow: 0px 20px 40px -5px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.5s;
  will-change: transform;
`;

const View = styled.div`
  display: flex;
  width: 100%;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  font-family: "Roboto";
`;

const Panel = styled.div`
  width: 35%;
  min-width: 500px;
  background-color: ${colors.charcoal};
  display: flex;
  align-items: center;
  justify-content: center;
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

const calc = (x, y) => [
  -(y - window.innerHeight / 2) / 40,
  (x - window.innerWidth * 0.175) / 40,
  1,
];
const trans = (x, y, s) =>
  `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

const initialMessages: Message[] = [];

const App = ({ options }: Props) => {
  const reconnectCount = useRef(0);
  const [props, set] = useSpring(() => ({
    xys: [0, 0, 1],
    config: { mass: 5, tension: 350, friction: 40 },
  }));
  // const ref = useRef<RefObject>(null);
  const socket = useRef<WebSocket | null>(null);
  // const [messages, setMessages] = useState<Message[]>([]);
  const [messages, dispatch] = useReducer(messageReducer, initialMessages);
  const user = useMemo(generateGuid, []);
  const [typing, setTyping] = useState(false);

  // const addMessageToState = (message: Message) => {
  //   setMessages((messages) => [...messages, message]);
  // };

  const sendEvent = (event: Event) => {
    if (options.useSockets && socket.current) {
      setTimeout(() => {
        socket.current &&
          socket.current.send(JSON.stringify({ ...event, user }));
      }, 200);
      if (event.type === "message") {
        dispatch(
          receiveMessage({
            type: event.type,
            text: event.text || "",
            direction: "outgoing",
            showQuickReplies: true,
            showAvatar: true,
          })
        );
      }
    }
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    bottomRef?.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          console.log(message);
          switch (message.type) {
            case "typing":
              setTyping(true);
              scrollToBottom();
              break;
            case "message":
              setTyping(false);
              dispatch(
                receiveMessage({
                  ...message,
                  direction: "incoming",
                  showQuickReplies: true,
                  showAvatar: true,
                })
              );
              break;
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
    <View
      onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
    >
      <Panel>
        <Face
          style={{ transform: props.xys.interpolate(trans) }}
          src="./chatbot.png"
        />
      </Panel>
      <Main>
        <MessageHeader />
        <MessageList>
          {messages.map((message, index) => (
            <MessageRow key={index} message={message} sendEvent={sendEvent} />
          ))}

          {typing && <TypingIndicator />}
          <div ref={bottomRef} className="list-bottom"></div>
        </MessageList>
        <Input sendEvent={sendEvent} />
      </Main>
    </View>
  );
};

export default App;
