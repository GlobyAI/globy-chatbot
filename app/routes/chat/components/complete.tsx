import { useEffect, useRef, useState } from "react";
import { useAppContext } from "~/providers/AppContextProvider";
import AiIcon from "/icons/sparkles.svg";
import { checkSiteStatus, completeWorkFlow } from "~/services/appApis";
import toast from "react-hot-toast";
import Modal from "~/components/ui/Modal/Modal";
import { envConfig } from "~/utils/envConfig";
import { Axios, AxiosError } from "axios";
import { useSearchParams } from "react-router";
import { useWebSocket } from "~/providers/WSProdivder";
import { useWebSocketStore } from "~/stores/websocketStore";

export default function Complete() {
    const { userId } = useAppContext();
    const messages = useWebSocketStore(s => s.messages)
    const { isWSPending } = useWebSocket()
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSite, setHasSite] = useState(false)
    let [searchParams] = useSearchParams();
    let didCheck = false;
    useEffect(() => {
        console.log("MOUNT Complete");
        return () => console.log("UNMOUNT Complete");
    }, []);
    useEffect(() => {
        if (!userId) return
        // has not a site
        if (!hasSite) return
        const needRegeneration = searchParams.get('regeneration')
        const refId = searchParams.get('ref')
        // regeneration = true and ref id = user id , that mean user with the same user id want to generate a new site
        if (needRegeneration && refId && needRegeneration === 'true' && refId === userId) return
        // window.location.href = envConfig.LANDING_PAGE + '/auth'
    }, [searchParams, hasSite, userId])
    async function handComplete() {
        if (userId && !isWSPending) {
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
            if (didCheck) return;
            didCheck = true;
            try {
                const res = await checkSiteStatus(userId)
                const data = res.data
                const status = data.status.toLowerCase()
                setHasSite(status !== 'onboarding')
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
    if (messages.length < 2) return null
    return (
        <div className={`move-on `}>
            <button onClick={handComplete} disabled={isWSPending}>
                <img src={AiIcon} alt="Generate" />
                <p>Generate Now</p>
            </button>
        </div>
    );
}

