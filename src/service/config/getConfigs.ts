import type { IResponseConfiguration } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const getConfigs = (
  token: string,
  success: (data: IResponseConfiguration[]) => void,
  fail: () => void
): void => {
  authRequest(token)
    .get<IResponseConfiguration[]>(`${process.env.REACT_APP_END_POINT}/config`)
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

export default getConfigs;
