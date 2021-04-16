import type { IQueryConfiguration, IResponseConfiguration } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const updateConfig = (
  token: string,
  id: number,
  config: IQueryConfiguration,
  success: (data: IResponseConfiguration) => void,
  fail: () => void
): void => {
  authRequest(token)
    .put<IResponseConfiguration>(
      `${process.env.REACT_APP_END_POINT}/config/${id}`,
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

export default updateConfig;
