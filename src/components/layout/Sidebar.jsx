import { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Target, TrendingUp, Coffee, LogOut, ExternalLink } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', activeClass: 'bg-orange-500 text-white shadow-sm', hoverClass: 'hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600' },
  { to: '/transacciones', icon: ArrowLeftRight, label: 'Transactions', activeClass: 'bg-red-500 text-white shadow-sm', hoverClass: 'hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600' },
  { to: '/presupuesto', icon: Target, label: 'Budget', activeClass: 'bg-emerald-500 text-white shadow-sm', hoverClass: 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600' },
  { to: '/inversiones', icon: TrendingUp, label: 'Savings', activeClass: 'bg-purple-500 text-white shadow-sm', hoverClass: 'hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600' },
  { to: '/mura', icon: Coffee, label: 'Mura Café', activeClass: 'bg-blue-500 text-white shadow-sm', hoverClass: 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600' },
]

export function Sidebar() {
  const { logout, spreadsheetId } = useContext(AuthContext)
  const navigate = useNavigate()

  function handleLogout() { logout(); navigate('/login') }

  const sheetUrl = spreadsheetId ? `https://docs.google.com/spreadsheets/d/${spreadsheetId}` : null

  return (
    <aside className="hidden md:flex w-60 min-h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex-col py-6 px-3 shrink-0">
      <div className="px-3 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Phil's Finance</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Colombia · COP</p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label, activeClass, hoverClass }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive ? activeClass : cn('text-gray-600 dark:text-gray-400', hoverClass))
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {sheetUrl && (
        <a href={sheetUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-700 transition-all mb-1">
          <ExternalLink size={16} />
          View Google Sheet
        </a>
      )}

      <button onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all">
        <LogOut size={18} />
        Sign out
      </button>
    </aside>
  )
}
