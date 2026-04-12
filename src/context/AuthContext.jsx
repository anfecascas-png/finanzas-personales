import { createContext } from 'react'

export const AuthContext = createContext({
  accessToken: null,
  spreadsheetId: null,
  isAuthenticated: false,
  loading: false,
  initializing: false,
  error: null,
  login: () => {},
  logout: () => {},
})
