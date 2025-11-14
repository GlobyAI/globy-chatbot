import type { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";
import type { User } from "@auth0/auth0-react";

export async function verifyUser(
  token: string,
  user: User | null
): Promise<
  AxiosResponse<{
    user_id: string;
  }>
> {
  return await axiosInstance(`/v1/auth`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    data: {
      user,
    },
  });
}
