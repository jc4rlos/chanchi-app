import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UIState = {
  amountsVisible: boolean
  toggleAmounts: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      amountsVisible: false,
      toggleAmounts: () => set((s) => ({ amountsVisible: !s.amountsVisible })),
    }),
    { name: 'chanchi-ui' }
  )
)
