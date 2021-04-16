import type React from "react";
import styled from "styled-components";

const ScreenContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.5);
`;

const InnerScreen = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const Screen: React.FC<any> = ({ children }) => {
  return (
    <ScreenContainer>
      <InnerScreen>{children}</InnerScreen>
    </ScreenContainer>
  );
};

export default Screen;
