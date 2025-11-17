import { useAuth0 } from '@auth0/auth0-react'
import { formatName } from '~/utils/helper'
import { QualityScore } from './quality-score'
import { useFetchKpis } from '~/hooks/useFetchKpis';

type Props = {}

export default function Sidebar({ }: Props) {
    const { confidence } = useFetchKpis();
    const percentage = Math.round(confidence * 100);

    const { user } = useAuth0()
    if(!user) return null
    return (
        <div className="sidebar">
            <div className="sidebar__logo">
                <img src="/images/globy_symbol.png" alt="Globy logo" className="logo" />
            </div>
            <div className='sidebar__quality-score'>
                <QualityScore 
                    percentage={percentage}
                    title='Brand Insights'
                    brandStartingPoint='Starting point'
                    brandDetails='No brand details yet'
                />
            </div>
            <div className="sidebar__process">
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