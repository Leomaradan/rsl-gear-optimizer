/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

const info = (...optionalParams: any[]): void => {
  if (process.env.NODE_ENV !== "production") {
    console.log(optionalParams);
  }
};

const warn = (...optionalParams: any[]): void => {
  if (process.env.NODE_ENV !== "production") {
    console.warn(optionalParams);
  }
};

const error = (...optionalParams: any[]): void => {
  if (process.env.NODE_ENV !== "production") {
    console.error(optionalParams);
  }
};

export default {
  info,
  warn,
  error,
};
