import React, { createContext, useContext, useEffect, useRef, useState } from "react";
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
  theme: string;
}

export const AppContext = createContext<AppContextType>({
  userId: null,
  theme: "globy",
});

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>("globy");
  const hasVerifiedRef = useRef(false);
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

  // Theme sync: JWT is authoritative when present, otherwise respect localStorage/URL param
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated || !user) return;

    const jwtTheme = user["https://globy.ai/theme"] as string | undefined;
    const VALID_THEMES = ['foretagarna'];

    if (jwtTheme && VALID_THEMES.includes(jwtTheme)) {
      // JWT explicitly says themed — sync to localStorage + DOM
      try { localStorage.setItem('globy_theme', jwtTheme); } catch (e) {}
      setTheme(jwtTheme);
      document.documentElement.setAttribute('data-theme', jwtTheme);
    } else if (jwtTheme === 'globy') {
      // JWT explicitly says globy — clear stale cache to prevent teal flash
      // for users switched back from foretagarna to default
      try { localStorage.removeItem('globy_theme'); } catch (e) {}
      setTheme('globy');
      document.documentElement.removeAttribute('data-theme');
    } else {
      // No JWT theme claim — respect what blocking script already set
      // (from localStorage or URL param)
      let cached: string | null = null;
      try { cached = localStorage.getItem('globy_theme'); } catch (e) {}
      if (cached && VALID_THEMES.includes(cached)) {
        setTheme(cached);
        document.documentElement.setAttribute('data-theme', cached);
      }
    }
  }, [user, isAuthenticated, isAuthLoading]);

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
          const storedTheme = theme; // Already resolved by JWT theme sync effect above
          try {
            const verifyUserRes = await verifyUser(token, payload || {}, storedTheme);
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
                      theme: storedTheme,
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
    } else if (userId && !isAuthLoading && isAuthenticated && user && !hasVerifiedRef.current) {
      // Non-blocking: ensure user exists in auth backend on login even when userId is already set.
      // Theme is intentionally omitted to avoid overwriting it.
      // Runs once per page load (login) via hasVerifiedRef.
      hasVerifiedRef.current = true;
      getAccessTokenSilently().then((token) => {
        const excludeKeys = [
          "https://globy.ai/has_paid",
          "https://globy.ai/stripe_customer_id",
          "https://globy.ai/plan",
          "sub",
          "https://globy.ai/ref_id",
        ];
        const payload = Object.fromEntries(
          Object.entries(user).filter(([key]) => !excludeKeys.includes(key))
        );
        verifyUser(token, payload).catch(() => {});
      }).catch(() => {});
    }
  }, [userId, isAuthLoading, isAuthenticated]);
  return (
    <AppContext.Provider
      value={{
        userId,
        theme,
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
