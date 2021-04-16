import axios from "axios";

import logger from "../../process/logger";
import { OK } from "../functions";

const verifyEmail = (
  code: string,
  success: () => void,
  fail: () => void
): void => {
  axios
    .get(`${process.env.REACT_APP_END_POINT}/account/verify/${code}`)
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

export default verifyEmail;
