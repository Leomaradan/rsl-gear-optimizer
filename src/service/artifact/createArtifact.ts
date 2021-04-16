import type { IQueryArtifact, IResponseArtifact } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const createArtifact = (
  token: string,
  artifact: IQueryArtifact,
  success: (data: IResponseArtifact) => void,
  fail: () => void
): void => {
  authRequest(token)
    .post<IResponseArtifact>(
      `${process.env.REACT_APP_END_POINT}/artifact`,
      artifact
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

export default createArtifact;
