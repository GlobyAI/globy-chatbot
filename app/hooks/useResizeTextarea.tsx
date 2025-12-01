import React, { useEffect } from "react";
import type { IUploadFile } from "~/types/models";

type Props = {
    value: any;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    containerRef: React.RefObject<HTMLLabelElement | null>;
    hasImage?: boolean,
    uploadedFiles?:IUploadFile[]
}
    ;

export default function useResizeTextarea({
    value,
    textareaRef,
    containerRef,
    hasImage=false,
    uploadedFiles=[]
}: Props) {

    useEffect(() => {
        const handleResize = () => {
            const node = textareaRef.current!;
            const container = containerRef.current!;
            if(!node || !container) return
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
        };
        handleResize();
    }, [value, textareaRef,uploadedFiles]);
}
