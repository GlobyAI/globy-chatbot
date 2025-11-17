import { data } from "react-router";
import axiosInstance from "./axiosInstance";
import type { IdentityTypeEnum } from "~/types/enums";

export function setIdentity(userId: string, type: IdentityTypeEnum) {
  return axiosInstance({
    method: "POST",
    url: `/chatbot/v1/identity_type`,
    data: {
      user_id: userId,
      identity_type: type,
    },
  });
}
export function getIdentity(userId: string) {
  return axiosInstance({
    method: "GET",
    url: `/chatbot/v1/identity_type?user_id=${userId}`,
  });
}
