import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useWebSocketStore } from '~/stores/websocketStore';
import { useAppContext } from './AppContextProvider';
import { MessageType, SENDER } from '~/types/enums';
import type { ChatMessage, MessageData, MessageResponse } from '~/types/models';
import { generateMessageId } from '~/utils/helper';
import IdentityType from '~/components/IdentityType/IdentityType';
import { fetchHistory } from '~/services/appApis';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';



interface WebSocketContextValue {
    messages: ChatMessage[];
    isConnected: boolean;
    sendMessage: (data: MessageData) => void;
    clearMessages: () => void;
    getConversation: () => void;
    isPending: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { connect, isConnected, send, lastMessage } = useWebSocketStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [fetchedHistory, setFetchedHistory] = useState(false)
    const { userId } = useAppContext()
    const [isPending, setIsPending] = useState(false)
    const [hasIdentity, setHasIdentity] = useState(false)
    const [nextOffset, setNextOffset] = useState<number>(0)
    const [currentOffset, setCurrentOffset] = useState(-1)
    async function getConversation() {
        if (!userId) return
        try {
            setFetchedHistory(true)
            if (nextOffset <= currentOffset) return
            const res = await fetchHistory(userId, nextOffset)
            const pagination = res.data.pagination
            const oldMessages: ChatMessage[] = res.data.messages
            if (oldMessages) {
                const reversedMessages= oldMessages.reverse()
                setMessages(prev => [...reversedMessages, ...prev])
            }
            setCurrentOffset(nextOffset)
            const next = pagination.next_offset
            if (next) {
                setNextOffset(pagination.next_offset)
            }

        } catch (error) {
            if (error instanceof AxiosError && error.response?.status !== 404) {
                toast.error(error.message)
            }
        }

    }
    useEffect(() => {

        if (userId) {
            setIsPending(true)
            getConversation()
        }
    }, [userId])
    useEffect(() => {
        if (userId && fetchedHistory && hasIdentity) {
            connect(userId);

        }
    }, [connect, userId, fetchedHistory, hasIdentity]);


    const handleContinue = () => {
        setHasIdentity(true)
    }
    // Attach message handler whenever socket changes
    useEffect(() => {
        if (!lastMessage) return;
        if (lastMessage.type === MessageType.ASSISTANT_DONE) {
            setIsPending(false)

        }
        if (lastMessage.type === MessageType.ASSISTANT_DElTA) {
            const lastMsg = messages.find(msg => msg.message_id === lastMessage.message_id && msg.role === SENDER.ASSISTANT)
            if (!lastMsg) {
                setMessages((prev) => {
                    const newMessage: ChatMessage = {
                        message_id: lastMessage.message_id,
                        content: lastMessage.delta,
                        role: SENDER.ASSISTANT,
                        created_at: new Date()
                    };
                    return [...prev, newMessage]

                });
            } else {
                setMessages(prev => {
                    return prev.map(msg => msg.message_id === lastMessage.message_id && msg.role === SENDER.ASSISTANT ? {
                        ...msg,
                        content: msg.content.concat(lastMessage.delta)
                    } : msg)
                })
            }


        }




    }, [lastMessage]);

    const clearMessages = () => setMessages([]);

    const sendMessage = (data: MessageData) => {
        setIsPending(true)
        const message_id = generateMessageId()
        setMessages(prev => [...prev, {
            role: SENDER.USER,
            content: data.text ? data.text : data.image_urls?.join("\n") || '',
            message_id,
            created_at: new Date(),
        }])
        const newMsg = {
            ...data,
            message_id,
            type: MessageType.USER_MESSAGE
        }
        send(newMsg)
    }
    const value: WebSocketContextValue = {
        messages,
        isConnected,
        sendMessage,
        clearMessages, isPending,
        getConversation,
    };

    return (
        <WebSocketContext.Provider value={value}>
            <IdentityType hasIdentity={hasIdentity} onContinue={handleContinue} />
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    const ctx = useContext(WebSocketContext);
    if (!ctx) {
        throw new Error('useWebSocket must be used within WebSocketProvider');
    }
    return ctx;
};
