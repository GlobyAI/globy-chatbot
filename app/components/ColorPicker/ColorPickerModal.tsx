import type { HsvaColor } from '@uiw/react-color'
import { Saturation, Hue, Alpha } from '@uiw/react-color'

type Props = {
    pickerRef: React.RefObject<HTMLDivElement | null>
    position: { top: number; left: number }
    hsva: HsvaColor
    text: string
    opacity: string
    onChangeColor: (color: HsvaColor) => void
    onHueChange: (hue: { h: number }) => void
    onAlphaChange: (alpha: { a: number }) => void
    onTextColorChange: (value: string) => void
    onHexBlur: () => void
    onOpacityChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onOpacityBlur: () => void
}

export default function ColorPickerModal({
    pickerRef,
    position,
    hsva,
    text,
    opacity,
    onChangeColor,
    onHueChange,
    onAlphaChange,
    onTextColorChange,
    onHexBlur,
    onOpacityChange,
    onOpacityBlur
}: Props) {
    return (
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
                onChange={onChangeColor}
            />
            
            <div className="slides">
                <Hue
                    hue={hsva.h}
                    onChange={onHueChange}
                />
                <Alpha 
                    hsva={hsva} 
                    onChange={onAlphaChange} 
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
                        onBlur={onHexBlur}
                        onChange={(e) => onTextColorChange(e.target.value)}
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
                            onChange={onOpacityChange}
                            onBlur={onOpacityBlur}
                            pattern="[0-9]*"
                            inputMode="numeric"
                            maxLength={3}
                        />
                        <span className='input-field__icon'>%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}