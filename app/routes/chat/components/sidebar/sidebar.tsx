import { useAuth0 } from '@auth0/auth0-react'
import { formatName } from '~/utils/helper'
import ArrowRightIcon from '/icons/arrow-left.svg'
import ArrowUpIcon from '/icons/keyboard-arrow-up.svg'
import QualityScoreCard from './quality-score-card'
import UploadLogo from './upload-logo'
import ImageLibrary from './image-library'
import useUploadLogo from '~/hooks/useUploadLogo'
import Profile from './profile'

type Props = { toggleSidebar: () => void }

export default function Sidebar({ toggleSidebar }: Props) {
    const { onUploadFile, pct, uploadedImages, onDeleteImage, isUploading, logo } = useUploadLogo()
    
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
                <input type="checkbox" name="" id="styles" defaultChecked={true} hidden />
                <label className='style-toggle' htmlFor="styles">Styles
                    <img src={ArrowUpIcon} alt="arrow up" />
                </label>
                <div className="style-options">
                    <UploadLogo logo={logo} pct={pct} onUploadFile={onUploadFile} isUploading={isUploading} onDeleteImage={onDeleteImage} />
                    <ImageLibrary pct={pct} uploadedImages={uploadedImages} isUploading={isUploading} onUploadFile={onUploadFile} onDeleteImage={onDeleteImage} />
                </div>
            </div>
            <Profile />
        </div>
    )
}