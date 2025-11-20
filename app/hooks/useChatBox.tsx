import { useMemo, useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { useWebSocket } from '~/providers/WSProdivder'
import type { IUploadFile } from '~/types/models'


export default function useChatBox() {
    const { isPending } = useWebSocket()
    const { sendMessage } = useWebSocket()
    const [content, setContent] = useState('')
    const [uploadedFiles, setUploadedFiles] = useState<IUploadFile[]>([])
    const [pct, setPct] = useState(0)
    const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isPending) {
            setContent(e.target.value)
        }
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
    const handleDeleteUploadedImage = async (f: IUploadFile) => {
        setUploadedFiles(prev => prev.filter(i => i.id !== f.id))
    }
    const handleSubmit = () => {
        if (!uploadedFiles && !content) return
        const image_urls = uploadedFiles.filter(i => i.file.type.includes("image")).map(i => i.url)
        const msg = {
            text: content,
            ...(image_urls && { image_urls: image_urls }),
            ...(uploadedFiles.length > 0 && { research: true })
        }
        sendMessage(msg)
        setContent('')
        setUploadedFiles([])
    }
    const hasValue = useMemo(() => uploadedFiles.length > 0 || content !== '', [content, uploadedFiles])

    return {
        handleChangeText,
        handleSubmit,
        handleDeleteUploadedImage,
        setUploadedFiles,
        content,
        uploadedFiles,
        pct,
        hasValue,
        setPct, handleKeyDown
    }
}