import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  token: string | null
}

type AuthActions = () => {
  setToken: (token: string) => void
  removeToken: () => void
}

type UseAuthStore = {
  store: AuthStore
  actions: AuthActions
}

const useAuthStore = create<UseAuthStore>()(
  persist(
    (set) => ({
      store: {
        token: null,
      },
      actions: () => ({
        setToken: (token: string) => set({ store: { token } }),
        removeToken: () => set({ store: { token: null } }),
      }),
    }),
    {
      name: 'auth-storage',
    },
  ),
)

export default useAuthStore
