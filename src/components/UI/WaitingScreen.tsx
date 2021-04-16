import React from "react";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";

const Screen = React.lazy(() => import("./Screen"));

const WaitingScreen = () => {
  return (
    <Screen>
      <span>Connecting to the server...</span>
      <Spinner animation="grow" variant="primary" />
    </Screen>
  );
};

export default WaitingScreen;
