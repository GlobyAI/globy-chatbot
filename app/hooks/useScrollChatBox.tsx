import React, { useEffect, type RefObject } from 'react'

type Props = {
    textfieldContainerRef: RefObject<HTMLDivElement | null>
}

export default function useScrollChatBox({ textfieldContainerRef }: Props) {
    // helpers
    const canScroll = (el: HTMLElement) =>
        el.scrollHeight > el.clientHeight;

    const atTop = (el: HTMLElement) =>
        el.scrollTop <= 0;

    const atBottom = (el: HTMLElement) =>
        el.scrollTop + el.clientHeight >= el.scrollHeight - 1; // -1 for float rounding


    useEffect(() => {
        const ta = textfieldContainerRef.current;
        if (!ta) return;

        const onWheel = (e: WheelEvent) => {
            if (canScroll(ta)) {
                const goingDown = e.deltaY > 0;
                const hitTop = atTop(ta) && !goingDown;
                const hitBottom = atBottom(ta) && goingDown;

                if (!(hitTop || hitBottom)) {
                    return;
                }
            }

            e.preventDefault();
        };

        ta.addEventListener("wheel", onWheel, { passive: false });
        return () => ta.removeEventListener("wheel", onWheel);
    }, []);

}