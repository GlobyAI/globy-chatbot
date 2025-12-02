import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { APP_ROUTES } from "~/utils/vars";
import type { Route } from "../../+types/root";

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

        // 🔐 If plan missing or 'impact', redirect to homepage silently
        if (!plan || plan === "impact") {
            loginWithRedirect({
                appState: { returnTo: APP_ROUTES.INDEX },
                authorizationParams: { prompt: "none" },
            });
            window.location.href = APP_ROUTES.INDEX;
        }
    }, []);

    // 🔇 Avoid rendering page for “impact” plan redirect
    if (plan === "impact") return null;

    return (
        <div className="payment-status success">
            <div>
                <h2>
                    <img src="/icons/ticket.svg" />
                    Payment Success
                </h2>
                <button
                    onClick={() => navigate(APP_ROUTES.INDEX)}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
