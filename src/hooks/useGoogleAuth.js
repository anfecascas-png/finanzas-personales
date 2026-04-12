import { useState, useEffect, useCallback } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import { SCOPES } from '../config'
import { initializeSpreadsheet, getStoredSpreadsheetId, clearStoredSpreadsheetId } from '../lib/sheetsSetup'

const TOKEN_KEY = 'finanzas_token'
const TOKEN_EXPIRY_KEY = 'finanzas_token_expiry'

function getStoredToken() {
  const token = localStorage.getItem(TOKEN_KEY)
  const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
  if (!token || !expiry) return null
  if (Date.now() > Number(expiry)) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
    return null
  }
  return token
}

export function useGoogleAuth() {
  const [accessToken, setAccessToken] = useState(() => getStoredToken())
  const [spreadsheetId, setSpreadsheetId] = useState(() => getStoredSpreadsheetId())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [initializing, setInitializing] = useState(false)

  const setupSpreadsheet = useCallback(async (token) => {
    setInitializing(true)
    setError(null)
    try {
      const id = await initializeSpreadsheet(token)
      setSpreadsheetId(id)
    } catch (err) {
      setError('Error al configurar el spreadsheet: ' + err.message)
      console.error(err)
    } finally {
      setInitializing(false)
    }
  }, [])

  // On mount, if we have a stored token but no spreadsheetId, set it up
  useEffect(() => {
    if (accessToken && !spreadsheetId) {
      setupSpreadsheet(accessToken)
    }
  }, [accessToken, spreadsheetId, setupSpreadsheet])

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const token = tokenResponse.access_token
      const expiresIn = tokenResponse.expires_in || 3600
      const expiry = Date.now() + expiresIn * 1000

      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(TOKEN_EXPIRY_KEY, String(expiry))
      setAccessToken(token)
      setLoading(false)

      await setupSpreadsheet(token)
    },
    onError: (err) => {
      setError('Error de autenticación: ' + (err.error_description || err.error || 'Desconocido'))
      setLoading(false)
    },
    scope: SCOPES,
    flow: 'implicit',
  })

  const handleLogin = useCallback(() => {
    setLoading(true)
    setError(null)
    login()
  }, [login])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
    clearStoredSpreadsheetId()
    setAccessToken(null)
    setSpreadsheetId(null)
    setError(null)
  }, [])

  return {
    accessToken,
    spreadsheetId,
    isAuthenticated: !!accessToken && !!spreadsheetId,
    loading,
    initializing,
    error,
    login: handleLogin,
    logout,
  }
}
