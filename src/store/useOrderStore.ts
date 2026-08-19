import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Order } from '@/types/order'

/**
 * Completed (mock) orders. Kept so the success screen survives a refresh and
 * so order history has somewhere to live later.
 */
interface OrderState {
  lastOrder: Order | null
  history: Order[]
  recordOrder: (order: Order) => void
  clear: () => void
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      lastOrder: null,
      history: [],
      recordOrder: (order) =>
        set((s) => ({ lastOrder: order, history: [order, ...s.history].slice(0, 20) })),
      clear: () => set({ lastOrder: null, history: [] }),
    }),
    {
      name: 'recipes:orders',
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
