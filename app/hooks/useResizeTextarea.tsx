import React, { useEffect } from "react";

type Props = {
    value: any;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    mirrorRef: React.RefObject<HTMLElement | null>;
    containerRef: React.RefObject<HTMLDivElement | null>;
};

export default function useResizeTextarea({
    value,
    textareaRef,
    mirrorRef,
    containerRef
}: Props) {

    useEffect(() => {
        const handleResize = () => {
            const node = textareaRef.current!;
            const mirror = mirrorRef.current!;
            const container = containerRef.current!;
            // mirror must match text wrapping and width
            mirror.style.width = node.clientWidth + "px"; // <-- critical
            mirror.textContent = node.value || node.placeholder || 'x'; // ensure at least one line

            node.style.height = "0px";
            const h = Math.min(Math.max(mirror.scrollHeight, 24), 320);
            node.style.height = h + "px";
            node.style.overflowY = mirror.scrollHeight > 320 ? "auto" : "hidden";
            if (node.value) {
                container.classList.add('changed')
            } else {
                container.classList.remove('changed')
            }
        };
        handleResize();
    }, [value, textareaRef, mirrorRef]);
}
