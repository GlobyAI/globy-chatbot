import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'

import ArrowUpIcon from '/icons/arrow-up.svg'
import ArrowUpWhiteIcon from '/icons/arrow-up-white.svg'
import useResizeTextarea from '~/hooks/useResizeTextarea'
import { useWebSocket } from '~/providers/WSProdivder'
import UploadFile from './upload-file'
import type { IUploadFile } from '~/types/models'
import FilePreviews from './file-previews'

type Props = {}

export default function ChatBox({ }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [content, setContent] = useState('')
    const containerRef = useRef<HTMLDivElement | null>(null)
    const textfieldContainerRef = useRef<HTMLDivElement | null>(null)
    const [images, setImages] = useState<IUploadFile[]>([])
    const { isPending } = useWebSocket()
    const { sendMessage } = useWebSocket()



    useResizeTextarea({ value: content, textareaRef, containerRef, hasImage: images.length > 0 })
    const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isPending) {
            setContent(e.target.value)
        }
    }
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


    const handleSubmit = () => {
        if (!images && !content) return
        const image_urls = images.filter(i => i.file.type.includes("image")).map(i => i.url)
        const msg = {
            research: false,
            text: content,
            ...(image_urls && { image_urls: image_urls }),
            ...(images.length > 0 && { research: true })
        }
        sendMessage(msg)
        setContent('')
        setImages([])
    }
    const hasValue = useMemo(() => images.length > 0 || content !== '', [content, images])
    return (
        <div className={`chat-box ${!content && images.length > 0 ? 'has-image' : ''}`} ref={containerRef}  >
            <div className="textfield" ref={textfieldContainerRef} style={{
                marginTop: hasValue ? "12px" : '0',
            }}>
                <FilePreviews images={images} setImages={setImages} />
                <textarea placeholder='Enter something here' onChange={handleChangeText} ref={textareaRef} value={content} style={{
                    height: content ? "auto" : "24px",
                }} />
            </div>
            <div className="chat-box__actions">
                <UploadFile setImages={setImages} images={images} />
                <span className="icons icons--send">
                    {
                        hasValue ?
                            <img src={ArrowUpWhiteIcon} alt="ArrowUpWhiteIcon" onClick={handleSubmit} />
                            :
                            <img src={ArrowUpIcon} alt="ArrowUpIcon" />
                    }
                </span>

            </div>
        </div >
    )
}