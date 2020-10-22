import React from "react";
import styled from "styled-components";
import { FaCheck, FaHome, FaUndo } from "react-icons/fa";
import { QuickReply } from "../types";
import { colors } from "../constants";

const Button = styled.button`
  opacity: 0.8;
  padding: 4px 8px;
  font-size: 14px;
  background-color: ${colors.persianGreen};
  border-color: transparent;
  transition: opacity 0.3s;
  color: white;
  border-radius: 4px;

  &:hover {
    opacity: 1;
  }
`;

const VisitedButton = styled(Button)`
  background-color: ${colors.persianGreen};
  opacity: 0.4;
  display: flex;
  align-items: center;

  & > * ~ * {
    margin-left: 6px;
  }
`;

const SpecialButton = styled(Button)`
  background-color: ${colors.sandyBrown};
  display: flex;
  align-items: center;
`;

interface Props {
  quickReply: QuickReply;
  sendReply: (text: string) => void;
}

const QuickReplyRow = ({ quickReply, sendReply }: Props) => {
  if (quickReply.special) {
    return (
      <SpecialButton onClick={() => sendReply(quickReply.payload)}>
        {quickReply.title === "Home" ? <FaHome /> : <FaUndo />}
      </SpecialButton>
    );
  }

  if (quickReply.visited) {
    return (
      <VisitedButton onClick={() => sendReply(quickReply.payload)}>
        <FaCheck />
        <div>{quickReply.title}</div>
      </VisitedButton>
    );
  }

  return (
    <Button onClick={() => sendReply(quickReply.payload)}>
      {quickReply.title}
    </Button>
  );
};

export default QuickReplyRow;
