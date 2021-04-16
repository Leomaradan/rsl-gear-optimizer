import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const updatePassword = (
  token: string,
  password: string,
  success: () => void,
  fail: () => void
): void => {
  authRequest(token)
    .post(`${process.env.REACT_APP_END_POINT}/account/password`, { password })
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

export default updatePassword;
