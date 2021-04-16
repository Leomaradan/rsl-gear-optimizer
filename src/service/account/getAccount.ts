import type { IResponseAccount, IResponseFormatedAccount } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

import { formatResponse } from "./functions";

const getAccount = (
  token: string,
  success: (data: IResponseFormatedAccount) => void,
  fail: () => void
): void => {
  authRequest(token)
    .get<IResponseAccount>(`${process.env.REACT_APP_END_POINT}/account`)
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

export default getAccount;
