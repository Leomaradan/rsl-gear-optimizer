import React from "react";
import { Spinner } from "react-bootstrap";
import styled from "styled-components";

const Screen = React.lazy(() => import("./Screen"));

const LoadingScreen = () => {
  return (
    <Screen>
      <span>Loading...</span>
      <Spinner animation="border" variant="primary" />
    </Screen>
  );
};

export default LoadingScreen;
