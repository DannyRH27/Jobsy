import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Container, FlexColumn, ProfilePhoto } from "./MessageRow";
import { colors } from "../constants";

const TypingContainer = styled(Container)`
  flex-direction: row;
`;
const Typing = styled.div`
  display: flex;
  position: relative;
  height: 40px;
  width: 50px;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: 2px 2px 6px ${colors.shadow};
  & span {
    height: 5px;
    width: 5px;
    float: left;
    margin: 0 1px;
    background-color: blue;
    display: block;
    border-radius: 50%;
    opacity: 0.4;
  }
  & span:nth-of-type(1) {
    animation: 1s blink infinite 0.3333s;
  }
  & span:nth-of-type(2) {
    animation: 1s blink infinite 0.6666s;
  }
  & span:nth-of-type(3) {
    animation: 1s blink infinite 0.9999s;
  }
  @keyframes blink {
    50% {
      opacity: 1;
    }
  }
`;


const TypingIndicator = () => {
  return (
    <TypingContainer>
      <ProfilePhoto src={"https://via.placeholder.com/40"} />
      <FlexColumn>
        <Typing>
          <span></span>
          <span></span>
          <span></span>
        </Typing>
      </FlexColumn>
    </TypingContainer>
  );
}

export default TypingIndicator