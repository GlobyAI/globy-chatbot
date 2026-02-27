// webSocketStore.ts
import { create } from "zustand";
import { MessageType, SENDER } from "~/types/enums";
import type {
  ChatMessage,
  MessageRequest,
  MessageResponse,
} from "~/types/models";

interface WebSocketState {
  messages: ChatMessage[];
  setMessages: (msgs: ChatMessage[]) => void;
  addUserMessage: (newMessage: ChatMessage) => void;
  addAssistantMessageFromLastMessage: (lmg: MessageResponse) => void;
  lastMessage: MessageResponse | null;
}

export const useWebSocketStore = create<WebSocketState>((set) => ({
  messages: [],
  lastMessage: null,
  addUserMessage: (newMessage: ChatMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
  setMessages: (msgs: ChatMessage[]) =>
    set((state) => ({
      messages: msgs,
    })),
  addAssistantMessageFromLastMessage: (lmg: MessageResponse) => {
    set({
      lastMessage: lmg,
    });
    if (lmg.type !== MessageType.ASSISTANT_DElTA) return;
    set((state) => {
      const idx = state.messages.findIndex(
        (m) => m.message_id === lmg.message_id && m.role === SENDER.ASSISTANT
      );

      if (idx === -1) {
        const msg: ChatMessage = {
          message_id: lmg.message_id,
          content: lmg.delta ?? "",
          role: SENDER.ASSISTANT,
          created_at: new Date(),
        };
        return { messages: [...state.messages, msg] };
      }

      const next = state.messages.slice();
      const cur = next[idx];
      next[idx] = { ...cur, content: (cur.content ?? "") + (lmg.delta ?? "") };

      return { messages: next };
    });
  },
}));
