import { useState } from "react";
import { useAppContext } from "~/providers/AppContextProvider";
import ArrowRightIcon from "/icons/arrow-right.svg";
import ConfirmIcon from "/icons/confirm.svg";
import { completeWorkFlow } from "~/services/appApis";
import toast from "react-hot-toast";
import Modal from "~/components/ui/Modal/Modal";
import { envConfig } from "~/utils/envConfig";
import { AxiosError } from "axios";

export default function Complete() {
    const [willComplete, setWillComplete] = useState(false);

    function handleToggleConfirm() {
        setWillComplete((prev) => !prev);
    }
    return (
        <div className={`move-on `}>
            {
                <button onClick={handleToggleConfirm}>
                    <p>Continue</p>
                    <img src={ArrowRightIcon} alt="Arrow right" />
                </button>
            }
            <ContinueConfirm
                handleToggleConfirm={handleToggleConfirm}
                willComplete={willComplete}
            />
        </div>
    );
}

function ContinueConfirm({
    handleToggleConfirm,
    willComplete,
}: {
    handleToggleConfirm: () => void;
    willComplete: boolean;
}) {
    const { userId } = useAppContext();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    async function handComplete() {
        if (userId) {
            setIsLoading(true);
            try {
                const res = await completeWorkFlow(userId);
                if (res.data.status.includes("completed")) {
                    setIsRedirecting(true);
                    setTimeout(() => {
                        window.location.href = `${envConfig.LANDING_PAGE}/auth/login?prompt=none&returnTo=${envConfig.LANDING_PAGE}/account`;
                    }, 2000);
                } else {
                    toast.success("Status: ", res.data.status);
                }
            } catch (error) {
                console.log("completeWorkFlow error: ", error);
                if (error instanceof AxiosError) {
                    toast.error(error.response?.data?.detail || "An error occurred");
                } else {
                    toast.error("An error occurred. Try again later");
                }
            } finally {
                setIsLoading(false);
            }
        }
    }

    return (
        <Modal open={willComplete}>
            {isRedirecting || isLoading ? (
                <div className="redirecting">
                    <div className="loader"></div>
                    {isRedirecting && <p>Redirecting</p>}
                </div>
            ) : (
                <div className="confirm">
                    <div className="confirm__icon">
                        <figure>
                            <img src={ConfirmIcon} alt="Warning Icon" />
                        </figure>
                    </div>
                    <div className="confirm__content">
                        <h6>Ready to move on?</h6>
                        <p>
                            Everything you&#39;ve shared is saved. <br />
                            We&#39;ll start preparing your website and you can continue building
                            it from the site editor.    
                        </p>
                    </div>
                    <div className="confirm__btns">
                        <button
                            className="btn btn--secondary"
                            onClick={handleToggleConfirm}
                        >
                            Stay in chat
                        </button>
                        <button className="btn btn--primary" onClick={handComplete}>
                            Go to Dashboard{" "}
                        </button>
                    </div>
                </div>
            )
            }
        </Modal >
    );
}
