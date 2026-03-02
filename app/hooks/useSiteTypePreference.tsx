import { useEffect, useState } from 'react'
import { useAppContext } from '~/providers/AppContextProvider'
import { getSiteType, setSiteType } from '~/services/identityApis'
import { SiteTypeEnum } from '~/types/enums'

export const useSiteTypePreference = () => {
    const { userId } = useAppContext()
    const [siteType, setSiteTypeState] = useState<SiteTypeEnum | null>(null)

    useEffect(() => {
        if (!userId) return

        getSiteType(userId)
            .then((res) => {
                const type = res.data?.data?.site_type
                if (type) setSiteTypeState(type as SiteTypeEnum)
            })
            .catch(() => {
                // 404 means no site_type set — Auto mode
                setSiteTypeState(null)
            })
    }, [userId])

    const updateSiteType = async (type: SiteTypeEnum | null) => {
        if (!userId || type === null) return
        await setSiteType(userId, type)
        setSiteTypeState(type)
    }

    return { siteType, updateSiteType }
}
