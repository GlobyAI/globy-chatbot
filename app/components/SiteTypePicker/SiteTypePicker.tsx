import { useState } from 'react'
import Modal from '~/components/ui/Modal/Modal'
import { SiteTypeEnum } from '~/types/enums'
import PlusIcon from '/icons/plus.svg'

type SiteTypeOption = {
    value: SiteTypeEnum | null
    label: string
    description: string
    badge?: string
    icon: React.ReactNode
}

const AutoIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 3L13.5 8.5H19L14.5 11.5L16 17L12 14L8 17L9.5 11.5L5 8.5H10.5L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
)

const OnePagerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M8 8H16M8 12H16M8 16H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
)

const MultiPagerIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M6 2H20C21.1 2 22 2.9 22 4V18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M6 11H12M6 15H10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
)

const MinimalistIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M9 10H15M9 14H13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
)

const OPTIONS: SiteTypeOption[] = [
    {
        value: null,
        label: 'Auto',
        badge: 'Default',
        description: 'Globy automatically selects the best layout based on your conversation. No manual setup needed — just chat and let Globy decide.',
        icon: <AutoIcon />,
    },
    {
        value: SiteTypeEnum.ONEPAGER,
        label: 'One Pager',
        badge: 'Recommended',
        description: 'A single scrollable page covering everything — hero, about, services, and contact. Optimized and simple, this fits most use cases perfectly.',
        icon: <OnePagerIcon />,
    },
    {
        value: SiteTypeEnum.MULTIPAGER,
        label: 'Multi Pager',
        description: 'Multiple dedicated pages for services, about, contact, and more. Ideal for businesses with rich content, several service lines, or those who need structured navigation.',
        icon: <MultiPagerIcon />,
    },
    {
        value: SiteTypeEnum.MINIMALIST,
        label: 'Minimalist',
        description: 'A clean, stripped-back website built around clarity. Perfect for personal profiles, freelancers, or anyone who wants a simple yet elegant online presence.',
        icon: <MinimalistIcon />,
    },
]

type Props = {
    open: boolean
    currentType: SiteTypeEnum | null
    onClose: () => void
    onSelect: (type: SiteTypeEnum | null) => Promise<void>
}

export default function SiteTypePicker({ open, currentType, onClose, onSelect }: Props) {
    const [selected, setSelected] = useState<SiteTypeEnum | null>(currentType)
    const [saving, setSaving] = useState(false)

    const handleSelect = (value: SiteTypeEnum | null) => {
        setSelected(value)
    }

    const handleConfirm = async () => {
        setSaving(true)
        try {
            await onSelect(selected)
            onClose()
        } finally {
            setSaving(false)
        }
    }

    return (
        <Modal open={open} onClose={onClose} className="site-type-modal">
            <div className="site-type-picker">
                <button className="close-btn" onClick={onClose}>
                    <img src={PlusIcon} alt="Close" />
                </button>

                <div className="site-type-picker__header">
                    <h2 className="heading">Choose a Site Type</h2>
                    <p className="sub-heading">Select the layout that best suits your needs. You can change this at any time.</p>
                </div>

                <div className="site-type-picker__options">
                    {OPTIONS.map((opt) => (
                        <div
                            key={opt.label}
                            className={`option ${opt.value === null ? 'option--auto' : ''} ${selected === opt.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(opt.value)}
                        >
                            {opt.badge && (
                                <div className="option__badge">{opt.badge}</div>
                            )}
                            <div className="option__main">
                                <span className="option__avatar">
                                    {opt.icon}
                                </span>
                                <div className="option__detail">
                                    <strong>{opt.label}</strong>
                                    <p>{opt.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="site-type-picker__actions">
                    <button className="btn-secondary" onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button className="btn-primary" onClick={handleConfirm} disabled={saving}>
                        {saving ? 'Saving…' : 'Confirm'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
