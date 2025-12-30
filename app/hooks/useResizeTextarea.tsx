import React, { useEffect, useRef } from "react";
import { useChatBoxContext } from "~/providers/ChatboxProvider";
import type { IUploadFile } from "~/types/models";

type Props = {
    value: any;
    hasImage?: boolean,
    uploadedFiles?: IUploadFile[]
}
    ;

export default function useResizeTextarea({
    value,
    hasImage = false,
    uploadedFiles = []
}: Props) {
    const { isAnalyzing } = useChatBoxContext()

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const containerRef = useRef<HTMLLabelElement | null>(null)
    useEffect(() => {
        const handleResize = () => {
            const node = textareaRef.current!;
            const container = containerRef.current!;
            if (!node || !container) return
            node.style.height = "0px";
            const h = Math.max(node.scrollHeight, 24)
            node.style.height = h + "px";
            if (node.value) {

                if (h > 24) {
                    container.classList.add('has-value')
                }
            } else {
                if (hasImage) {
                    container.classList.add('has-image')
                }
                container.classList.remove('has-value')
            }
            if (isAnalyzing) {
                container.classList.add('analyzing')
            } else {
                container.classList.remove('analyzing')
            }
        };
        handleResize();
    }, [value, textareaRef, uploadedFiles, isAnalyzing]);

    return {
        textareaRef,
        containerRef
    }
}
