import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useWebSocketStore } from '~/stores/websocketStore';
import { useAppContext } from './AppContextProvider';
import { MessageType, SENDER } from '~/types/enums';
import type { ChatMessage, IUploadFile, MessageData, MessageRequest } from '~/types/models';
import { generateMessageId } from '~/utils/helper';
import IdentityType from '~/components/IdentityType/IdentityType';
import { fetchHistory } from '~/services/appApis';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import useAppStore from '~/stores/appStore';
import { function_ } from 'valibot';
import { envConfig } from '~/utils/envConfig';
import { getToken } from '~/services/tokenManager';



interface WebSocketContextValue {
    sendMessage: (data: MessageData) => void;
    getConversation: () => void;
    isWSPending: boolean;
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {

    const [isConnected, setIsConnected] = useState(false)
    const wsRef = useRef<WebSocket | null>(null)
    const shouldReconnectRef = useRef(true);
    const { messages, addUserMessage, addAssistantMessageFromLastMessage, setMessages } = useWebSocketStore();
    const [fetchedHistory, setFetchedHistory] = useState(false)
    const { userId } = useAppContext()
    const [isPending, setIsPending] = useState(true)
    const [hasIdentity, setHasIdentity] = useState(false)
    const setOffset = useAppStore(s => s.setOffset)

    const connect = useCallback((initial: boolean = false) => {
        const wsState = wsRef.current?.readyState
        if (wsState === WebSocket.OPEN || wsState === WebSocket.CONNECTING) {
            return
        }

        const ws = new WebSocket(envConfig.WS_URL + "?user_id=" + userId)
        wsRef.current = ws;
        ws.onopen = async () => {
            setIsConnected(true)
            console.warn("[WS] connected");
            if (initial) {
                const token = await getToken();
                const initMsg = {
                    type: MessageType.USER_MESSAGE,
                    message_id: generateMessageId(),
                    text: "___ HELLO ___",
                    research: false,
                    token,
                }
                ws.send(
                    JSON.stringify(initMsg)
                );
            }
        };

        let retryTimer: NodeJS.Timeout;
        ws.onclose = (e) => {
            console.warn(`🔴 WS closed (code=${e.code})`);
            if (shouldReconnectRef.current && e.code !== 1000) {
                setIsConnected(false);
                retryTimer = setTimeout(() => {
                    connect();
                }, 1000);
            }
        };
        ws.onmessage = (event: MessageEvent) => {
            try {
                const newMessage = JSON.parse(event.data)
                if (newMessage.type === MessageType.ASSISTANT_DONE) {
                    setIsPending(false)
                }
                addAssistantMessageFromLastMessage(newMessage)
            } catch {
                console.error("Invalid WS message", event);
            }

        };

        ws.onerror = (error) => {
            const closeEvent = error as CloseEvent;
            const code = closeEvent.code || "UNKNOWN";
            const reason = closeEvent?.reason || "unknown reason";
            console.warn(`WebSocket error (code ${code}) reason: ${reason}), will retry`);
            setIsConnected(false);
            ws.close();
        };
        return () => {
            clearTimeout(retryTimer);
            ws.close(1000, "cleanup");
        }
    }, [userId])


    const send = async (payload: MessageRequest) => {
        try {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                const token = await getToken();
                wsRef.current.send(JSON.stringify({ ...payload, token }));
            } else {
                console.error("Socket not open when sending message");
            }

        } catch (err) {
            console.error(`Send failed: ${typeof err === "object" && err !== null && "message" in err
                ? (err as { message?: string }).message
                : String(err)
                }`);
        }
    }

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
                setMessages([...reversedMessages, ...messages])
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
        if (!userId || !fetchedHistory || !hasIdentity) return
        shouldReconnectRef.current = true;
        setIsPending(false)
        let cleanUp = connect(messages.length === 0);
        return () => {
            shouldReconnectRef.current = false;
            cleanUp?.();
        };
    }, [connect, userId, fetchedHistory, hasIdentity]);


    const handleContinue = () => {
        setHasIdentity(true)
    }


    const sendMessage = (data: MessageData) => {
        setIsPending(true)

        const message_id = generateMessageId()
        // new message
        const userMsg = {
            role: SENDER.USER,
            content: data.text,
            message_id,
            created_at: new Date(),
        }
        if (!data.message_id) { addUserMessage(userMsg) }
        else {
            // When editing a specific message
            const filtered = messages.filter(msg => msg.message_id !== data.message_id)
            setMessages([...filtered, userMsg])
        }


        // send message to server
        const newMsg = {
            ...data,
            message_id,
            type: MessageType.USER_MESSAGE,
        }
        send(newMsg)
    }
    const value: WebSocketContextValue = {
        sendMessage,
        isWSPending: isPending,
        isConnected,
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
