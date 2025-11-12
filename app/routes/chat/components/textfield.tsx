import React, { useEffect, useRef, useState, type ChangeEvent } from 'react'
import PlusIcon from '/icons/plus.svg'
import ArrowUpIcon from '/icons/arrow-up.svg'
import ArrowUpWhiteIcon from '/icons/arrow-up-white.svg'
import useResizeTextarea from '~/hooks/useResizeTextarea'
type Props = {}

export default function Textfield({ }: Props) {
    const mirrorRef = useRef<HTMLParagraphElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [value, setValue] = useState('')
    const containerRef = useRef<HTMLDivElement | null>(null)
    useResizeTextarea({ value, textareaRef, mirrorRef, containerRef })
    const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value)
    }
    // helpers
    const canScroll = (el: HTMLElement) =>
        el.scrollHeight > el.clientHeight;

    const atTop = (el: HTMLElement) =>
        el.scrollTop <= 0;

    const atBottom = (el: HTMLElement) =>
        el.scrollTop + el.clientHeight >= el.scrollHeight - 1; // -1 for float rounding

    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;

        const onWheel = (e: WheelEvent) => {
            // Only handle vertical scroll intents
            if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

            // If textarea can scroll, let it scroll until it hits an edge
            if (canScroll(ta)) {
                const goingDown = e.deltaY > 0;
                const hitTop = atTop(ta) && !goingDown;
                const hitBottom = atBottom(ta) && goingDown;

                if (!(hitTop || hitBottom)) {
                    // still has room -> let textarea consume the wheel
                    return;
                }
            }

            // We’re at an edge (or textarea can't scroll): hijack and forward to container
            e.preventDefault(); // requires { passive:false } on addEventListener
        };

        ta.addEventListener("wheel", onWheel, { passive: false });
        return () => ta.removeEventListener("wheel", onWheel);
    }, []);
    return (
        <div className="textfield" ref={containerRef}>
            <span className="icons icons--plus">
                <img src={PlusIcon} alt="PlusIcon" />
            </span>
            <div className="textfield__textarea" >
                <textarea placeholder='Enter something here' onChange={handleChangeText} ref={textareaRef} value={value} style={{
                    height: value ? "auto" : "24px",
                }} />
                <p className="textfield__textarea__mirror" ref={mirrorRef}></p>
            </div>
            <span className="icons icons--send">
                {
                    value ?
                        <img src={ArrowUpWhiteIcon} alt="ArrowUpWhiteIcon" />
                        :
                        <img src={ArrowUpIcon} alt="ArrowUpIcon" />
                }
            </span>

        </div>
    )
}