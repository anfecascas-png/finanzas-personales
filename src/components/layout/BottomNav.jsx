import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, Target, TrendingUp, Coffee } from 'lucide-react'
import { cn } from '../../lib/utils'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Inicio', activeColor: 'text-brand-500', activeBg: 'bg-brand-50 dark:bg-brand-500/10' },
  { to: '/transacciones', icon: ArrowLeftRight, label: 'Gastos', activeColor: 'text-brand-500', activeBg: 'bg-brand-50 dark:bg-brand-500/10' },
  { to: '/presupuesto', icon: Target, label: 'Budget', activeColor: 'text-brand-500', activeBg: 'bg-brand-50 dark:bg-brand-500/10' },
  { to: '/inversiones', icon: TrendingUp, label: 'Ahorros', activeColor: 'text-brand-500', activeBg: 'bg-brand-50 dark:bg-brand-500/10' },
  { to: '/mura', icon: Coffee, label: 'Mura', activeColor: 'text-mura-500', activeBg: 'bg-mura-50 dark:bg-mura-500/10' },
]

export function BottomNav() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-1 pt-1.5 pb-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label, activeColor, activeBg }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-150',
                isActive ? activeColor : 'text-gray-400 dark:text-gray-500'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div className={cn('p-1.5 rounded-xl transition-all duration-150', isActive ? activeBg : '')}>
                  <Icon size={21} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
                <span className="text-[10px] font-medium leading-none">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
