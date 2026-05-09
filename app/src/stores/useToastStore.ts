import { create } from 'zustand';

interface ToastState {
  message: string | null;
  id: number;
  showToast: (message: string) => void;
  dismiss: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  id: 0,
  showToast: (message) =>
    set((s) => ({ message, id: s.id + 1 })),
  dismiss: () => set({ message: null }),
}));
