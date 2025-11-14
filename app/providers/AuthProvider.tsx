import { Auth0Provider } from '@auth0/auth0-react'
import React from 'react'
import { useNavigate } from 'react-router';
import { envConfig } from '~/utils/envConfig';

type Props = {
    children: React.ReactNode
}

export default function AuthProvider({ children }: Props) {
    const navigate = useNavigate();

    const onRedirectCallback = (appState: any) => {
        navigate(appState?.returnTo || "/");
    };

    return (
        <Auth0Provider
            domain={envConfig.AUTH0_DOMAIN || ""}
            clientId={envConfig.AUTH0_CLIENT_ID|| ""}
            authorizationParams={{
                redirect_uri: envConfig.APP_DOMAIN,
                audience: envConfig.AUTH0_AUDIENCE,
                scope: "openid profile email read:current_user"
            }}
            onRedirectCallback={onRedirectCallback}
            cacheLocation="memory"
            useRefreshTokens={true}

        >
            {children}
        </Auth0Provider>
    )
}