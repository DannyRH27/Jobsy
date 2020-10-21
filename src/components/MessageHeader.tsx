import React from "react";
import styled from "styled-components";
import { colors } from "../constants";

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  background-color: ${colors.persianGreenLight};
`;

const Avatar = styled.img`
  border-radius: 50%;
  width: 80px;
  height: 80px;
  border: 3px solid white;
  object-fit: cover;
`;

const Title = styled.h1`
  margin-left: 20px;
  font-size: 2em;
  color: white;
  font-family: "Oswald";
`;

interface Props {}

const MessageHeader = () => {
  return (
    <Header>
      <Avatar src="https://via.placeholder.com/80" />
      <Title>Jobsy</Title>
    </Header>
  );
};

export default MessageHeader;
