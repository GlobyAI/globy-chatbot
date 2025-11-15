import axiosInstance, { getTokenFromSession } from "./axiosInstance";

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
