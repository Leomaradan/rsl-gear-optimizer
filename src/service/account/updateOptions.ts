import type { IQueryAccountOption } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const updateOptions = (
  token: string,
  options: IQueryAccountOption,
  success: (data: IQueryAccountOption) => void,
  fail: () => void
): void => {
  authRequest(token)
    .put<IQueryAccountOption>(
      `${process.env.REACT_APP_END_POINT}/account`,
      options
    )
    .then((result) => {
      if (result.status === OK) {
        success(result.data);
      } else {
        fail();
      }
    })
    .catch((e) => {
      logger.error(e);
      fail();
    });
};

export default updateOptions;
