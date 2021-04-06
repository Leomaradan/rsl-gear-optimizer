/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/**
 * @see https://stackoverflow.com/a/48218209
 * @param objects
 *
 */
const mergeDeep = <T = any>(...objects: T[]): T => {
  const isObject = (obj: unknown) => obj && typeof obj === "object";

  return objects.reduce((prev, obj) => {
    Object.keys(obj).forEach((key) => {
      const pVal = prev[key as keyof T];
      const oVal = obj[key as keyof T];

      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key as keyof T] = pVal.concat(...oVal) as any;
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key as keyof T] = mergeDeep(pVal, oVal);
      } else {
        prev[key as keyof T] = oVal;
      }
    });

    return prev;
  }, {} as T);
};

export default mergeDeep;
