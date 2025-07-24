// src/hooks/useToastStore.ts
import { create } from "zustand";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastMessage {
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms
  actionText?: string;
  onAction?: () => void;
  id?: string | number;
}

interface ToastStore {
  messages: ToastMessage[];
  showToast: (toast: ToastMessage) => void;
  clearToast: (id?: string | number) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  messages: [],
  showToast: (toast) =>
    set((state) => ({
      messages: [...state.messages, { ...toast, id: Date.now() }],
    })),
  clearToast: (id) =>
    set((state) =>
      id
        ? { messages: state.messages.filter((t) => t.id !== id) }
        : { messages: [] },
    ),
  clearAll: () => set({ messages: [] }),
}));
