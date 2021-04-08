import axios from "axios";

import type { IProfile, IServiceProps } from "../models";
import emptyFunction from "../process/emptyFunction";
import logger from "../process/logger";

interface IGetProfile extends IServiceProps<IProfile> {
  userName: string;
}

const getProfile = ({
  fail: failBase,
  success,
  userName,
}: IGetProfile): void => {
  const fail = failBase ?? emptyFunction;

  axios
    .get<IProfile>(`${process.env.REACT_APP_END_POINT}/user/${userName}`)
    .then((result) => {
      if (result.status === 200) {
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

export default getProfile;
