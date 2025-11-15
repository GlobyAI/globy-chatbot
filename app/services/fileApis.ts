import axios, { type AxiosResponse } from "axios";
import axiosInstance, { getTokenFromSession } from "./axiosInstance";
import toast from "react-hot-toast";
import { envConfig } from "~/utils/envConfig";
import { changeFileExtension } from "~/utils/file";

export function uploadFiles(formData: FormData) {
  const token = getTokenFromSession();
  return axiosInstance({
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
}

export const createSignedUrl = async (
  userId: string,
  file: File
): Promise<{
  url: string;
  key: string;
}> => {
  const filename = changeFileExtension(file.name, file.type);
  const key = `images/${new Date().getFullYear()}/${userId}/${filename}`;
  let url = "";
  const signedUlrRes = await axios({
    url: envConfig.IMAGE_LIBRARY_API + "/upload-url",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      bucket: "globylibrary-" + userId,
      key: key,
      content_type: file.type,
      expires: 900,
    },
  });
  if (signedUlrRes?.status !== 200) {
    toast.error("Cannot create signed url to upload file");
  } else {
    url = signedUlrRes.data.url;
  }
  return {
    url,
    key,
  };
};
