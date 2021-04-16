import axios from "axios";

import type { IResponseAccount, IResponseFormatedAccount } from "../../models";
import logger from "../../process/logger";
import { OK } from "../functions";

import { formatResponse } from "./functions";

const login = (
  email: string,
  password: string,
  success: (data: IResponseFormatedAccount) => void,
  fail: () => void
): void => {
  axios
    .post<IResponseAccount>(
      `${process.env.REACT_APP_END_POINT}/account/login`,
      { email, password }
    )
    .then((result) => {
      if (result.status === OK) {
        success(formatResponse(result.data));
      } else {
        fail();
      }
    })
    .catch((e) => {
      logger.error(e);
      fail();
    });
};

export default login;
