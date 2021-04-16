import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const updateEmail = (
  token: string,
  email: string,
  success: () => void,
  fail: () => void
): void => {
  authRequest(token)
    .post(`${process.env.REACT_APP_END_POINT}/account/email`, { email })
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

export default updateEmail;
