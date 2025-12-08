import type { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import type { User } from "@auth0/auth0-react";
import { envConfig } from "~/utils/envConfig";

export async function verifyUser(
  token: string,
  user: User | null
): Promise<
  AxiosResponse<{
    user_id: string;
  }>
> {
  return await axiosInstance( {
    url:envConfig.AUTH_API_URL,
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    data: {
      user,
    },
  });
}
