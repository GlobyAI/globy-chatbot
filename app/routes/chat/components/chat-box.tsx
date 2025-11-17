import { useEffect, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react'

import ArrowUpIcon from '/icons/arrow-up.svg'
import ArrowUpWhiteIcon from '/icons/arrow-up-white.svg'
import useResizeTextarea from '~/hooks/useResizeTextarea'
import { useWebSocket } from '~/providers/WSProdivder'
import UploadFile from './upload-file'
import type { IUploadFile } from '~/types/models'
import FilePreviews from './file-previews'
import useScrollChatBox from '~/hooks/useScrollChatBox'

type Props = {}

export default function ChatBox({ }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [content, setContent] = useState('')
    const containerRef = useRef<HTMLDivElement | null>(null)
    const textfieldContainerRef = useRef<HTMLDivElement | null>(null)
    const [uploadedFiles, setUploadedFiles] = useState<IUploadFile[]>([])
    const [pct, setPct] = useState(0)
    const { isPending } = useWebSocket()
    const { sendMessage } = useWebSocket()
    useScrollChatBox({ textfieldContainerRef })
    useResizeTextarea({ value: content, textareaRef, containerRef, hasImage: uploadedFiles.length > 0 })
    const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isPending) {
            setContent(e.target.value)
        }
    }


    const handleSubmit = () => {
        if (!uploadedFiles && !content) return
        const image_urls = uploadedFiles.filter(i => i.file.type.includes("image")).map(i => i.url)
        const msg = {
            research: false,
            text: content,
            ...(image_urls && { image_urls: image_urls }),
            ...(uploadedFiles.length > 0 && { research: true })
        }
        sendMessage(msg)
        setContent('')
        setUploadedFiles([])
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.shiftKey) {
            // Allow newline
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit()
        }


    }
    const hasValue = useMemo(() => uploadedFiles.length > 0 || content !== '', [content, uploadedFiles])
    return (
        <div className={`chat-box ${!content && uploadedFiles.length > 0 ? 'has-image' : ''}`} ref={containerRef}  >
            <div className="textfield" ref={textfieldContainerRef} style={{
                marginTop: hasValue ? "12px" : '0',
            }}>
                <FilePreviews uploadedFiles={uploadedFiles} setUploadedFiles={setUploadedFiles} pct={pct} />
                <textarea placeholder='Enter something here' onChange={handleChangeText} ref={textareaRef} value={content} style={{
                    height: content ? "auto" : "24px",
                }} onKeyDown={handleKeyDown} />
            </div>
            <div className="chat-box__actions">
                <UploadFile setUploadedFiles={setUploadedFiles} uploadedFiles={uploadedFiles} setPct={setPct} />
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