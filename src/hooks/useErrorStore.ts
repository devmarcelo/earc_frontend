import { create } from "zustand";

export interface ErrorData {
  status?: number;
  title?: string;
  message?: string;
  from?: string;
  actionHref?: string;
  actionText?: string;
}

interface ErrorStore {
  error: ErrorData | null;
  setError: (error: ErrorData) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorStore>((set) => ({
  error: null,
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));
