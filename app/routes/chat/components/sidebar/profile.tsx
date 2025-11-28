import { useAuth0 } from '@auth0/auth0-react'
import { envConfig } from '~/utils/envConfig'
import { formatName } from '~/utils/helper'
import LogoutIcon from '/icons/logout.svg'
import { useRef, useState } from 'react'
import { useClickOutside } from '~/hooks/useClickOutsite'

export default function Profile() {
    const [show, setShow] = useState(false)
    const { user, logout } = useAuth0()
    const menuRef = useRef<HTMLDivElement>(null)
    if (!user) return null
    const handleOpen = () => {
        setShow(true)
    }
    const handleClose = () => {
        setShow(false)
    }
    useClickOutside(menuRef, handleClose)
    return (
        <div className="sidebar__settings">
            <div className='profile' onClick={handleOpen}>
                <img src={user.picture || "/images/user.jpg"} alt="Avatar" className="user-avatar" />
                <div className="user-info">
                    <strong>{formatName(user)}</strong>
                    <p>{user?.email}</p>
                </div>
            </div>
            <div className={`settings ${show ? 'open' : ""}`} ref={menuRef}>
                <p onClick={() => logout({
                    logoutParams: {
                        returnTo: envConfig.LANDING_PAGE+'/auth/logout'
                    }
                })}>
                    <img src={LogoutIcon} alt="Logout" />
                    Logout</p>
            </div>
        </div>
    )
}