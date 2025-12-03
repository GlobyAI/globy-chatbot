import { useEffect, useRef, useState, type ChangeEvent, } from 'react'
import TypingIndicator from '~/components/ui/TypingIndicator/TypingIndicator'
import { useWebSocket } from '~/providers/WSProdivder'
import { SENDER } from '~/types/enums'
import EditIcon from '/icons/edit.svg'
import ReactMarkdown from "react-markdown";
import useResizeTextarea from '~/hooks/useResizeTextarea'
import type { ChatMessage } from '~/types/models'

export default function History() {
    const { messages, isPending, sendMessage } = useWebSocket()
    const [editingMsg, setEditingMsg] = useState<{
        id: string,
        content: string
    } | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const containerRef = useRef<HTMLLabelElement | null>(null)
    useResizeTextarea({ value: editingMsg?.content, textareaRef, containerRef })

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
        if(!isPending) return
        scrollToBottom();
    }, [messages])
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
                                        Globy
                                    </div>
                                }
                                <div className="message__content " >
                                    {
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
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
                <li className='target' ref={targetRef}></li>
            </ul>
            {
                isPending && <TypingIndicator />
            }
        </div>
    )
}