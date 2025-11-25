import ArrowRightIcon from '/icons/arrow-left.svg'
import PlusIcon from '/icons/plus.svg'
import ArrowUpIcon from '/icons/keyboard-arrow-up.svg'
import QualityScoreCard from './quality-score-card'
import UploadLogo from './upload-logo'
import ImageLibrary from './image-library'
import useUploadLogo from '~/hooks/useUploadLogo'
import Profile from './profile'
import { useClickOutside } from '~/hooks/useClickOutsite'
import { useEffect, useRef, useState } from 'react'

type Props = {
    handleCloseSidebar: () => void,
    handleToggle: () => void
}

const LARGE_SCREEN_WIDTH = 1199;
export default function Sidebar({ handleCloseSidebar, handleToggle }: Props) {
    const { onUploadFile, pct, uploadedImages, onDeleteImage, isUploading, logo } = useUploadLogo()
    const sideBarRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth < LARGE_SCREEN_WIDTH)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < LARGE_SCREEN_WIDTH) {
                handleCloseSidebar()
            }
            setIsMobile(window.innerWidth < LARGE_SCREEN_WIDTH)
        }
        window.addEventListener('resize', handleResize)
        handleResize()
        return () => window.removeEventListener('resize', handleResize)

    }, [])
    useClickOutside(sideBarRef, () => {
        if (isMobile) {
            handleCloseSidebar()

        }
    })
    return (
        <div className={`sidebar `} ref={sideBarRef}>
            <span className="sidebar__toggle-icon" onClick={handleToggle}>
                <img src={ArrowRightIcon} alt=" Toggle icon" />
            </span>
            <span className="sidebar__close" onClick={handleCloseSidebar}>
                <img src={PlusIcon} alt=" Close icon" />
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