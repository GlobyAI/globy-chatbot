import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";

import axios from "axios";
import { createSale, getSales } from "~/services/saleApi";
import { verifyUser } from "~/services/authApis";
import { updateAuth0AppMetadata } from "~/services/auth0Apis";
import { envConfig } from "~/utils/envConfig";

interface AppContextType {
  userId: string | null;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  showVerifyEmailReminder: {
    status: boolean;
    authId: string;
  };
}

export const AppContext = createContext<AppContextType>({
  userId: null,
  isLoading: false,
  setIsLoading: () => { },
  showVerifyEmailReminder: {
    status: false,
    authId: "",
  },
});

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyEmailReminder, setShowVerifyEmailReminder] = useState({
    status: false,
    authId: "",
  });
  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    getAccessTokenSilently,
    logout,
  } = useAuth0();

  useEffect(() => {
    const fetchUserInfo = async () => {
      let token = "";
      setIsLoading(true);
      try {
        token = await getAccessTokenSilently();
      } catch (err) {
        // Check if error is an Auth0Error by inspecting its properties
        if (
          err &&
          typeof err === "object" &&
          "error" in err &&
          "error_description" in err
        ) {
          sessionStorage.removeItem("appSession");
          logout({
            logoutParams: {
              returnTo: envConfig.LANDING_PAGE + "/auth/logout",
            },
          });
        } else {
          console.error("Error on verifying user " + err);
        }
      }
      if (token) {
        sessionStorage.setItem("appSession", token);
        if (user) {
          const excludeKeys = [
            "https://globy.ai/has_paid",
            "https://globy.ai/stripe_customer_id",
            "https://globy.ai/plan",
            "sub",
            "https://globy.ai/ref_id",
          ];
          const payload =
            Object.fromEntries(
              Object.entries(user).filter(([key]) => !excludeKeys.includes(key))
            ) || {};
          const verifyUserRes = await verifyUser(token, payload || {});
          const globyUserId = verifyUserRes?.data.user_id;
          const globy_id_in_metadata = user["https://globy.ai/globy_id"] || "";
          const ref_id = user["https://globy.ai/ref_id"] || "";
          // validate ref id och create sale record
          if (ref_id) {
            try {
              const saleRes = await getSales(token, ref_id, globyUserId);
              if (saleRes.data.message === "NO_SALES_FOR_USER") {
                await createSale(token, {
                  user_id: globyUserId,
                  ref_id,
                });
              }
            } catch (err) {
              if (axios.isAxiosError(err)) {
                const message = err.response?.data.error
                switch (message) {
                  case 'Message.BAD_REQUEST_UNKNOWN_REF':
                  case 'Message.SALE_ALREADY_EXISTS':
                    toast.error("Invalid Reference ID. Contact Globy support");
                    await updateAuth0AppMetadata(user.sub || "", {
                      app_metadata: {
                        ref_id: "",
                      },
                    });
                    setTimeout(() => {
                      sessionStorage.removeItem("appSession");
                      logout({
                        logoutParams: {
                          returnTo:
                            envConfig.LANDING_PAGE + "/auth/logout",
                        },
                      });
                    }, 2000);
                    break;
                  default:
                    toast.error(err.response?.data.message || 'Something wrong. Contact Globy support"');
                    break;
                }
              }
              return;
            }
          }
          // add globy id i auth0 metadata
          if (!globy_id_in_metadata || globy_id_in_metadata !== globyUserId) {
            try {
              await updateAuth0AppMetadata(user.sub || "", {
                app_metadata: { globy_id: globyUserId },
              });
            } catch (error) {
              console.log("error when adding globy id into auth0 user data");
            }
          }

          if (verifyUserRes.status === 200 && globyUserId) {
            setUserId(globyUserId);

          } else {
            toast.error("missing user id on auth api");
          }
          // if (user.email_verified === false) {
          //   setIsLoading(false);
          //   setShowVerifyEmailReminder({
          //     status: true,
          //     authId: user.sub || '',
          //   });
          //   return;
          // }
        } else {
          toast.error("Missing email or user profile");
        }
      }
      setIsLoading(false);
    };
    if (
      !userId &&
      !isAuthLoading &&
      // !showVerifyEmailReminder.status &&
      isAuthenticated
    ) {
      fetchUserInfo();
    }
  }, [userId, isAuthLoading, isAuthenticated]);
  return (
    <AppContext.Provider
      value={{
        showVerifyEmailReminder,
        userId,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
}
