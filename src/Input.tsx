import React, { useState } from "react";
import styled from "styled-components";
import { Event } from "./Types";

const Form = styled.form`
  display: flex;
  align-items: center;
  padding: 32px;
  box-sizing: border-box;
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
      userId: 1,
      type: "message",
      text,
    });
  };

  return (
    <Form onSubmit={sendMessage}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <button type="submit">Send</button>
    </Form>
  );
};

export default Input;
