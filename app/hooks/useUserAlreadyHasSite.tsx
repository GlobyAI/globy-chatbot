import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { AxiosError } from "axios";
import { useAppContext } from "~/providers/AppContextProvider";
import { checkSiteStatus, completeWorkFlow } from "~/services/appApis";

export const useUserAlreadyHasSite = () => {
    const { userId } = useAppContext();
    const [hasSite, setHasSite] = useState(true)
    const [searchParams] = useSearchParams();
    const refId = searchParams.get('ref')

    const needRegeneration = searchParams.get('regeneration')

    const regenerateSite = needRegeneration && refId && needRegeneration === 'true' && refId === userId

    useEffect(() => {
        const checkIfUserHasSite = async() => {
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

    return {
        userAlreadyHasSite: hasSite && !regenerateSite
    }
}

export default useUserAlreadyHasSite