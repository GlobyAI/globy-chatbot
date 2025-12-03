import { useEffect, useState } from "react";
import { useAppContext } from "~/providers/AppContextProvider";
import ArrowRightIcon from "/icons/arrow-right.svg";
import { checkSiteStatus, completeWorkFlow } from "~/services/appApis";
import toast from "react-hot-toast";
import Modal from "~/components/ui/Modal/Modal";
import { envConfig } from "~/utils/envConfig";
import { AxiosError } from "axios";

export default function Complete() {
    const { userId } = useAppContext();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [noSite, setNoSite] = useState(true)
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
    useEffect(() => {
        async function checkIfUserHasSite() {
            if (!userId) return
            const res = await checkSiteStatus(userId)
            if (res.status !== 200) {
                setNoSite(false)
                return
            }
            const data = res.data
            if (data.user_id !== userId) {
                setNoSite(false)
                return
            }
            const status = data.status.toLowerCase()
            if (status !== 'live' || status !== 'ready') {
                setNoSite(false)
            }
        }
        if (userId) {
            checkIfUserHasSite()
        }
    }, [userId])

    if (isRedirecting || isLoading)
        return (
            <Modal open={true}>
                <div className="redirecting">
                    <div className="loader"></div>
                    {isRedirecting && <p>Redirecting</p>}
                </div>
            </Modal>
        )
    if (noSite) return null
    return (
        <div className={`move-on `}>
            <button onClick={handComplete}>
                <p>Generate now</p>
                <img src={ArrowRightIcon} alt="Arrow right" />
            </button>
        </div>
    );
}

