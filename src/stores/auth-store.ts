import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'
import { type MenuItem } from '@/features/permissions/data/menu-service'

const ACCESS_TOKEN_KEY = 'thisisjustarandomstring'
const USER_KEY = 'auth_user'
const MENU_ITEMS_KEY = 'auth_menu'

export interface AuthUser {
  employeeId: number
  email: string
  role: string
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    menuItems: MenuItem[]
    setMenuItems: (items: MenuItem[]) => void
  }
}

const parseJson = <T>(value: string | undefined): T | null => {
  if (!value) return null
  try {
    return JSON.parse(value) as T
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const initToken = parseJson<string>(getCookie(ACCESS_TOKEN_KEY)) ?? ''
  const initUser = parseJson<AuthUser>(getCookie(USER_KEY))
  const initMenuItems = parseJson<MenuItem[]>(getCookie(MENU_ITEMS_KEY)) ?? []
  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          if (user) setCookie(USER_KEY, JSON.stringify(user))
          else removeCookie(USER_KEY)
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN_KEY, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN_KEY)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN_KEY)
          removeCookie(USER_KEY)
          removeCookie(MENU_ITEMS_KEY)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '', menuItems: [] },
          }
        }),
      menuItems: initMenuItems,
      setMenuItems: (menuItems) =>
        set((state) => {
          setCookie(MENU_ITEMS_KEY, JSON.stringify(menuItems))
          return { ...state, auth: { ...state.auth, menuItems } }
        }),
    },
  }
})
