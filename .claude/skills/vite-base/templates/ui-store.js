// src/store/useUiStore.js
// Só estado de interface. Dado de API é TanStack Query; sessão é AuthContext.
import { create } from "zustand";

export const useUiStore = create((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
}));
