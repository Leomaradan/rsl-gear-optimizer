import axios from "axios";

import logger from "../../process/logger";
import { OK } from "../functions";

const resetPassword = (
  token: string,
  email: string,
  success: () => void,
  fail: () => void
): void => {
  axios
    .post(`${process.env.REACT_APP_END_POINT}/account/reset`, { email })
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

export default resetPassword;
