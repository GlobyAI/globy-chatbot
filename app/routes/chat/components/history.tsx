import { useEffect, useRef, } from 'react'
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
        scrollToBottom();

    }, [messages])
    return (
        <div className="chat" >
            <ul className="chat__history" >
                {
                    messages.length > 0 && messages.map(msg => {
                        const isUser = msg.role as SENDER === SENDER.USER
                        return (
                            <li key={msg.message_id + msg.role} className={`message ${isUser ? "message--user" : 'markdown-body'}`}>
                                {
                                    !isUser &&
                                    <div className="message__logo">
                                        <img src="/images/globy_symbol.png" alt="Globy avatar" />
                                        Globy.ai
                                    </div>
                                }
                                <div className="message__content " >
                                    {
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    }
                                </div>
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