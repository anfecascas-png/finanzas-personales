import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({ dark: false, toggleDark: () => {}, hideBalances: false, toggleHide: () => {} })

export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('finanzas_theme') === 'dark')
  const [hideBalances, setHideBalances] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('finanzas_theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, toggleDark: () => setDark((d) => !d), hideBalances, toggleHide: () => setHideBalances((h) => !h) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
