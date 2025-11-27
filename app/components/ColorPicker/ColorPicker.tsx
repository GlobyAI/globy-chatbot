import type { RgbaColor, HsvaColor } from '@uiw/react-color'
import { hsvaToHex, rgbaToHex, rgbaToHsva, Saturation, Hue, Alpha, hexToHsva, hsvaToRgba } from '@uiw/react-color'
import { Fragment, useEffect, useRef, useState, useCallback } from 'react'
import { convertAlphaToPercent } from '~/utils/colorPickerHelp'
import ColorPickerModal from './ColorPickerModal'
import ColorPalette from './ColorPalette'

type Props = {
    value?: RgbaColor
    onChange?: (color: RgbaColor) => void
    onSelectionChange?: (selectedColors: string[]) => void
    maxColors?: number
}

const DEFAULT_COLOR = '#420A7F'

export default function ColorPicker({ value, onChange, onSelectionChange, maxColors = 2 }: Props) {
    // State management
    const [show, setShow] = useState(false)
    const [opacity, setOpacity] = useState<string>('100')
    const [text, setText] = useState(DEFAULT_COLOR)
    const [hsva, setHsva] = useState<HsvaColor>(() => hexToHsva(DEFAULT_COLOR))
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const [selectedColors, setSelectedColors] = useState<string[]>([])
    const [activeColorIndex, setActiveColorIndex] = useState<number>(0)
    
    // Refs
    const firstRenderRef = useRef(true)
    const pickerRef = useRef<HTMLDivElement>(null)
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

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
            const clickedInsidePicker = pickerRef.current?.contains(event.target as Node)
            const clickedOnColorButton = buttonRefs.current.some(ref => ref?.contains(event.target as Node))
            
            if (!clickedInsidePicker && !clickedOnColorButton) {
                close()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [show, selectedColors])

    // Calculate picker position
    const calculatePosition = useCallback((buttonRef: HTMLButtonElement) => {
        const rect = buttonRef.getBoundingClientRect()
        const pickerWidth = 220
        const pickerHeight = 320
        
        let top = rect.bottom + 8
        let left = rect.left
        
        if (left + pickerWidth > window.innerWidth) {
            left = window.innerWidth - pickerWidth - 16
        }
        
        if (top + pickerHeight > window.innerHeight) {
            top = rect.top - pickerHeight - 8
        }
        
        top = Math.max(16, top)
        left = Math.max(16, left)
        
        return { top, left }
    }, [])

    // Open picker
    const open = useCallback((index: number) => {
        const buttonRef = buttonRefs.current[index]
        if (buttonRef) {
            setPosition(calculatePosition(buttonRef))
        }
        setShow(true)
        firstRenderRef.current = true
    }, [calculatePosition])

    // Close picker
    const close = useCallback(() => {
        const updatedColors = [...selectedColors]
        updatedColors[activeColorIndex] = text
        
        if (onSelectionChange && !firstRenderRef.current) {
            onSelectionChange(updatedColors)
        }

        setShow(false)
    }, [activeColorIndex, selectedColors, text, onSelectionChange])

    // Update color
    const updateColor = useCallback((newHsva: HsvaColor) => {
        setHsva(newHsva)
        const newHexColor = hsvaToHex(newHsva)
        setText(newHexColor)
        setOpacity(convertAlphaToPercent(newHsva.a).toString())
        
        const updatedColors = [...selectedColors]
        updatedColors[activeColorIndex] = newHexColor
        setSelectedColors(updatedColors)
        
        if (onChange && !firstRenderRef.current) {
            onChange(hsvaToRgba(newHsva))
        }
        
        firstRenderRef.current = false
    }, [selectedColors, activeColorIndex, onChange])

    // Color change handlers
    const handleChangeColor = useCallback((color: HsvaColor) => {
        updateColor(color)
    }, [updateColor])

    const handleHue = useCallback((newHue: { h: number }) => {
        updateColor({ ...hsva, h: newHue.h })
    }, [hsva, updateColor])

    const handleAlpha = useCallback((newAlpha: { a: number }) => {
        updateColor({ ...hsva, a: newAlpha.a })
    }, [hsva, updateColor])

    const handleChangeTextColor = useCallback((value: string) => {
        firstRenderRef.current = false
        const colorValue = value.startsWith('#') ? value : `#${value}`
        setText(colorValue)
    }, [])

    const handleHexBlur = useCallback(() => {
        if (text === '#' || text === '') {
            setText(hsvaToHex(hsva))
            return
        }

        if (text.length >= 4 && text.length <= 9) {
            try {
                const newHsva = hexToHsva(text)
                updateColor({ ...newHsva, a: hsva.a })
            } catch (error) {
                setText(hsvaToHex(hsva))
            }
        } else {
            setText(hsvaToHex(hsva))
        }
    }, [text, hsva, updateColor])

    const handleOpacityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value.trim()
        
        if (inputValue === '') {
            setOpacity('')
            return
        }

        if (!/^\d+$/.test(inputValue)) return

        const numValue = Math.min(100, Math.max(0, Number(inputValue)))
        const alphaValue = numValue / 100

        setOpacity(String(numValue))
        updateColor({ ...hsva, a: alphaValue })
    }, [hsva, updateColor])

    const handleOpacityBlur = useCallback(() => {
        if (opacity === '') {
            setOpacity(convertAlphaToPercent(hsva.a).toString())
        }
    }, [opacity, hsva])

    // Palette handlers
    const handleAddColor = useCallback(() => {
        if (selectedColors.length < maxColors) {
            const newColors = [...selectedColors, DEFAULT_COLOR]
            setSelectedColors(newColors)
            const newIndex = newColors.length - 1
            setActiveColorIndex(newIndex)
            
            const defaultHsva = hexToHsva(DEFAULT_COLOR)
            setHsva(defaultHsva)
            setText(DEFAULT_COLOR)
            setOpacity('100')

            if (onSelectionChange) {
                onSelectionChange(newColors)
            }
            
            setTimeout(() => open(newIndex), 0)
        }
    }, [selectedColors, maxColors, onSelectionChange, open])

    const handleRemoveColor = useCallback((index: number, e: React.MouseEvent) => {
        e.stopPropagation()
        if (selectedColors.length > 0) {
            const newColors = selectedColors.filter((_, i) => i !== index)
            setSelectedColors(newColors)

            if(newColors.length === 0) {
                if (onSelectionChange) {
                    onSelectionChange(newColors)
                }
                return;
            }
            
            const newActiveIndex = index === 1 ? 0 : index - 1
            setActiveColorIndex(newActiveIndex)
            
            const activeColor = newColors[newActiveIndex]
            const hsvaColor = hexToHsva(activeColor)
            setHsva(hsvaColor)
            setText(activeColor)
            setOpacity(convertAlphaToPercent(hsvaColor.a).toString())

            if (onSelectionChange) {
                onSelectionChange(newColors)
            }
        }
    }, [selectedColors, onSelectionChange])

    const handleSelectColor = useCallback((index: number) => {
        setActiveColorIndex(index)
        const color = selectedColors[index]
        const hsvaColor = hexToHsva(color)
        setHsva(hsvaColor)
        setText(color)
        setOpacity(convertAlphaToPercent(hsvaColor.a).toString())
        open(index)
    }, [selectedColors, open])

    return (
        <Fragment>
            <b>Colors</b>
            <p>Choose your brand colors.</p>
            
            <ColorPalette
                selectedColors={selectedColors}
                activeColorIndex={activeColorIndex}
                maxColors={maxColors}
                buttonRefs={buttonRefs}
                onSelectColor={handleSelectColor}
                onRemoveColor={handleRemoveColor}
                onAddColor={handleAddColor}
            />
            
            {show && (
                <ColorPickerModal
                    pickerRef={pickerRef}
                    position={position}
                    hsva={hsva}
                    text={text}
                    opacity={opacity}
                    onChangeColor={handleChangeColor}
                    onHueChange={handleHue}
                    onAlphaChange={handleAlpha}
                    onTextColorChange={handleChangeTextColor}
                    onHexBlur={handleHexBlur}
                    onOpacityChange={handleOpacityChange}
                    onOpacityBlur={handleOpacityBlur}
                />
            )}
        </Fragment>
    )
}