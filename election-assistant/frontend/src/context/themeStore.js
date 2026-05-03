import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      language: 'en',

      toggleDark: () => {
        const newDark = !get().isDark
        set({ isDark: newDark })
        document.documentElement.classList.toggle('dark', newDark)
      },

      setLanguage: (lang) => set({ language: lang }),

      initTheme: () => {
        const isDark = get().isDark
        document.documentElement.classList.toggle('dark', isDark)
      }
    }),
    { name: 'election-theme' }
  )
)

export default useThemeStore
