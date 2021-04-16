import type { IQueryConfiguration, IResponseConfiguration } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const createConfig = (
  token: string,
  config: IQueryConfiguration,
  success: (data: IResponseConfiguration) => void,
  fail: () => void
): void => {
  authRequest(token)
    .post<IResponseConfiguration>(
      `${process.env.REACT_APP_END_POINT}/config`,
      config
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

export default createConfig;
