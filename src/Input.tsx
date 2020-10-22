import React, { useState } from "react";
import styled from "styled-components";
import { Event } from "./Types";
import { colors } from "./constants";

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

const InputBox = styled.input`
  height: 50px;
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

const Input = ({ sendEvent }: Props) => {
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
      {/* <InputContainer> */}
        <InputBox
          type="text"
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
        />
        <button type="submit">Send</button>
      {/* </InputContainer> */}
    </Form>
  );
};

export default Input;
