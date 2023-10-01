// eslint-disable-next-line import/no-extraneous-dependencies
import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}))

export default useAuthStore
