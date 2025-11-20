
import ArrowUpIcon from '/icons/arrow-up.svg'
import ArrowUpWhiteIcon from '/icons/arrow-up-white.svg'
import useResizeTextarea from '~/hooks/useResizeTextarea'
import UploadFile from './upload-file'
import FilePreviews from './file-previews'
import useScrollChatBox from '~/hooks/useScrollChatBox'
import useChatBox from '~/hooks/useChatbox'
import { useRef } from 'react'

type Props = {}

export default function ChatBox({ }: Props) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const containerRef = useRef<HTMLLabelElement | null>(null)
    const textfieldContainerRef = useRef<HTMLDivElement | null>(null)

    const { content, pct, handleKeyDown, setPct, hasValue, setUploadedFiles, uploadedFiles, handleDeleteUploadedImage, handleChangeText, handleSubmit } = useChatBox()
    useScrollChatBox({ textfieldContainerRef })
    useResizeTextarea({ value: content, textareaRef, containerRef, hasImage: uploadedFiles.length > 0 })


    return (
        <label id="input" className={`chat-box ${!content && uploadedFiles.length > 0 ? 'has-image' : ''}`} ref={containerRef}  >
            <div className="textfield" ref={textfieldContainerRef} >
                <FilePreviews uploadedFiles={uploadedFiles} handleDeleteUploadedImage={handleDeleteUploadedImage} pct={pct} />
                <textarea id="input" placeholder='Enter something here' onChange={handleChangeText} ref={textareaRef} value={content} onKeyDown={handleKeyDown} />
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
        </label >
    )
}