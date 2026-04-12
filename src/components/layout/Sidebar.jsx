import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Target, TrendingUp, Coffee, LogOut, ExternalLink } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/transacciones', icon: ArrowLeftRight, label: 'Transacciones' },
  { to: '/presupuesto', icon: Target, label: 'Presupuesto' },
  { to: '/inversiones', icon: TrendingUp, label: 'Inversiones' },
  { to: '/mura', icon: Coffee, label: 'Mura Café' },
]

export function Sidebar() {
  const { logout, spreadsheetId } = useContext(AuthContext)
  const navigate = useNavigate()

  function handleLogout() { logout(); navigate('/login') }

  const sheetUrl = spreadsheetId
    ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}`
    : null

  return (
    <aside className="w-60 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col py-6 px-3 shrink-0">
      {/* Logo */}
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Finanzas</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Phil · COP</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Google Sheet link */}
      {sheetUrl && (
        <a
          href={sheetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-500 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-brand-600 dark:hover:text-brand-400 transition-all duration-150 mb-1"
        >
          <ExternalLink size={16} />
          Ver Google Sheet
        </a>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all duration-150"
      >
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </aside>
  )
}
