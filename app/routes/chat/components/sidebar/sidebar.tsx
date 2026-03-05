import ArrowRightIcon from '/icons/arrow-left.svg'
import PlusIcon from '/icons/plus.svg'
import ArrowUpIcon from '/icons/keyboard-arrow-up.svg'
import QualityScoreCard from './quality-score-card'
import UploadLogo from './upload-logo'
import ColorPicker from '~/components/ColorPicker/ColorPicker';
import { setUserColorPreferences } from '~/services/appApis'
import { useAppContext } from '~/providers/AppContextProvider'

import ImageLibrary from './image-library'
import useUploadLogo from '~/hooks/useUploadLogo'
import Profile from './profile'
import { useClickOutside } from '~/hooks/useClickOutsite'
import { useUserColorPreferences} from '~/hooks/useUserColorPreferences'
import { useSiteTypePreference } from '~/hooks/useSiteTypePreference'
import { useEffect, useRef, useState } from 'react'
import ServiceBusiness from '~/components/ServiceBusiness/ServiceBusiness'
import SiteTypePicker from '~/components/SiteTypePicker/SiteTypePicker'
import { getBookingStatus, type BookingStatus } from '~/services/bookingApis'
import { SiteTypeEnum } from '~/types/enums'

type Props = {
    handleCloseSidebar: () => void,
    handleToggle: () => void
}

const postSelectedColor = async(userId: string, color: string[], prompt: string) => {
    try {
        await setUserColorPreferences(userId, color, prompt)
    } catch(error) {
        console.log(error)
    }
}

const LARGE_SCREEN_WIDTH = 1199;
export default function Sidebar({ handleCloseSidebar, handleToggle }: Props) {
    const { userId } = useAppContext();
    const { onUploadFile, pct, uploadedImages, onDeleteImage, isUploading, logo } = useUploadLogo()
    const sideBarRef = useRef<HTMLDivElement>(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth < LARGE_SCREEN_WIDTH)
    const { userColorPreferences } = useUserColorPreferences()
    const { siteType, updateSiteType } = useSiteTypePreference()
    const [showSiteTypeModal, setShowSiteTypeModal] = useState(false)
    const [showBookingModal, setShowBookingModal] = useState(false)
    const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null)

    const BOOKING_STATUS_KEY = 'globy_booking_status'

    // Load booking status from localStorage and API
    useEffect(() => {
        async function fetchBookingStatus() {
            if (!userId) return

            // First, check localStorage for cached status
            try {
                const cached = localStorage.getItem(`${BOOKING_STATUS_KEY}_${userId}`)
                if (cached) {
                    const cachedStatus = JSON.parse(cached) as BookingStatus
                    setBookingStatus(cachedStatus)
                }
            } catch (e) {
                // Ignore localStorage errors
            }

            // Then try to fetch from API (will update if different)
            try {
                const response = await getBookingStatus(userId)
                if (response.status === 200) {
                    setBookingStatus(response.data)
                    // Cache the result
                    localStorage.setItem(`${BOOKING_STATUS_KEY}_${userId}`, JSON.stringify(response.data))
                }
            } catch (error) {
                // API not available - clear stale cache and default to not configured
                localStorage.removeItem(`${BOOKING_STATUS_KEY}_${userId}`)
                setBookingStatus({ configured: false })
            }
        }
        fetchBookingStatus()
    }, [userId])

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

    const getSiteTypeLabel = (type: SiteTypeEnum | null) => {
        switch (type) {
            case SiteTypeEnum.ONEPAGER: return 'One Pager'
            case SiteTypeEnum.MULTIPAGER: return 'Multi Pager'
            case SiteTypeEnum.MINIMALIST: return 'Minimalist'
            default: return 'Auto'
        }
    }

    const handleBookingModalClose = () => {
        setShowBookingModal(false)
    }

    const handleBookingSetupComplete = (provider: 'globy' | 'calcom', servicesCount?: number) => {
        const newStatus: BookingStatus = {
            configured: true,
            provider,
            servicesCount: servicesCount || 0,
        }
        setBookingStatus(newStatus)

        // Persist to localStorage
        if (userId) {
            localStorage.setItem(`${BOOKING_STATUS_KEY}_${userId}`, JSON.stringify(newStatus))
        }
    }

    const getBookingButtonContent = () => {
        if (bookingStatus?.configured) {
            return (
                <>
                    <span className="booking-btn__icon configured">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                    <span className="booking-btn__text">Manage booking & payments</span>
                </>
            )
        }
        return (
            <>
                <span className="booking-btn__icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1046 21 21 20.1046 21 19V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
                <span className="booking-btn__text">
                    Setup booking & payments
                    <span className="booking-btn__badge">New</span>
                </span>
                <span className="booking-btn__arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </span>
            </>
        )
    }

    return (
        <>
            <div className="sidebar-overlay"></div>
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
                            <div className='sidebar__color-picker'>
                            <ColorPicker
                                preSelectedColors={userColorPreferences}
                                onSelectionChange={(selectedColors) => {
                                    if (userId && selectedColors) {
                                        postSelectedColor(userId, selectedColors, '')
                                    }
                                }}
                            />
                        </div>
                        {/* <UploadLogo logo={logo} pct={pct} onUploadFile={onUploadFile} isUploading={isUploading} onDeleteImage={onDeleteImage} /> */}
                        <ImageLibrary pct={pct} uploadedImages={uploadedImages} isUploading={isUploading} onUploadFile={onUploadFile} onDeleteImage={onDeleteImage} />
                    </div>
                </div>
                <div className="sidebar__site-type">
                    <input type="checkbox" id="site-type" defaultChecked={true} hidden />
                    <label className='style-toggle' htmlFor="site-type">
                        Site Type
                        <img src={ArrowUpIcon} alt="arrow up" />
                    </label>
                    <div className="style-options">
                        <button
                            className="site-type-trigger-btn"
                            onClick={() => setShowSiteTypeModal(true)}
                        >
                            <div className="site-type-trigger-btn__left">
                                <span className="site-type-trigger-btn__icon">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                                        <path d="M8 8H16M8 12H16M8 16H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                    </svg>
                                </span>
                                <div className="site-type-trigger-btn__info">
                                    <span className="site-type-trigger-btn__label">Layout</span>
                                    <span className="site-type-trigger-btn__value">{getSiteTypeLabel(siteType)}</span>
                                </div>
                            </div>
                            <span className="site-type-trigger-btn__arrow">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="sidebar__service-business">
                    <input type="checkbox" name="" id="service-business" defaultChecked={true} hidden />
                    <label className='style-toggle' htmlFor="service-business">
                        Service business
                        <img src={ArrowUpIcon} alt="arrow up" />
                    </label>
                    <div className="style-options">
                        <button
                            className={`setup-booking-btn ${bookingStatus?.configured ? 'configured' : ''}`}
                            onClick={() => setShowBookingModal(true)}
                        >
                            {getBookingButtonContent()}
                        </button>
                        {bookingStatus?.configured && (
                            <p className="booking-info">
                                {bookingStatus.provider === 'globy'
                                    ? `Globy Booking • ${bookingStatus.servicesCount || 0} services`
                                    : 'Connected to Cal.com'
                                }
                            </p>
                        )}
                    </div>
                </div>
                <Profile />
                <ServiceBusiness
                    open={showBookingModal}
                    onClose={handleBookingModalClose}
                    onSetupComplete={handleBookingSetupComplete}
                    isReconfiguring={bookingStatus?.configured || false}
                />
                <SiteTypePicker
                    open={showSiteTypeModal}
                    currentType={siteType}
                    onClose={() => setShowSiteTypeModal(false)}
                    onSelect={updateSiteType}
                />
            </div>
        </>
    )
}
