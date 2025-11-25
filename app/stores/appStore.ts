import { create } from "zustand";

interface AppStoreState {
  isLoading: boolean;
  offset: number;
  hasNews: boolean;  
  setHasNews: (value: boolean) => void;
  setOffset: (next: number) => void;
  setLoading: (value: boolean) => void;
}

const useAppStore = create<AppStoreState>((set, get) => ({
  isLoading: false,
  offset: 0,
  hasNews: false,

  setOffset: (next: number) => set({ offset: next }),
  setHasNews: (value: boolean) => set({ hasNews: value }),
  setLoading: (value) =>
    set({
      isLoading: value,
    }),
}));

export default useAppStore;
