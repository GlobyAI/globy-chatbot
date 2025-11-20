import { useAuth0 } from '@auth0/auth0-react'
import { formatName } from '~/utils/helper'
import ArrowRightIcon from '/icons/arrow-right.svg'
import QualityScoreCard from './quality-score-card'
import UploadLogo from './upload-logo'
import ColorPicker from '~/components/ColorPicker/ColorPicker';
import { setUserColorPreferences } from '~/services/appApis'
import { useAppContext } from '~/providers/AppContextProvider'


type Props = { toggleSidebar: () => void }

const postSelectedColor = async(userId: string, color: string, prompt: string) => {
    try {
        await setUserColorPreferences(userId, [color], prompt)
    } catch(error) {
        console.log(error)
    }
}

export default function Sidebar({ toggleSidebar }: Props) {
    const { user } = useAuth0()
    const { userId } = useAppContext();
    
    if (!user) return null
    return (
        <div className={`sidebar `} >
            <span className="sidebar__toggle-icon" onClick={toggleSidebar}>
                <img src={ArrowRightIcon} alt=" Toggle icon" />
            </span>
            <div className="sidebar__logo">
                <img src="/images/globy_symbol.png" alt="Globy logo" className="logo" />
            </div>
            <QualityScoreCard />
            <div className='sidebar__color-picker'>
                <ColorPicker onBlur={(hsva) => {
                    if (userId && hsva) {
                        postSelectedColor(userId, hsva, '')
                    }
                }}/>
            </div>
            <div className="sidebar__styles">
                <UploadLogo />
            </div>
            <div className="sidebar__settings">
                <img src={user.picture || "/images/user.jpg"} alt="Avatar" className="user-avatar" />
                <div className="user-info">
                    <strong>{formatName(user)}</strong>
                    <p>{user?.email}</p>
                </div>
            </div>
        </div>
    )
}