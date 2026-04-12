import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthContext } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { useGoogleAuth } from './hooks/useGoogleAuth'
import { GOOGLE_CLIENT_ID } from './config'
import { Sidebar } from './components/layout/Sidebar'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Transacciones } from './pages/Transacciones'
import { Presupuesto } from './pages/Presupuesto'
import { Inversiones } from './pages/Inversiones'
import { MuraCafe } from './pages/MuraCafe'
import { mesActual, añoActual } from './lib/formatters'

function AppInner() {
  const auth = useGoogleAuth()
  const [mes, setMes] = useState(mesActual())
  const [año, setAño] = useState(añoActual())
  const mesProps = { mes, año, onMesChange: setMes, onAñoChange: setAño }

  if (!auth.isAuthenticated) {
    return (
      <AuthContext.Provider value={auth}>
        <Login />
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={auth}>
      <BrowserRouter>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
          <Sidebar />
          <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
            {auth.initializing ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg className="animate-spin h-8 w-8 text-brand-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Configurando tu spreadsheet...</p>
                </div>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Dashboard {...mesProps} />} />
                <Route path="/transacciones" element={<Transacciones {...mesProps} />} />
                <Route path="/presupuesto" element={<Presupuesto {...mesProps} />} />
                <Route path="/inversiones" element={<Inversiones {...mesProps} />} />
                <Route path="/mura" element={<MuraCafe {...mesProps} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </main>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}
