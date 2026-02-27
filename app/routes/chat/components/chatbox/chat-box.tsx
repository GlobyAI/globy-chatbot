
import ArrowUpIcon from '/icons/arrow-up.svg'
import ArrowUpWhiteIcon from '/icons/arrow-up-white.svg'
import useResizeTextarea from '~/hooks/useResizeTextarea'
import UploadFile from './upload-file'
import FilePreviews from './file-previews'
import useScrollChatBox from '~/hooks/useScrollChatBox'
import { useRef } from 'react'
import useUploadFiles from '~/hooks/useUploadFiles'
import useTextField from '~/hooks/useTextField'
import { useChatBoxContext } from '~/providers/ChatboxProvider'


export default function ChatBox() {

    const { isAnalyzing } = useChatBoxContext()
    const { uploadedFiles, pct, setVectorId, handleDeleteUploadedImage, onUploadFile, handleCleanUploadFilesState } = useUploadFiles()
    const { content, handleKeyDown, handleChangeText, handleSubmit } = useTextField({
        uploadedFiles: uploadedFiles,
        handleCleanUploadFilesState: handleCleanUploadFilesState
    }
    )
    const { textfieldContainerRef } = useScrollChatBox()
    const { textareaRef, containerRef, } = useResizeTextarea({ value: content, hasImage: uploadedFiles.length > 0, uploadedFiles })

    const ableToSend = content.trim().length > 0 || uploadedFiles.length > 0
    return (
        <label id="input" className={`chat-box ${!isAnalyzing && uploadedFiles.length > 0 ? 'has-image' : ''} ${!isAnalyzing && content ? "has-text" : ''}`} ref={containerRef}  >
            <div className="textfield" ref={textfieldContainerRef} >
                <FilePreviews pct={pct} uploadedFiles={uploadedFiles} handleDeleteUploadedImage={handleDeleteUploadedImage} />
                <textarea id="input" placeholder='Enter something here' onChange={handleChangeText} ref={textareaRef} value={content} onKeyDown={handleKeyDown} />
            </div>
            <div className="chat-box__actions">
                <UploadFile onUploadFile={onUploadFile} setVectorId={setVectorId} />
                <span className="icons icons--send">
                    {
                        !isAnalyzing && ableToSend ?
                            <img src={ArrowUpWhiteIcon} alt="ArrowUpWhiteIcon" onClick={handleSubmit} />
                            :
                            <img src={ArrowUpIcon} alt="ArrowUpIcon" />
                    }
                </span>

            </div>
        </label >
    )
}