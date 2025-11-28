import { useEffect, useLayoutEffect, useRef } from 'react';
import { useAppContext } from '~/providers/AppContextProvider';
import { useWebSocket } from '~/providers/WSProdivder';

export default function useLoadMoreHistory() {
    const { messages } = useWebSocket()
    const { userId } = useAppContext();
    const { getConversation } = useWebSocket();

    // The scroll container (chat list)
    const containerRef = useRef<HTMLDivElement>(null);

    // Flag to know when we are currently loading more messages
    const isLoadingMoreRef = useRef(false);

    // Store previous scrollHeight before loading
    const prevScrollHeightRef = useRef(0);

    // Attach scroll listener
    useEffect(() => {
        if (!userId) return;

        const el = containerRef.current;
        if (!el) return;

        const handleScroll = () => {
            const container = containerRef.current;
            if (!container) return;

            // Prevent multiple load-more calls while one is already in progress
            if (isLoadingMoreRef.current) return;

            // When user reaches the top, load older messages
            if (container.scrollTop === 0) {
                isLoadingMoreRef.current = true;
                prevScrollHeightRef.current = container.scrollHeight;

                // Trigger fetch of older messages
                // getConversation should append older messages at the TOP
                getConversation();
            }
        };

        el.addEventListener('scroll', handleScroll);

        return () => {
            el.removeEventListener('scroll', handleScroll);
        };
    }, [userId, getConversation]);

    // After messagesLength changes (new messages rendered), restore scroll position
    useLayoutEffect(() => {
        // Only run this after a "load more" action, not on every messages change
        if (!isLoadingMoreRef.current) return;

        const container = containerRef.current;
        if (!container) return;

        const newScrollHeight = container.scrollHeight;
        const diff = newScrollHeight - prevScrollHeightRef.current;

        // Keep viewport anchored to the same place in the list
        container.scrollTop = diff;

        // Reset flag
        isLoadingMoreRef.current = false;
    }, [messages]);

    return { containerRef };
}
