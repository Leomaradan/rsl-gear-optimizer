import type { IResponseImport } from "../../models";
import logger from "../../process/logger";
import { authRequest, OK } from "../functions";

const importData = (
  token: string,
  dataImport: IResponseImport,
  success: (data: IResponseImport) => void,
  fail: () => void
): void => {
  authRequest(token)
    .post<IResponseImport>(
      `${process.env.REACT_APP_END_POINT}/account/import`,
      dataImport
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

export default importData;
