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

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const Title = styled.h1`
  margin-left: 20px;
  font-size: 2em;
  color: white;
  font-family: "Oswald";
`;

const Email = styled.a`
  font-size: 2em;
  color: white;
  font-family: "Oswald";
  text-decoration: none;
`;




const body =
  "Hi%20Danny,%0D%0A%0D%0AMy%20name%20is%20<Your%20Name>%20and%20I'm%20a%20recruiter/the%20hiring%20manager%20for%20<Your%20Company>.%0D%0A%0D%0AI%20would%20like%20to%20have%20a%20phone%20discussion%20about%20an%20Software%20Engineer/Product%20Manager%20role%20that%20we%20have%20available.%0D%0A%0D%0AI'd%20like%20to%20talk%20with%20you%20more%20about%20<Your%20Company>%20and%20your%20experience.%0D%0A%0D%0AWhat%20is%20your%20availability%20for%20a%20short%20introductory%20call?%0D%0A%0D%0ALooking%20forward%20to%20hearing%20from%20you.%0D%0A%0D%0AKind%20Regards,%0D%0A%0D%0A<Your%20Name>";
const MessageHeader = () => {
  return (
    <Header>
      <Avatar src="https://via.placeholder.com/80" />
      <TitleContainer>
        <Title>Jobsy</Title>
        <Email href={`mailto:danny.r.huang@gmail.com?subject=Interview%20Invitation%20From%20<Your%20Company>&body=${body}`}>
          Let's talk!
        </Email>
      </TitleContainer>
    </Header>
  );
};

export default MessageHeader;
