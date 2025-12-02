import { useId } from 'react'

type Props = {
    checked: boolean
    onChange: (checked: boolean) => void
    label?: string
    disabled?: boolean
}

export default function Switch({ checked, onChange, label, disabled = false }: Props) {
    const id = useId()

    return (
        <div className="switch-wrapper">
            <input
                type="checkbox"
                id={id}
                className="switch-input"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                aria-label={label}
            />
            <label htmlFor={id} className="switch-label">
                <span className="switch-track">
                    <span className="switch-thumb" />
                </span>
                {label && <span className="switch-text">{label}</span>}
            </label>
        </div>
    )
}