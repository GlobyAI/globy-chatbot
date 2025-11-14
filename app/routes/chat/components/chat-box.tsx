import React, { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import PlusIcon from '/icons/plus.svg'
import TrashIcon from '/icons/trash-red.svg'
import ArrowUpIcon from '/icons/arrow-up.svg'
import ArrowUpWhiteIcon from '/icons/arrow-up-white.svg'
import useResizeTextarea from '~/hooks/useResizeTextarea'
import { useWebSocket } from '~/providers/WSProdivder'
import type { MessageData } from '~/types/models'
type Props = {}

export default function ChatBox({ }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [content, setContent] = useState('')
    const containerRef = useRef<HTMLDivElement | null>(null)
    const textfieldContainerRef = useRef<HTMLDivElement | null>(null)
    const [images, setImages] = useState<any[]>([])
    const { sendMessage } = useWebSocket()
    useResizeTextarea({ value: content, textareaRef, containerRef, hasImage: images.length > 0 })
    const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value)
    }
    // helpers
    const canScroll = (el: HTMLElement) =>
        el.scrollHeight > el.clientHeight;

    const atTop = (el: HTMLElement) =>
        el.scrollTop <= 0;

    const atBottom = (el: HTMLElement) =>
        el.scrollTop + el.clientHeight >= el.scrollHeight - 1; // -1 for float rounding

    function handleSelectImage(e: ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) return
        const file = e.target.files[0]
        const objectUrl = URL.createObjectURL(file)
        const img = new window.Image();
        img.src = objectUrl;
        img.onload = () => {
            const newImg = {
                url: objectUrl,
                file_name: file.name,
                type: file.type,
                height: 138
            }
            setImages(prev => [...prev, newImg])
        };
    }
    useEffect(() => {
        const ta = textfieldContainerRef.current;
        if (!ta) return;

        const onWheel = (e: WheelEvent) => {
            // Only handle vertical scroll intents
            // if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
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
    const handleRemoveImage = (idx: number) => {
        setImages(prev => prev.filter((_, index) => index !== idx))
    }

    const handleSubmit = () => {
        if (!images && !content) return
        const msg = {
            research: false,
            text: content,
            ...(images && { image_urls: images })
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
                {
                    images.length > 0 &&
                    <div className="images-container">
                        {
                            images.map((img, idx) => (
                                <figure className='selected-img'>
                                    <img title='Remove image' src={TrashIcon} alt="Delete" className='delete-img' onClick={() => handleRemoveImage(idx)} />
                                    <img src={img.url} key={idx} className='image' />
                                </figure>
                            ))
                        }
                    </div>
                }
                <textarea placeholder='Enter something here' onChange={handleChangeText} ref={textareaRef} value={content} style={{
                    height: content ? "auto" : "24px",
                }} />
            </div>
            <div className="chat-box__actions">
                <span className="icons icons--plus">
                    <label className="" htmlFor='image'>
                        <img src={PlusIcon} alt="PlusIcon" />
                        <input type="file" name="" id="image" hidden onChange={handleSelectImage} />
                    </label>
                    {/* <div className="options-popup">
                        <ul>
                            <li>
                            </li>

                        </ul>
                    </div> */}
                </span>
                <span className="icons icons--send">
                    {
                        hasValue ?
                            <img src={ArrowUpWhiteIcon} alt="ArrowUpWhiteIcon" onClick={handleSubmit} />
                            :
                            <img src={ArrowUpIcon} alt="ArrowUpIcon" />
                    }
                </span>

            </div>
        </div>
    )
}