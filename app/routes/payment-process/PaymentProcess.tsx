
import type { Route } from "../../+types/root";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import TypingIndicator from "~/components/ui/TypingIndicator/TypingIndicator";
import { APP_ROUTES } from "~/utils/vars";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Globy.ai | Payment process", },
    ];
}
export default function PaymentProcess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id')
    const navigate = useNavigate()
    const { loginWithRedirect } = useAuth0()
    useEffect(() => {
        const processCallback = async () => {
            if (sessionId) {
                await loginWithRedirect({
                    appState: {
                        returnTo: '/payment-success?session_id=' + sessionId
                    },
                    authorizationParams: {
                        prompt: 'none',
                    }
                })
            }
            else {
                navigate(APP_ROUTES.INDEX)
            }

        }
        processCallback();
    }, []);
    return <div className="payment-status ">
        <div className="content">
            <h2>Processing payment...</h2>
            <TypingIndicator />
        </div>
    </div>
}