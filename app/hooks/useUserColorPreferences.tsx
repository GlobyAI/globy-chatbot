import { useEffect, useState } from 'react'
import { useAppContext } from '~/providers/AppContextProvider'
import { fetchUserColorPreferences } from '~/services/appApis'


export const useUserColorPreferences = () => {
    const { userId } = useAppContext()
    const [ userColorPreferences, setUserColorPreferences ] = useState<string[]>([])

    useEffect(() => {
        if (!userId) {
            return;
        }

        const fetchColors = async(userId: string) => {
            try {
                const userColors = await fetchUserColorPreferences(userId);
                setUserColorPreferences(userColors.data.data.colors || [])
            } catch(err) {
                console.log(err);
            }
        }

        fetchColors(userId)

    }, [userId])

    return {
        userColorPreferences
    }
}