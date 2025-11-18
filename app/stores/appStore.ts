import { create } from "zustand";

interface AppStoreState {
  isLoading: boolean;
  offset: number;
  setOffset: (next: number) => void;
  setLoading: (value: boolean) => void;
}

const useAppStore = create<AppStoreState>((set, get) => ({
  isLoading: false,
  offset: 0,
  setOffset: (next: number) => set({ offset: next }),
  setLoading: (value) =>
    set({
      isLoading: value,
    }),
}));

export default useAppStore;
