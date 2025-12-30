import { useState, type ChangeEvent, type KeyboardEvent } from 'react'
import { useChatBoxContext } from '~/providers/ChatboxProvider'
import { useWebSocket } from '~/providers/WSProdivder'
import type { IUploadFile } from '~/types/models'


export default function useTextField({ uploadedFiles, handleCleanUploadFilesState }: { uploadedFiles: IUploadFile[],
    handleCleanUploadFilesState: () => void
 }) {
    const { isPending } = useWebSocket()
    const { sendMessage } = useWebSocket()
    const [content, setContent] = useState('')
    const { vectorId } = useChatBoxContext()

    const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isPending) {
            setContent(e.target.value)
        }
    }
    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();

            const target = e.currentTarget;
            const { selectionStart, selectionEnd, value } = target;

            const newValue =
                value.slice(0, selectionStart) + "\n" + value.slice(selectionEnd);

            setContent(newValue);
            requestAnimationFrame(() => {
                target.selectionStart = target.selectionEnd = selectionStart + 1;
                target.scrollTop = target.scrollHeight;

            });
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            handleSubmit()
            return
        }
    }

    const handleSubmit = () => {
        if (!content && !uploadedFiles) return
        let text = content.trim()
        // const image_urls = uploadedFiles.filter(i => i.file.type.includes("image")).map(i => i.url)
        // let filesDom = ''
        // if (uploadedFiles.length > 0) {
        //     filesDom = `
        //     <div>
        //         ${uploadedFiles.map(f => {
        //         const isImage = f.file.type?.startsWith('image')
        //         return (
        //             `<figure class='selected-img ${isImage ? '' : 'is-file'}'>
        //                            ${isImage ?
        //                 `<img src={${f.url}} class='image' />`
        //                 :
        //                 `<img src={FileIcon} class='file' />
        //                                         <figcaption>
        //                                             <p>${f.file.name}</p>
        //                                             <p>${f.file.type.split("/")[1]?.toUpperCase()}</p>
        //                                         </figcaption>
        //                                     `
        //             }
        //                         </figure>`
        //         )
        //     }).join('')}
        //     </div >
        // `

        // }

        if (!content && uploadedFiles.length > 0) {
            text = 'Analyze files'
        }
        const msg = {
            text,
            // ...(image_urls && { image_urls: image_urls }),
            ...(vectorId && { id: vectorId }),
        }
        sendMessage(msg)
        handleCleanUploadFilesState()
        setContent('')
    }

    return {
        handleChangeText,
        handleSubmit,
        content,
        handleKeyDown
    }
}