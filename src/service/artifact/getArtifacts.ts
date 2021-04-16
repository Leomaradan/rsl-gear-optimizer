import type { IResponseArtifact } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const getArtifacts = (
  token: string,
  success: (data: IResponseArtifact[]) => void,
  fail: () => void
): void => {
  authRequest(token)
    .get<IResponseArtifact[]>(`${process.env.REACT_APP_END_POINT}/artifact`)
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

export default getArtifacts;
