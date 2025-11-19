import type { RgbaColor, HsvaColor } from '@uiw/react-color'
import { hsvaToHex, rgbaToHex, rgbaToHsva, Saturation, Hue, Alpha, hexToHsva, hsvaToRgba } from '@uiw/react-color'
import { Fragment, useEffect, useRef, useState } from 'react'
import { convertAlphaToPercent } from '~/utils/colorPickerHelp'
import { setUserColorPreferences } from '~/services/appApis'
import { useAppContext } from '~/providers/AppContextProvider'

type Props = {
    value?: RgbaColor
    onChange?: (color: RgbaColor) => void
    onBlur?: () => void
}

export default function ColorPicker({ value, onChange, onBlur }: Props) {
    const { userId } = useAppContext();
    const [show, setShow] = useState(false)
    const [opacity, setOpacity] = useState<string>('100')
    const [text, setText] = useState('#420A7F')
    const [hsva, setHsva] = useState<HsvaColor>(() => hexToHsva('#420A7F'))
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const firstRenderRef = useRef(true)
    const pickerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)


    const postSelectedColor = async(userId: string, color: string, prompt: string) => {
        try {
            await setUserColorPreferences(userId, [color], prompt)
        } catch(error) {
            console.log(error)
        }
    }

    // Initialize from value prop
    useEffect(() => {
        if (value) {
            const hsvaColor = rgbaToHsva(value)
            setHsva(hsvaColor)
            setText(hsvaToHex(hsvaColor))
            setOpacity(convertAlphaToPercent(hsvaColor.a).toString())
        }
    }, [value])

    // Handle clicks outside to close picker
    useEffect(() => {
        if (!show) return

        const handleClickOutside = (event: MouseEvent) => {
            if (
                pickerRef.current && 
                !pickerRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                close()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [show])

    const open = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect()
            const pickerWidth = 220 // 20rem + padding
            const pickerHeight = 320 // approximate height
            
            let top = rect.bottom + 8 // 8px gap below button
            let left = rect.left
            
            // Check if picker goes off right edge
            if (left + pickerWidth > window.innerWidth) {
                left = window.innerWidth - pickerWidth - 16 // 16px margin
            }
            
            // Check if picker goes off bottom edge
            if (top + pickerHeight > window.innerHeight) {
                top = rect.top - pickerHeight  // Place above button
            }
            
            // Ensure minimum margins
            top = Math.max(16, top)
            left = Math.max(16, left)
            
            setPosition({ top, left })
        }
        
        setShow(true)
        if (value) {
            const hsvaColor = rgbaToHsva(value)
            setHsva(hsvaColor)
            setText(hsvaToHex(hsvaColor))
            setOpacity(convertAlphaToPercent(hsvaColor.a).toString())
        }
        firstRenderRef.current = true
    }

    const close = () => {
        if (onBlur && !firstRenderRef.current) {
            onBlur()
        }
        setShow(false)
    }

    const updateColor = (newHsva: HsvaColor) => {
        setHsva(newHsva)
        setText(hsvaToHex(newHsva))
        setOpacity(convertAlphaToPercent(newHsva.a).toString())
        
        if (onChange && !firstRenderRef.current) {
            onChange(hsvaToRgba(newHsva))
        }
        
        firstRenderRef.current = false
    }

    const handleChangeColor = (color: HsvaColor) => {
        updateColor(color)
    }

    const handleHue = (newHue: { h: number }) => {
        updateColor({ ...hsva, h: newHue.h })
    }

    const handleAlpha = (newAlpha: { a: number }) => {
        updateColor({ ...hsva, a: newAlpha.a })
    }

    const handleChangeTextColor = (value: string) => {
        firstRenderRef.current = false
        
        // Ensure value starts with #
        const colorValue = value.startsWith('#') ? value : `#${value}`
        setText(colorValue)
    }

    const handleHexBlur = () => {
        // Reset if only '#'
        if (text === '#' || text === '') {
            setText(hsvaToHex(hsva))
            return
        }

        // Validate and update color if hex is valid (3-8 chars after #)
        if (text.length >= 4 && text.length <= 9) {
            try {
                const newHsva = hexToHsva(text)
                updateColor({ ...newHsva, a: hsva.a }) // Keep existing alpha
            } catch (error) {
                // Reset to current color if invalid hex
                setText(hsvaToHex(hsva))
            }
        } else {
            // Reset to current color if invalid length
            setText(hsvaToHex(hsva))
        }
    }

    const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim()
        
        // Allow empty input
        if (inputValue === '') {
            setOpacity('')
            return
        }

        // Only allow numbers
        if (!/^\d+$/.test(inputValue)) return

        // Clamp between 0-100
        const numValue = Math.min(100, Math.max(0, Number(inputValue)))
        const alphaValue = numValue / 100

        setOpacity(String(numValue))
        updateColor({ ...hsva, a: alphaValue })
    }

    const handleOpacityBlur = () => {
        // Reset to current opacity if empty
        if (opacity === '') {
            setOpacity(convertAlphaToPercent(hsva.a).toString())
        }
    }

    const displayColor = value ? rgbaToHex(value) : hsvaToHex(hsva)

    return (
        <div className="color-picker-section">
                <b>Colors</b>
                <p>Choose your brand colors.</p>
                <div className="color-picker-selector-area">
                    <button
                        ref={buttonRef}
                        type="button"
                        className='globy-color-picker'
                        onClick={open}
                        style={{ background: displayColor }}
                        aria-label="Open color picker"
                    />
                    {text}
                </div>
            
            {show && (
                <>
                    {/* <div className="color-picker-overlay" onClick={close} /> */}
                    <div 
                        className="color-picker-wrapper" 
                        ref={pickerRef}
                        style={{
                            position: 'fixed',
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                        }}
                    >
                        <Saturation
                            hsva={hsva}
                            onChange={handleChangeColor}
                        />
                        
                        <div className="slides">
                            <Hue
                                hue={hsva.h}
                                onChange={handleHue}
                            />
                            <Alpha 
                                hsva={hsva} 
                                onChange={handleAlpha} 
                            />
                        </div>
                        
                        <div className="color-input">
                            <div className="color-input__field">
                                <label htmlFor="hex-input">Hex</label>
                                <input
                                    type="text"
                                    id="hex-input"
                                    placeholder="#000000"
                                    value={text}
                                    onBlur={handleHexBlur}
                                    onChange={(e) => handleChangeTextColor(e.target.value)}
                                    maxLength={9}
                                />
                            </div>

                            <div className="color-input__field">
                                <label htmlFor="opacity-input">Opacity</label>
                                <div className="input-with-suffix">
                                    <input
                                        type="tel"
                                        id="opacity-input"
                                        placeholder="100"
                                        value={opacity}
                                        onChange={handleOpacityChange}
                                        onBlur={handleOpacityBlur}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        maxLength={3}
                                    />
                                    <span className='input-field__icon'>%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}