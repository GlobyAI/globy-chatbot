import { Auth0Provider } from '@auth0/auth0-react'
import React from 'react'
import { useNavigate } from 'react-router';
import { envConfig } from '~/utils/envConfig';

type Props = {
    children: React.ReactNode
}

function ThemeCapture({ children }: { children: React.ReactNode }) {
    // Save theme to sessionStorage synchronously during render so child
    // effects (AppContextProvider) can read it before their own effects fire.
    // withAuthenticationRequired in chat.tsx handles the login redirect —
    // we must NOT call loginWithRedirect here or it aborts the route module
    // download and causes an infinite reload loop.
    if (typeof window !== 'undefined') {
        const theme = new URLSearchParams(window.location.search).get('theme');
        if (theme) {
            sessionStorage.setItem('globy_theme', theme);
        }
    }

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
