import type { IQueryChampion, IResponseChampion } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const createChampion = (
  token: string,
  champion: IQueryChampion,
  success: (data: IResponseChampion) => void,
  fail: () => void
): void => {
  authRequest(token)
    .post<IResponseChampion>(
      `${process.env.REACT_APP_END_POINT}/champion`,
      champion
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

export default createChampion;
