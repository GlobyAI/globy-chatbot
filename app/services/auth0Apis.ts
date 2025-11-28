import axios from "axios";
import { envConfig } from "~/utils/envConfig";

export async function updateAuth0AppMetadata(
  user_id: string,
  data: { [key: string]: any },
  token: string
) {
  try {
    if (token) {
      try {
        await axios(
          `${envConfig.AUTH0_DOMAIN}/api/v2/users/${encodeURIComponent(user_id)}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
            data,
          }
        );
      } catch (err) {
        console.error(err || "cannot update auth0 user metadata");
      }
    }
  } catch (error) {
    console.error(error || "cannot get auth token");
  }
}
