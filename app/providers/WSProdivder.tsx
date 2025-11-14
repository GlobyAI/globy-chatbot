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
import toast from 'react-hot-toast';
import { generateMessageId } from '~/utils/helper';



interface WebSocketContextValue {
    messages: ChatMessage[];
    isConnected: boolean;
    sendMessage: (data: MessageData) => void;
    clearMessages: () => void;
    isPending: boolean
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { socket, connect, isConnected, send } = useWebSocketStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const { userId } = useAppContext()
    const [isPending, setIsPending] = useState(false)
    // Connect once when the provider mounts
    useEffect(() => {
        if (userId) {
            setIsPending(true)
            connect(userId);

        }
    }, [connect, userId]);

    // Attach message handler whenever socket changes
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event: MessageEvent) => {
            let data: MessageResponse = event.data;
            try {
                data = JSON.parse(event.data);
                if (data.type === MessageType.ASSISTANT_DElTA) {
                    setMessages((prev) => {
                        const lastMsg = prev.find(msg => msg.message_id === data.message_id && msg.sender === SENDER.GLOBY)
                        if (!lastMsg) {
                            const newMessage: ChatMessage = {
                                message_id: data.message_id,
                                content: data.delta,
                                sender: SENDER.GLOBY

                            };
                            return [...prev, newMessage]
                        }
                        return prev.map(msg => msg.message_id === data.message_id && msg.sender === SENDER.GLOBY ? {
                            ...msg,
                            content: msg.content.concat(data.delta)
                        } : msg)
                    });
                } else {
                    setIsPending(false)

                }
            } catch (e) {
                toast.error(e as string)
            }


        };

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket, messages]);

    const clearMessages = () => setMessages([]);

    const sendMessage = (data: MessageData) => {
        setIsPending(true)
        const message_id = generateMessageId()
        setMessages(prev => [...prev, {
            sender: SENDER.USER,
            content: data.text ? data.text : data.image_urls?.join("\n") || '',
            message_id
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
        clearMessages, isPending
    };

    return (
        <WebSocketContext.Provider value={value}>
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
