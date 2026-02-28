import axiosInstance from "./axiosInstance";
import type { IdentityTypeEnum, SiteTypeEnum } from "~/types/enums";

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

export function getSiteType(userId: string) {
  return axiosInstance({
    method: "GET",
    url: `/chatbot/v1/site_type?user_id=${userId}`,
  });
}

export function setSiteType(userId: string, siteType: SiteTypeEnum) {
  return axiosInstance({
    method: "POST",
    url: `/chatbot/v1/site_type`,
    data: {
      user_id: userId,
      site_type: siteType,
    },
  });
}
