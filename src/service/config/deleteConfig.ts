import type { IDeleteResponse } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const deleteConfig = (
  token: string,
  id: number,
  success: (data: IDeleteResponse) => void,
  fail: () => void
): void => {
  authRequest(token)
    .delete<IDeleteResponse>(`${process.env.REACT_APP_END_POINT}/config/${id}`)
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

export default deleteConfig;
