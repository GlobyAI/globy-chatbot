import { useEffect, useRef, useState, type ChangeEvent, } from 'react'
import TypingIndicator from '~/components/ui/TypingIndicator/TypingIndicator'
import { useWebSocket } from '~/providers/WSProdivder'
import { SENDER } from '~/types/enums'
import EditIcon from '/icons/edit.svg'
import ReactMarkdown from "react-markdown";
import useResizeTextarea from '~/hooks/useResizeTextarea'
import type { ChatMessage } from '~/types/models'
import { useChatBoxContext } from '~/providers/ChatboxProvider'
import FileIcon from '/icons/file-upload.svg'

export default function History() {
    const { messages, isPending, sendMessage } = useWebSocket()
    const [editingMsg, setEditingMsg] = useState<{
        id: string,
        content: string
    } | null>(null)
    const { isAnalyzing } = useChatBoxContext()
    const { textareaRef, containerRef, } = useResizeTextarea({ value: editingMsg?.content, })

    const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (!isPending && editingMsg) {
            setEditingMsg({
                id: editingMsg.id,
                content: e.target.value
            }
            )
        }
    }
    const handleCancelEdit = () => {
        setEditingMsg(null)
    }
    const handleEnableMsgEdit = (msg: ChatMessage) => {
        if (!isPending) {
            setEditingMsg({
                id: msg.message_id,
                content: msg.content
            }
            )
        }
    }

    const handleSendEditedMessage = () => {
        if (!isPending && editingMsg?.content) {
            sendMessage({
                text: editingMsg?.content,
                message_id: editingMsg.id

            })
            handleCancelEdit()

        }

    }
    const targetRef = useRef<HTMLLIElement | null>(null); // Reference for auto-scroll
    const chatRef = useRef<HTMLUListElement | null>(null); // Reference for auto-scroll
    const scrollToBottom = () => {
        if (targetRef.current) {
            targetRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(() => {
        if (isPending || isAnalyzing || messages.length > 0) {
            scrollToBottom();

        }
    }, [messages, isAnalyzing, isPending]);
    console.log(messages)
    return (
        <div className="chat" >
            <ul className="chat__history" ref={chatRef}>
                {
                    messages.length > 0 && messages.map((msg, idx) => {
                        const isUser = msg.role as SENDER === SENDER.USER
                        if (editingMsg && editingMsg.id === msg.message_id && isUser)
                            return (
                                <label ref={containerRef} key={msg.message_id + idx} className={`message editing message--user`}>
                                    <textarea ref={textareaRef} onChange={handleChangeText} className='editing__textarea' value={editingMsg.content} />
                                    <div className="editing__actions">
                                        <button onClick={handleCancelEdit}>Cancel</button>
                                        <button onClick={handleSendEditedMessage}>Send</button>
                                    </div>
                                </label>
                            )
                        return (
                            <li key={msg.message_id + idx} className={`message ${isUser ? "message--user" : 'markdown-body'}`}>
                                {
                                    !isUser &&
                                    <div className="message__logo">
                                        <img src="/images/globy_symbol.png" alt="Globy avatar" />
                                        globy
                                    </div>
                                }
                                <div className="message__content " >
                                    {
                                        msg.uploadedFiles && msg.uploadedFiles.length > 0 &&
                                        <div className="images-container">
                                            {
                                                msg.uploadedFiles.map((f, idx) => {
                                                    const isImage = f.file.type?.startsWith('image')
                                                    return (
                                                        <figure key={idx} className={`selected-img ${isImage ? '' : 'is-file'}`}>
                                                            {
                                                                isImage ?
                                                                    <img src={f.url} key={idx} className='image' />
                                                                    :
                                                                    <>
                                                                        <img src={FileIcon} key={idx} className='file' />
                                                                        <figcaption>
                                                                            <p>{f.file.name}</p>
                                                                            <p>{f.file.type.split("/")[1]?.toUpperCase()}</p>
                                                                        </figcaption>
                                                                    </>
                                                            }
                                                        </figure>
                                                    )
                                                })
                                            }
                                        </div>
                                    }
                                    {
                                        <ReactMarkdown >{msg.content}</ReactMarkdown>
                                    }

                                </div>
                                {
                                    isUser &&
                                    <img src={EditIcon} className='edit-icon' onClick={() => handleEnableMsgEdit(msg)} />
                                }
                            </li>
                        )
                    })
                }
                <li>
                    {
                        isAnalyzing && <div className='thinking'><p className='txt '>Analyzing...</p></div>
                    }
                    {
                        !isAnalyzing && isPending && <TypingIndicator />
                    }

                </li>
                <li className='target' ref={targetRef}></li>
            </ul>
        </div>
    )
}