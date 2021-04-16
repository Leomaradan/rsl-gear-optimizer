import axios from "axios";

import logger from "../../process/logger";
import { OK } from "../functions";

const createAccount = (
  username: string,
  email: string,
  password: string,
  success: () => void,
  fail: () => void
): void => {
  axios
    .post(`${process.env.REACT_APP_END_POINT}/account`, {
      username,
      email,
      password,
    })
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

export default createAccount;
