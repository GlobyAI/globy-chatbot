import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { APP_ROUTES } from "~/utils/vars";
import type { Route } from "../../+types/root";
import { function_ } from "valibot";
import SpinnerLoading from "~/components/ui/SpinnerLoading/SpinnerLoading";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Globy.ai | Payment success", },
    ];
}
export default function PaymentSuccess() {
    const params = useParams();
    const plan = params.plan;
    const navigate = useNavigate();
    const { loginWithRedirect } = useAuth0();

    useEffect(() => {
        // 🕒 Wait for gtag to be available (since script may load asynchronously)
        const fireConversion = () => {
            if (typeof window.gtag === "function") {
                window.gtag("event", "conversion", {
                    send_to: "AW-17001169572/53lxCNKpn-4aEKSF5ao_",
                    value: 89.0,
                    currency: "USD",
                });
                console.log("✅ Google Ads conversion fired on page load!");
            } else {
                console.warn("⚠️ gtag not loaded yet, retrying...");
                setTimeout(fireConversion, 1000); // retry in 1s
            }
        };

        fireConversion();
        if (!plan) {
            window.location.href = APP_ROUTES.INDEX;
        }
        if (plan === 'impact') {
            loginWithRedirect({
                appState: { returnTo: APP_ROUTES.INDEX },
                authorizationParams: { prompt: "none" },
            });
        }
    }, [plan]);

    function onContinue() {
        if (!plan) return
        loginWithRedirect({
            appState: { returnTo: APP_ROUTES.INDEX },
            authorizationParams: { prompt: "none" },
        });
    }
    // 🔇 Avoid rendering page for “impact” plan redirect
    if (plan === "impact") return <SpinnerLoading />;

    return (
        <div className="payment-status success">
            <div>
                <h2>
                    <img src="/icons/ticket.svg" />
                    Payment Success
                </h2>
                <button
                    onClick={onContinue}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
