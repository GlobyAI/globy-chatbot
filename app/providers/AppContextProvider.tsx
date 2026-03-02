import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth0, User } from "@auth0/auth0-react";
import toast from "react-hot-toast";

import { verifyUser } from "~/services/authApis";
import { updateAuth0AppMetadata } from "~/services/auth0Apis";
import { envConfig } from "~/utils/envConfig";
import useAppStore from "~/stores/appStore";
import { useNavigate } from "react-router";
import { APP_ROUTES } from "~/utils/vars";
import { setTokenGetter } from "~/services/tokenManager";

interface AppContextType {
  userId: string | null;
}

export const AppContext = createContext<AppContextType>({
  userId: null,
});

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const setIsLoading = useAppStore(s => s.setLoading)

  const {
    user,
    isAuthenticated,
    isLoading: isAuthLoading,
    getAccessTokenSilently,
    loginWithRedirect,
    logout,
  } = useAuth0();

  useEffect(() => {
    setTokenGetter(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  function checkPayment() {
    if (user) {
      const currentPlan = user["https://globy.ai/plan"];
      // No plan selected  → invalid
      if (!currentPlan) {
        return false
      }

      // Non-free plan but not paid → invalid
      if (currentPlan !== "FREE" && user["https://globy.ai/has_paid"] !== true) {
        return false
      }
      return true
    }
    return false
  }


  useEffect(() => {
    const fetchUserInfo = async () => {
      let token = "";
      if (!user) return
      if (user)
        setIsLoading(true);
      // validate ref id och create sale record
      if (user.email_verified === false) {
        setIsLoading(false);
        window.location.href = envConfig.LANDING_PAGE + '/auth'
        return;
      }
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
          try {
            const verifyUserRes = await verifyUser(token, payload || {});
            const globyUserId = verifyUserRes?.data.user_id;
            const globy_id_in_metadata = user["https://globy.ai/globy_id"] || "";
            // const ref_id = user["https://globy.ai/ref_id"] || "";

            // if (ref_id) {
            //   try {
            //     const saleRes = await getSales(token, ref_id, globyUserId);
            //     if (saleRes.data.message === "NO_SALES_FOR_USER") {
            //       await createSale(token, {
            //         user_id: globyUserId,
            //         ref_id,
            //       });
            //     }
            //   } catch (err) {
            //     if (axios.isAxiosError(err)) {
            //       const message = err.response?.data.error
            //       switch (message) {
            //         case 'Message.BAD_REQUEST_UNKNOWN_REF':
            //         case 'Message.SALE_ALREADY_EXISTS':
            //           toast.error("Invalid Reference ID. Contact Globy support");
            //           await updateAuth0AppMetadata(user.sub || "", {
            //             app_metadata: {
            //               ref_id: "",
            //             },
            //           });
            //           setTimeout(() => {
            //             sessionStorage.removeItem("appSession");
            //             logout({
            //               logoutParams: {
            //                 returnTo:
            //                   envConfig.LANDING_PAGE + "/auth/logout",
            //               },
            //             });
            //           }, 2000);
            //           break;
            //         default:
            //           toast.error(err.response?.data.message || 'Something wrong. Contact Globy support"');
            //           break;
            //       }
            //     }else{
            //       console.log('Sale error:',err)
            //     }
            //     return;
            //   }
            // }
            // add globy id i auth0 metadata
            if (!globy_id_in_metadata || globy_id_in_metadata !== globyUserId) {
              try {
                const res = await updateAuth0AppMetadata(user.sub || "", {
                  user_metadata: { globy_id: globyUserId },
                }, token);
                if (res?.status === 200) {
                  await loginWithRedirect({
                    appState: {
                      returnTo: APP_ROUTES.INDEX,
                    },
                    authorizationParams: {
                      prompt: 'none'
                    }
                  })
                }
              } catch (error) {
                console.log("Update Auth0 app metadata error:", error);
              }
            }

            if (verifyUserRes.status === 200 && globyUserId) {
              setUserId(globyUserId);

            } else {
              toast.error("missing user id on auth api");
            }
          } catch (error) {
            console.log("Auth error:", error)
          }
          // validate ref id och create sale record
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
      // const hasPaid = checkPayment()
      // if (!hasPaid) {
      //   navigate(APP_ROUTES.PRICE);
      //   return
      // }
      fetchUserInfo();
    }
  }, [userId, isAuthLoading, isAuthenticated]);
  return (
    <AppContext.Provider
      value={{
        userId,
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
