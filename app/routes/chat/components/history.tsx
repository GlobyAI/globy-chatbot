import  { useEffect, useRef } from 'react'
import TypingIndicator from '~/components/ui/TypingIndicator/TypingIndicator'
import { useWebSocket } from '~/providers/WSProdivder'
import { SENDER } from '~/types/enums'
import ReactMarkdown from "react-markdown";

export default function History() {
    const { messages, isPending } = useWebSocket()

    const targetRef = useRef<HTMLLIElement | null>(null); // Reference for auto-scroll
    const scrollToBottom = () => {
        if (targetRef.current) {
            targetRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }

    useEffect(() => {
        if (messages.length > 0 && !isPending) {
            scrollToBottom()
        }
    }, [messages])
    return (
        <div className="chat">
            <ul className="chat__history">
                {
                    messages.length > 0 && messages.map(msg => {
                        const isUser = msg.sender === SENDER.USER
                        return (
                            <li key={msg.message_id+msg.sender} className={`message  markdown-body ${isUser ? "message--user" : ''}`}>
                                {
                                    !isUser &&
                                    <div className="message__logo">
                                        <img src="/images/globy_symbol.png" alt="Globy avatar" />
                                        Globy.ai
                                    </div>
                                }
                                <p className="message__content " >
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </p>
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