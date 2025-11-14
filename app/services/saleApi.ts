import axios from "axios";

export async function getSales(token: string, ref_id: string, user_id: string) {
  return await axios(
    `${process.env.REACT_APP_SALES_API}/sales?ref_id=${ref_id}&user_id=${user_id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }
  );
}
export async function createSale(
  token: string,
  data: {
    user_id: string;
    ref_id: string;
  }
) {
  return await axios(`${process.env.REACT_APP_SALES_API}/sales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    data,
  });
}
