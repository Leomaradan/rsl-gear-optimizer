import createAccount from "./createAccount";
import deleteAccount from "./deleteAccount";
import getAccount from "./getAccount";
import importData from "./import";
import login from "./login";
import logout from "./logout";
import resetPassword from "./resetPassword";
import updateEmail from "./updateEmail";
import updateOptions from "./updateOptions";
import updatePassword from "./updatePassword";
import verifyEmail from "./verifyEmail";

const service = {
  createAccount,
  deleteAccount,
  getAccount,
  import: importData,
  login,
  logout,
  resetPassword,
  updateEmail,
  updateOptions,
  updatePassword,
  verifyEmail,
};

export default service;
