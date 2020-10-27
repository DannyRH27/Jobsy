import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import Carousel from "react-bootstrap/Carousel";
import { colors } from "../constants";

const Wrapper = styled(motion.div)`
  width: 640px;
  overflow-x: hidden;
`;

const Main = styled.div`
  width: 640px;
  height: 500px;

  li {
    background-color: ${colors.persianGreen};
  }
`;

const Body = styled.div`
  margin-top: 12px;
  width: 480px;
`;

const Gif = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
`;

const Title = styled.div`
  font-size: 2em;
  color: ${colors.persianGreen};
  font-weight: 700;
`;

const Text = styled.div`
  margin-top: 8px;
  font-size: 1.4em;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  line-height: 1.2em;

  & > * ~ * {
    margin-top: 12px;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 500px;
`;

const Card = styled.div`
  padding: 8px;
  border-radius: 8px;
  box-shadow: 2px 2px 6px ${colors.shadow};
  background-color: white;
  width: 480px;
  line-height: 1.4em;

  & > video {
    width: 480px;
    height: auto;
  }
`;

const Info = () => (
  <Wrapper
    initial={{ width: 0, opacity: 0 }}
    animate={{ width: 640, opacity: 1 }}
    transition={{ duration: 0.4 }}
    exit={{ width: 0, opacity: 0 }}
  >
    <Main>
      <Carousel interval={20000}>
        <Carousel.Item>
          <CardWrapper>
            <Body>
              <Title>Welcome To Jobsy</Title>
              <Text>
                <p>
                  Resumes come in all shapes and sizes while recruiters have to
                  read through hundreds of resumes every week. This can get
                  pretty tedious… this is where Jobsy comes in.
                </p>
                <p>
                  Jobsy is an interactive resume bot that walks you through 
                  my experience and helps you understand why I’m the best
                  candidate on the market!
                </p>
                <p>Check out some of Jobsy's features 👉</p>
              </Text>
            </Body>
          </CardWrapper>
        </Carousel.Item>
        <Carousel.Item>
          <CardWrapper>
            <Card>
              <Gif
                src="https://dannydash-seeds.s3-us-west-1.amazonaws.com/ReadMe/Jobsy/AutoSuggestions.gif"
                alt=""
              />
            </Card>
            <Body>
              <Title>Suggestions</Title>
              <Text>
                Jobsy finds the closest word you're looking for and gives out
                suggestions as quick reply buttons
              </Text>
            </Body>
          </CardWrapper>
        </Carousel.Item>
        <Carousel.Item>
          <CardWrapper>
            <Card>
              <Gif
                src="https://dannydash-seeds.s3-us-west-1.amazonaws.com/ReadMe/Jobsy/VisitedHistory.gif"
                alt=""
              />
            </Card>
            <Body>
              <Title>History</Title>
              <Text>
                Jobsy remembers your message history so you never get lost
              </Text>
            </Body>
          </CardWrapper>
        </Carousel.Item>
        <Carousel.Item>
          <CardWrapper>
            <Card>
              <Gif
                src="https://dannydash-seeds.s3-us-west-1.amazonaws.com/ReadMe/Jobsy/Graphics.gif"
                alt=""
              />
            </Card>
            <Body>
              <Title>Graphics</Title>
              <Text>
                If the message refers to an image or link, Jobsy shows it on the
                side panel
              </Text>
            </Body>
          </CardWrapper>
        </Carousel.Item>
      </Carousel>
    </Main>
  </Wrapper>
);

export default Info;
