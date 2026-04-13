import { ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react'
import { MESES } from '../../config'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'

export function TopBar({ mes, año, onMesChange, onAñoChange, title }) {
  const { hideBalances, toggleHide } = useTheme()

  function prevMes() {
    if (mes === 1) { onMesChange(12); onAñoChange(año - 1) }
    else onMesChange(mes - 1)
  }

  function nextMes() {
    const now = new Date()
    if (año > now.getFullYear() || (año === now.getFullYear() && mes >= now.getMonth() + 1)) return
    if (mes === 12) { onMesChange(1); onAñoChange(año + 1) }
    else onMesChange(mes + 1)
  }

  const isCurrentMonth = (() => {
    const now = new Date()
    return mes === now.getMonth() + 1 && año === now.getFullYear()
  })()

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
      <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h1>

      <div className="flex items-center gap-1.5 md:gap-2">
        <div className="flex items-center gap-0.5">
          <button onClick={prevMes} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400">
            <ChevronLeft size={16} />
          </button>
          <div className="min-w-[90px] md:min-w-[130px] text-center">
            <span className="text-xs md:text-sm font-semibold text-gray-900 dark:text-gray-100">
              <span className="md:hidden">{MESES[mes - 1].slice(0, 3)} {año}</span>
              <span className="hidden md:inline">{MESES[mes - 1]} {año}</span>
            </span>
          </div>
          <button
            onClick={nextMes}
            disabled={isCurrentMonth}
            className={cn('p-1.5 rounded-lg transition-colors', isCurrentMonth ? 'text-gray-200 dark:text-gray-700 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400')}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Eye toggle */}
        <button
          onClick={toggleHide}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400 dark:text-gray-500"
          title={hideBalances ? 'Show balances' : 'Hide balances'}
        >
          {hideBalances ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>

        <ThemeToggle />
      </div>
    </header>
  )
}
