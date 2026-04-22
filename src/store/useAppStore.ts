import { create } from 'zustand'
import type { Call, ChatMessage, ToastItem } from '../types'
import { initialChatMessages } from '../data/mockData'

interface AppState {
  isAuthenticated: boolean
  activeNav: string
  chatMessages: ChatMessage[]
  calls: Call[]
  toasts: ToastItem[]

  login: () => void
  logout: () => void
  setActiveNav: (nav: string) => void
  setCalls: (calls: Call[]) => void
  updateCall: (id: number, updates: Partial<Call>) => void
  prependCall: (call: Call) => void
  addChatMessage: (msg: ChatMessage) => void
  removeTyping: () => void
  addToast: (message: string, type?: ToastItem['type']) => void
  removeToast: (id: string) => void
  resetChat: () => void
}

let toastCounter = 0

export const useAppStore = create<AppState>((set) => ({
  isAuthenticated: false,
  activeNav: 'dashboard',
  chatMessages: initialChatMessages,
  calls: [],
  toasts: [],

  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
  setActiveNav: (nav) => set({ activeNav: nav }),
  setCalls: (calls) => set({ calls }),

  updateCall: (id, updates) =>
    set((s) => ({
      calls: s.calls.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  prependCall: (call) =>
    set((s) => ({
      calls: [call, ...s.calls].slice(0, 16),
    })),

  addChatMessage: (msg) =>
    set((s) => ({ chatMessages: [...s.chatMessages, msg] })),

  removeTyping: () =>
    set((s) => ({ chatMessages: s.chatMessages.filter((m) => m.role !== 'typing') })),

  addToast: (message, type = 'success') => {
    const id = `toast-${++toastCounter}`
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3500)
  },

  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  resetChat: () => set({ chatMessages: initialChatMessages }),
}))
