import { useEffect, useState } from "react";
import { useAppContext } from "~/providers/AppContextProvider";
import ArrowRightIcon from "/icons/arrow-right.svg";
import { checkSiteStatus, completeWorkFlow } from "~/services/appApis";
import toast from "react-hot-toast";
import Modal from "~/components/ui/Modal/Modal";
import { envConfig } from "~/utils/envConfig";
import { Axios, AxiosError } from "axios";
import { useSearchParams } from "react-router";

export default function Complete() {
    const { userId } = useAppContext();
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSite, setHasSite] = useState(true)
    let [searchParams] = useSearchParams();
    const needRegeneration = searchParams.get('regeneration')
    const refId = searchParams.get('ref')
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
            try {

                const res = await checkSiteStatus(userId)
                const data = res.data
                const status = data.status.toLowerCase()
                if (status !== 'live' || status !== 'ready') {
                    setHasSite(false)
                }
            } catch (error) {
                if (error instanceof AxiosError) {
                    if (error.status === 404) {
                        setHasSite(false)
                    }
                }
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
    const regenerateSite = needRegeneration && refId && needRegeneration === 'true' && refId === userId
    if (hasSite && !regenerateSite) return null
    return (
        <div className={`move-on `}>
            <button onClick={handComplete}>
                <p>{regenerateSite ? 'Regenerate site' : "Generate now"}</p>
                <img src={ArrowRightIcon} alt="Arrow right" />
            </button>
        </div>
    );
}

