import React, { useState, forwardRef } from "react";
import styled from "styled-components";
import { Event } from "./Types";
import { colors } from "./constants";
import { FaTelegramPlane, FaVolumeMute, FaVolumeUp } from "react-icons/fa";

const Mute = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 40px;
  height: 40px;
  background-color: ${colors.sandyBrown};
  border-radius: 50%;
  transition: 0.2s;
  box-sizing: initial;
  color: white;
  opacity: 0.8;
  cursor: pointer;
  margin-right: 29px;
  user-select: none;

  &:hover {
    opacity: 1;
  }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  padding: 32px;
  box-sizing: border-box;
  background-color: white;
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
  height: 24px;
  width: 72px;
  color: white;
  border-radius: 20px;
  opacity: 1;
  background-color: ${colors.persianGreen};
  user-select: none;
  cursor: pointer;
  transition: 0.2s;
  box-sizing: initial;
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
    border-color: rgb(180, 180, 180);
  }
`;

interface Props {
  sendEvent: (event: Event) => void;
  mute: boolean;
  setMute: (bool: boolean) => void;
}

const Input = ({ sendEvent, mute, setMute }: Props, ref: any) => {
  const [text, setText] = useState("");

  const sendMessage = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (text.length !== 0) {
      setText("");
      sendEvent({
        type: "message",
        text,
      });
    }
  };

  return (
    <Form onSubmit={sendMessage}>
      <Mute onClick={() => setMute(!mute)}>
        {mute ? <FaVolumeMute /> : <FaVolumeUp />}
      </Mute>
      <InputBox
        type="text"
        ref={ref}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <SendButton onClick={sendMessage} />
    </Form>
  );
};

export default forwardRef(Input);
