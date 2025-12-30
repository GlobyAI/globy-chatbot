import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import { useWebSocketStore } from '~/stores/websocketStore';
import { useAppContext } from './AppContextProvider';
import { MessageType, SENDER } from '~/types/enums';
import type { ChatMessage, IUploadFile, MessageData } from '~/types/models';
import { generateMessageId } from '~/utils/helper';
import IdentityType from '~/components/IdentityType/IdentityType';
import { fetchHistory } from '~/services/appApis';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import useAppStore from '~/stores/appStore';



interface WebSocketContextValue {
    messages: ChatMessage[];
    sendMessage: (data: MessageData) => void;
    clearMessages: () => void;
    getConversation: () => void;
    isPending: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { connect, send, lastMessage } = useWebSocketStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [fetchedHistory, setFetchedHistory] = useState(false)
    const { userId } = useAppContext()
    const [isPending, setIsPending] = useState(true)
    const [hasIdentity, setHasIdentity] = useState(false)
    const setOffset = useAppStore(s => s.setOffset)

    async function getConversation() {
        if (!userId) return
        const offset = useAppStore.getState().offset
        if (offset < 0) return
        try {
            const res = await fetchHistory(userId, offset)
            const pagination = res.data.pagination
            const oldMessages: ChatMessage[] = res.data.messages
            if (oldMessages) {
                const reversedMessages = oldMessages.reverse()
                setMessages(prev => [...reversedMessages, ...prev])
            }
            const next = pagination.next_offset
            setOffset(next ?? -1)

        } catch (error) {
            if (error instanceof AxiosError && error.response?.status !== 404) {
                toast.error(error.message)
            }
        } finally {
            setFetchedHistory(true)
        }

    }
    useEffect(() => {

        if (userId) {
            getConversation()
        }
    }, [userId])
    useEffect(() => {
        if (userId && fetchedHistory && hasIdentity) {
            setIsPending(false)
            if (!messages.length) {
                const initMsg = {
                    type: MessageType.USER_MESSAGE,
                    message_id: generateMessageId(),
                    text: "___ HELLO ___",
                    research: false,
                };
                connect(userId, initMsg);
            } else {
                connect(userId);
            }

        }
    }, [connect, userId, messages, fetchedHistory, hasIdentity]);


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
    const escapePipe = (s = "") => String(s).replaceAll("|", "\\|"); // tránh phá format

    const buildAttachmentsMarkdown = (uploadedFiles: IUploadFile[]) => {
        // Mỗi attachment là 1 markdown node (image hoặc link)
        // Tất cả để liền nhau trong 1 paragraph => dễ wrap thành <div class="uploaded-files">
        return uploadedFiles
            .map((f) => {
                const name = f?.file?.name || "Unnamed";
                const mime = f?.file?.type || "";
                const isImage = mime.startsWith("image/");
                const ext = mime.split("/")[1]?.toUpperCase() || "FILE";
                const url = f?.url || "";

                if (isImage) {
                    // alt chứa metadata
                    return `![attach|image|${escapePipe(name)}|${escapePipe(mime)}](${url})`;
                }

                // link text chứa metadata
                return `[attach|file|${escapePipe(name)}|${escapePipe(ext)}](${url})`;
            })
            .join("\n"); // xuống dòng nhưng vẫn là 1 paragraph nếu không có dòng trống
    };

    const clearMessages = () => setMessages([]);

    const sendMessage = (data: MessageData) => {
        setIsPending(true)

        const message_id = generateMessageId()

        setMessages(prev => {
            const newMsg = {
                role: SENDER.USER,
                content: data.text,
                message_id,
                created_at: new Date(),
            }
            if (!data.message_id) return [...prev, newMsg]

            const filtered = prev.filter(msg => msg.message_id !== data.message_id)
            return [...filtered, newMsg]

        })
        const newMsg = {
            ...data,
            message_id,
            type: MessageType.USER_MESSAGE,

        }
        send(newMsg)
    }
    const value: WebSocketContextValue = {
        messages,
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
