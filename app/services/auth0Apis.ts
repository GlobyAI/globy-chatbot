import axios from "axios";
import { envConfig } from "~/utils/envConfig";

async function getAuth0Token() {
  try {
    const res = await axios(
      `${envConfig.AUTH0_DOMAIN}/oauth/token`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        data: JSON.stringify({
          client_id: envConfig.AUTH0_MTM_CLIENT_ID,
          client_secret: envConfig.AUTH0_MTM_CLIENT_SECRET,
          audience: envConfig.AUTH0_AUDIENCE,
          grant_type: "client_credentials",
        }),
      }
    );
    if (res.status !== 200) {
      throw new Error("Unable to get Auth0 Management API token");
    }
    return res.data.access_token;
  } catch (error) {
    console.error("cannot get auth0 token");
  }
}
export async function resendEmail(user_id: string) {
  const token = getAuth0Token();
  if (token) {
    const identity = user_id?.split("|");
    const verifyEmailRes = await axios(
      `${envConfig.APP_DOMAIN}/api/v2/jobs/verification-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        data: JSON.stringify({
          user_id,
          client_id: envConfig.AUTH0_CLIENT_ID,
          identity: {
            user_id: identity[1],
            provider: identity[0],
          },
        }),
      }
    );
    if (verifyEmailRes?.status === 201) {
      return true;
    }
  }
  return false;
}
export async function updateAuth0AppMetadata(
  user_id: string,
  data: { [key: string]: any }
) {
  try {
    const token = await getAuth0Token();
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
