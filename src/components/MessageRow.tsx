import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import styled from "styled-components";
import { Message, Event } from "../Types";
import { colors } from "../constants";
import QuickReply from "./QuickReply";

export const Container = styled.div<{ incoming: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.incoming ? "row" : "row-reverse")};
  align-items: flex-start;
  gap: 8px;
`;

const Space = styled.div`
  min-width: 70px;
`;

const MessageBody = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 2px 2px 6px ${colors.shadow};
  line-height: 1.4em;
`;

const Incoming = styled(MessageBody)`
  background-color: white;
  line-height: 1.5em;
  position: relative;

  & em {
    font-weight: 700;
  }

  & > hr {
    border-color: ${colors.shadow};
  }

  & a,
  a:visited {
    color: ${colors.persianGreen};
  }

  & .smoller {
    font-size: 14px;
    font-style: italic;
  }

  & > ul {
    list-style: inside;
    margin-left: 20px;
  }
`;

const Outgoing = styled(MessageBody)`
  background-color: ${colors.persianGreen};
  color: white;
`;

export const FlexColumn = styled.div<{ incoming?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ incoming }) => (incoming ? "flex-start" : "flex-end")};
`;

const QuickReplies = styled.div`
  margin-top: 8px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

const Name = styled.div`
  height: 12px;
  margin-bottom: 4px;
  line-height: 1;
  font-size: 12px;
  color: ${colors.grey};
`;

export const ProfilePhoto = styled.div`
  object-fit: cover;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.sandyBrown};
  color: white;
  font-family: "Oswald";
  font-weight: bold;
  font-size: 20px;
  min-width: 40px;
  width: 40px;
  height: 40px;
  margin-top: 16px;
`;

const Seperator = styled.div`
  font-size: 20px;
  color: ${colors.shadow};
`;

const Empty = styled.div`
  min-width: 40px;
`;

interface Props {
  message: Message;
  sendEvent: (event: Event) => void;
}

const MessageRow = ({ message, sendEvent }: Props) => {
  // const [userReplied, setUserReplied] = useState(false);
  const usedSeperator = useRef(false);

  useEffect(() => {
    if (usedSeperator.current) usedSeperator.current = false;
  }, []);

  const sendReply = (text: string) => {
    sendEvent({
      type: "message",
      text,
    });
  };

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ duration: 0.2 }}
    >
      <Container incoming={message.direction === "incoming"}>
        {message.showAvatar && message.direction === "incoming" ? (
          <ProfilePhoto>DH</ProfilePhoto>
        ) : message.direction === "incoming" ? (
          <Empty />
        ) : null}
        {message.direction === "incoming" ? (
          <FlexColumn incoming>
            {message.showAvatar && <Name>Danny</Name>}
            <Incoming>
              <ReactMarkdown source={message.text} escapeHtml={false} />
            </Incoming>
            {message.quick_replies && message.showQuickReplies && (
              <QuickReplies>
                {message.quick_replies.map((quickReply, index) => {
                  if (quickReply.special && !usedSeperator.current) {
                    usedSeperator.current = true;
                    return (
                      <React.Fragment key={index}>
                        {index !== 0 && <Seperator>|</Seperator>}

                        <QuickReply
                          quickReply={quickReply}
                          sendReply={sendReply}
                        />
                      </React.Fragment>
                    );
                  }
                  return (
                    <QuickReply
                      quickReply={quickReply}
                      key={index}
                      sendReply={sendReply}
                    />
                  );
                })}
              </QuickReplies>
            )}
          </FlexColumn>
        ) : (
          <FlexColumn>
            {message.showAvatar && <Name>You</Name>}
            <Outgoing>{message.text}</Outgoing>
          </FlexColumn>
        )}
        <Space />
      </Container>
    </motion.div>
  );
};

export default MessageRow;
