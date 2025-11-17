import { create } from "zustand";

interface AppStoreState {
  isLoading: boolean;
  offset: number;
  setOffset: (next: number) => void;
}

const useAppStore = create<AppStoreState>((set, get) => ({
  isLoading: false,
  offset: 0,
  setOffset: (next: number) => set({ offset: next }),
}));

export default useAppStore;
