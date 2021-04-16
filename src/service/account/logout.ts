import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const logout = (token: string, success: () => void, fail: () => void): void => {
  authRequest(token)
    .put(`${process.env.REACT_APP_END_POINT}/account/logout`)
    .then((result) => {
      if (result.status === OK) {
        success();
      } else {
        fail();
      }
    })
    .catch((e) => {
      logger.error(e);
      fail();
    });
};

export default logout;
