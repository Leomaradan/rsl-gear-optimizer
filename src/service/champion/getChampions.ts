import type { IResponseChampion } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const getChampions = (
  token: string,
  success: (data: IResponseChampion[]) => void,
  fail: () => void
): void => {
  authRequest(token)
    .get<IResponseChampion[]>(`${process.env.REACT_APP_END_POINT}/champion`)
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

export default getChampions;
