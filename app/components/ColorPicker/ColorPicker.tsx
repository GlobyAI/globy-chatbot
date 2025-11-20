import type { RgbaColor, HsvaColor } from '@uiw/react-color'
import { hsvaToHex, rgbaToHex, rgbaToHsva, Saturation, Hue, Alpha, hexToHsva, hsvaToRgba } from '@uiw/react-color'
import { Fragment, useEffect, useRef, useState } from 'react'
import { convertAlphaToPercent } from '~/utils/colorPickerHelp'

type Props = {
    value?: RgbaColor | undefined
    onChange?: (color: RgbaColor) => void
    onBlur?: () => void
}
export default function ColorPicker({ value, onChange, onBlur }: Props) {
    const [show, setShow] = useState(false)
    const [opacity, setOpacity] = useState<string>('')
    const [text, setText] = useState('')
    const [hsva, setHsva] = useState<HsvaColor | undefined>({ h: 0, s: 0, v: 100, a: 0 });
    const firstRef = useRef(true)
    const open = () => {
        setShow(true)
        if (value) {
            setHsva(rgbaToHsva(value))
        }
    }
    const close = () => {
        if (onBlur && !firstRef.current) {
            onBlur()
        }
        setShow(false)
        firstRef.current = true

    }

    const handleChangeColor = (color: HsvaColor) => {
        setHsva(color)
        // onChange(hsvaToRgba(color))
        setText(hsvaToHex(color))
        firstRef.current = false

    }
    const handleHue = (n: { h: number }) => {
        setHsva((p) => p ? ({ ...p, h: n.h }) : undefined)
        firstRef.current = false
    };
    const handleAlpha = (n: { a: number }) => {
        if (hsva) {
            firstRef.current = false
            setHsva((p) => p ? ({ ...p, a: n.a }) : undefined)
        }
    }

    const handleChangeTextColor = (value: string) => {
        firstRef.current = false
        setText(value)


    }
    const handelBlur = () => {
        if (text && text === '#') {
            setText('')
        }
        if (text && text.length > 3 && text.length <= 8) {
            const next = hexToHsva(text);
            setHsva(prev => {
                return { ...next, a: next.a ?? prev?.a ?? 1 };
            });
            firstRef.current = false
        }

    }

    useEffect(() => {
        if (hsva) {
            setOpacity(convertAlphaToPercent(hsva.a).toString())
            setText(hsvaToHex(hsva))
            if (!firstRef.current) {
                // onChange(hsvaToRgba(hsva))
            }
        }
    }, [hsva])


    return (
        <Fragment>
            <span className='globy-color-picker' onClick={open} style={{
                background: value ? rgbaToHex(value) : ''
            }}></span>
            {
                show &&
                <Fragment>
                    <div className="color-picker-wrapper" >
                        <Saturation
                            hsva={hsva}
                            onChange={handleChangeColor}
                            className="h-36 rounded-lg"
                        />
                        <div className="slides">
                            <Hue
                                hue={hsva ? hsva.h : undefined}
                                onChange={handleHue}
                                className="hue-container"
                            />
                            <Alpha hsva={hsva ? hsva : { h: 0, s: 75, v: 82, a: 1 }} onChange={handleAlpha} />
                        </div>
                        <div className="color-input">
                            <span>Hex</span>
                            {/* <InputField type="tel" placeholder="Color" id="opacity"
                                value={text}
                                onBlur={handelBlur}
                                onChange={(evn: ChangeEvent<HTMLInputElement>) => {
                                    const v = evn.target.value
                                    handleChangeTextColor(v.startsWith('#') ? v : `#${v}`)

                                }}
                            >
                            </InputField>

                            <InputField onChange={(e) => {
                                const numb = e.target.value.trim();
                                if (numb === '') { setOpacity(''); return; }
                                if (!/^\d+$/.test(numb)) return;

                                const n = Math.min(100, Math.max(0, Number(numb)));
                                const a = n / 100;
                                if (firstRef.current) {
                                    firstRef.current = false
                                }
                                setOpacity(String(n));
                                setHsva(p => (p ? { ...p, a } : p));
                            }} value={opacity} type="tel" pattern="[0-9]*" inputMode="numeric" placeholder="Opacity" id="opacity"   >
                                <span className='input-field__icon'>%</span>
                            </InputField> */}
                        </div>

                    </div>
                </Fragment>


            }
        </Fragment >
    )
}