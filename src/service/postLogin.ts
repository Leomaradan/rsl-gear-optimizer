import logger from "../process/logger";

import axios from "axios";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const postLogin = <T extends any>(
  email: string,
  password: string,
  success: (data: T) => void,
  fail: () => void
): void => {
  axios
    .post<T>(`${process.env.REACT_APP_END_POINT}/auth/login`, {
      email,
      password,
    })
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

export default postLogin;
