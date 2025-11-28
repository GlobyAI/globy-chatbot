import { useState } from "react";
import { useAppContext } from "~/providers/AppContextProvider";
import ArrowRightIcon from "/icons/arrow-right.svg";
import { completeWorkFlow } from "~/services/appApis";
import toast from "react-hot-toast";
import Modal from "~/components/ui/Modal/Modal";
import { envConfig } from "~/utils/envConfig";
import { AxiosError } from "axios";

export default function Complete() {
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

    if (isRedirecting || isLoading)
        return (
            <Modal open={true}>
                <div className="redirecting">
                    <div className="loader"></div>
                    {isRedirecting && <p>Redirecting</p>}
                </div>
            </Modal>
        )
    return (
        <div className={`move-on `}>
            <button onClick={handComplete}>
                <p>Generate now</p>
                <img src={ArrowRightIcon} alt="Arrow right" />
            </button>
        </div>
    );
}

