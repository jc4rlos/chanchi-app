import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UIState = {
  amountsVisible: boolean
  darkMode: boolean
  toggleAmounts: () => void
  toggleDarkMode: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      amountsVisible: false,
      darkMode: false,
      toggleAmounts: () => set((s) => ({ amountsVisible: !s.amountsVisible })),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
    }),
    { name: 'chanchi-ui' }
  )
)
