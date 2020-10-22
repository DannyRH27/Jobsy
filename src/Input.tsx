import React, { useState, forwardRef } from "react";
import styled from "styled-components";
import { Event } from "./Types";
import { colors } from "./constants";
import { FaTelegramPlane } from "react-icons/fa";
const Form = styled.form`
  display: flex;
  align-items: center;
  padding: 32px;
  box-sizing: border-box;
`;
// const InputContainer = styled.div`
//   display: flex;
//   align-items: center;
//   height: 50px;
//   margin: 0 auto;
//   width: 100%;
//   border-radius: 20px;
//   background-color: #f1f6f9;
//   /* background-color: black; */
// `;
const SendButton = styled(FaTelegramPlane)`
  margin-left: 30px;
  padding: 8px 10px;
  height: 28px;
  width: 72px;
  color: white;
  border-radius: 20px;
  opacity: 1;
  background-color: ${colors.persianGreen};
  user-select: none;
  cursor: pointer;
  transition: 0.2s;
  
  &:hover {
    /* background-color: ${colors.persianGreenLight}; */
    opacity: 0.8;
  }
`;
const InputBox = styled.input`
  height: 40px;
  margin: 0 auto;
  width: 100%;
  border: 1px solid transparent;
  border-radius: 20px;
  background-color: #f1f6f9;
  padding-left: 20px;
  transition: 0.2s;
  &:focus {
    border-color: rgb(180,180,180);
  }
`;

interface Props {
  sendEvent: (event: Event) => void;
}

const Input = ({ sendEvent }: Props, ref: any) => {
  const [text, setText] = useState("");

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setText("");
    sendEvent({
      type: "message",
      text,
    });
  };

  return (
    <Form onSubmit={sendMessage}>
      <InputBox
        type="text"
        ref={ref}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <SendButton onClick={sendMessage}/>
    </Form>
  );
};

export default forwardRef(Input);
