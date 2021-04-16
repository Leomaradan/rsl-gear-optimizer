import axios, { AxiosInstance } from "axios";

export const authRequest = (token: string): AxiosInstance =>
  axios.create({
    headers: { Authorization: `Bearer ${token}` },
  });

export const OK = 200;
