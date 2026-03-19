import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { envConfig } from '~/utils/envConfig';

type Props = {
    children: React.ReactNode
}

function ThemeCapture({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const theme = params.get('theme');

        if (theme) {
            // Write to sessionStorage as backup before Auth0 redirect
            sessionStorage.setItem('globy_theme', theme);

            // If not authenticated and not loading, auto-trigger login with theme in appState
            if (!isAuthenticated && !isLoading) {
                loginWithRedirect({
                    appState: {
                        returnTo: window.location.pathname,
                        theme: theme,
                    },
                });
            }
        }
    }, [isAuthenticated, isLoading, loginWithRedirect]);

    return <>{children}</>;
}

export default function AuthProvider({ children }: Props) {
    const navigate = useNavigate();

    const onRedirectCallback = (appState: any) => {
        // Recover theme from Auth0 appState and persist to sessionStorage
        const theme = appState?.theme;
        if (theme) {
            sessionStorage.setItem('globy_theme', theme);
        }
        navigate(appState?.returnTo || "/");
    };

    return (
        <Auth0Provider
            domain={envConfig.AUTH0_DOMAIN || ""}
            clientId={envConfig.AUTH0_CLIENT_ID || ""}
            authorizationParams={{
                redirect_uri: envConfig.APP_DOMAIN,
                audience: envConfig.AUTH0_AUDIENCE,
                scope: envConfig.AUTH0_SCOPE
            }}
            onRedirectCallback={onRedirectCallback}
            cacheLocation="memory"
            useRefreshTokens={true}
        >
            <ThemeCapture>
                {children}
            </ThemeCapture>
        </Auth0Provider>
    )
}
