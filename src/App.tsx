import React, { useEffect, useMemo, useRef, useState, useReducer } from "react";
import styled from "styled-components";
// import MessageList, { RefObject } from "./MessageList";
import { Message, Event } from "./Types";
import { motion, AnimatePresence } from "framer-motion";
import Input from "./Input";
import { generateGuid } from "./util";
import MessageRow from "./components/MessageRow";
import TypingIndicator from "./components/TypingIndicator";
import messageReducer from "./reducers/messageReducer";
import { colors } from "./constants";
import { receiveMessage } from "./reducers/actions";
import MessageHeader from "./components/MessageHeader";
import { useSpring, animated } from "react-spring";

const Face = styled.img`
  position: absolute;
  width: 400px;
  height: 400px;
  object-fit: cover;

  background-color: white;
  will-change: transform;
  transition: 1s ease-in;
`;

const Circle = styled(animated.div)`
  position: relative;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  border: 8px solid white;
  box-shadow: 0px 20px 40px -5px rgba(0, 0, 0, 0.5);
  transition: box-shadow 0.5s;
  overflow: hidden;
  /* background-color: white; */
  background-image: url("./danny.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  /* display: flex;
  justify-content: center; */
`;

const OverFace = styled.img`
  /* position: absolute; */
  width: 400px;
  height: 400px;
  /* margin-left: -25px;
  margin-top: -25px; */
  object-fit: cover;
  z-index: 100;
  background-color: white;
`;

const View = styled.div`
  display: flex;
  width: 100%;
  font-family: "Roboto";
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const Panel = styled.div`
  width: 35%;
  min-width: 500px;
  background-color: ${colors.charcoal};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 32px;
`;

const FlexedDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h1`
  font-size: 3em;
  color: white;
  text-transform: uppercase;
  font-family: "Oswald";
  opacity: 0.8;
`;

const SubTitle = styled(Title)`
  margin-top: 8px;
  font-size: 2em;
  opacity: 0.6;
`;

const Email = styled.a`
  font-size: 1.5em;
  color: white;
  font-family: "Oswald";
  text-decoration: none;
  margin-top: 20px;
`;

const Copyright = styled.div`
  color: white;
  align-self: center;
  opacity: 0.3;
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
  -(y - window.innerHeight / 2) / 60,
  (x - window.innerWidth * 0.175) / 120,
  1,
];
const trans = (x, y, s) =>
  `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

const initialMessages: Message[] = [];

const emailBody =
  "Hi%20Danny,%0D%0A%0D%0AMy%20name%20is%20<Your%20Name>%20and%20I'm%20a%20recruiter/the%20hiring%20manager%20for%20<Your%20Company>.%0D%0A%0D%0AI%20would%20like%20to%20have%20a%20phone%20discussion%20about%20an%20Software%20Engineer/Product%20Manager%20role%20that%20we%20have%20available.%0D%0A%0D%0AI'd%20like%20to%20talk%20with%20you%20more%20about%20<Your%20Company>%20and%20your%20experience.%0D%0A%0D%0AWhat%20is%20your%20availability%20for%20a%20short%20introductory%20call?%0D%0A%0D%0ALooking%20forward%20to%20hearing%20from%20you.%0D%0A%0D%0AKind%20Regards,%0D%0A%0D%0A<Your%20Name>";

const App = ({ options }: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
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
  const [picture, setPicture] = useState("./danny.jpg")
  const [caption, setCaption] = useState()
  // const addMessageToState = (message: Message) => {
  //   setMessages((messages) => [...messages, message]);
  // };

  const sendEvent = (event: Event) => {
    if (inputRef.current) inputRef.current.focus()
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
              if (message.entry && message.entry.metadata) {
                setPicture(message.entry.metadata.picturePath);
              } else {
                setPicture("./danny.jpg");
              }
              // Could set side panel state to show metadata
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
        <Overlay>
          <FlexedDiv>
            <div>
              <Title>Danny Huang</Title>
              <SubTitle>Interactive Resume</SubTitle>
            </div>
            <Email href={`mailto:danny.r.huang@gmail.com?subject=Interview%20Invitation%20From%20<Your%20Company>&body=${emailBody}`}>
              Email me!
            </Email>
          </FlexedDiv>
          <Copyright>© 2020, Danny Huang, TJ McCabe and Wayne Su</Copyright>
        </Overlay>
        <Circle style={{ transform: props.xys.interpolate(trans) }}>
          <AnimatePresence>
            {picture !== "./danny.jpg" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0 }}
              >
                <OverFace src={picture} />
              </motion.div>
            )}
          </AnimatePresence>
          <Face src={picture} />
        </Circle>
      </Panel>
      <Main>
        {/* <MessageHeader /> */}
        <MessageList>
          {messages.map((message, index) => (
            <MessageRow key={index} message={message} sendEvent={sendEvent} />
          ))}

          {typing && <TypingIndicator />}
          <div ref={bottomRef} className="list-bottom"></div>
        </MessageList>
        <Input ref={inputRef} sendEvent={sendEvent} />
      </Main>
    </View>
  );
};

export default App;
