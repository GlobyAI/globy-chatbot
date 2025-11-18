import { useAuth0 } from '@auth0/auth0-react'
import { formatName } from '~/utils/helper'
import ArrowRightIcon from '/icons/arrow-right.svg'
import QualityScoreCard from './quality-score-card'
import UploadLogo from './upload-logo'

type Props = { toggleSidebar: () => void }

export default function Sidebar({ toggleSidebar }: Props) {
    const { user } = useAuth0()
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