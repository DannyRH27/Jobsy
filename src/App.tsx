import React, { useEffect, useRef } from "react";
import MessageList, { RefObject } from "./MessageList";

interface Options {
  useSockets: boolean;
}

interface Props {
  options: Options;
  socket: any;
}

interface Message {}

const App = ({ options, socket }: Props) => {
  const reconnectCount = useRef(0);
  const ref = useRef<RefObject>(null);

  const connect = () => {
    if (options.useSockets) {
      console.log("connecting");
      let connectEvent = "hello";

      socket.addEventListener("open", (event: any) => {
        console.log("CONNECTED TO SOCKET");
        reconnectCount.current = 0;
        if (ref.current) {
          ref.current.sayHi();
        }
        // socket.send(
        //   JSON.stringify({
        //     type: "message",
        //     text: "hahha",
        //     user: 123321,
        //     mood,
        //     dtree: 'tree',
        //     channel: options.useSockets ? "websocket" : "webhook",
        //   })
        // );
      });

      socket.addEventListener("message", (event: any) => {
        let message = JSON.parse(event.data);
        console.log(message);
      });
    }
  };

  useEffect(() => {
    connect();
  }, []);

  return <MessageList ref={ref} />;
};

export default App;
