// webSocketStore.ts
import { create } from "zustand";
import { MessageType } from "~/types/enums";
import type {
  MessageRequest,
  MessageResponse,
} from "~/types/models";
import { envConfig } from "~/utils/envConfig";
import { generateMessageId } from "~/utils/helper";

interface WebSocketState {
  socket: WebSocket | null;
  isConnected: boolean;
  connect: (userId: string) => void;
  disconnect: () => void;
  lastMessage: MessageResponse | null;
  send: (data: MessageRequest) => void;
}

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
  socket: null,
  isConnected: false,
  lastMessage: null,
  connect: (userId: string) => {
    if (!userId) return;
    const existing = get().socket;
    if (existing && existing.readyState === WebSocket.OPEN) return;

    const socket = new WebSocket(envConfig.WS_URL + "?user_id=" + userId);

    socket.onopen = () => {
      set({ isConnected: true });
      const initMsg = {
        type: MessageType.USER_MESSAGE,
        message_id: generateMessageId(),
        text:"___ HELLO ___",
        research: true,
      };
      socket.send(JSON.stringify(initMsg));
      console.log("[WS] connected");
    };

    socket.onclose = () => {
      set({ isConnected: false, socket: null });
      console.log("[WS] isconnected");
    };
    socket.onmessage = (event: MessageEvent) => {
      set({ lastMessage: JSON.parse(event.data) });
    };

    socket.onerror = (err) => {
      console.error("[WS] error", err);
    };

    // NOTE: we do NOT handle messages here; we’ll do it in Context.
    // socket.onmessage will be attached in the provider.

    set({ socket });
  },

  disconnect: () => {
    const socket = get().socket;
    if (socket) {
      socket.close();
      set({ socket: null, isConnected: false });
    }
  },

  send: (payload: MessageRequest) => {
    const socket = get().socket;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("[WS] cannot send, not connected");
      return;
    }

    socket.send(JSON.stringify(payload));
  },
}));
