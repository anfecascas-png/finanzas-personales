import { ArrowUp, ArrowDown, Wallet, PiggyBank } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatCompact, formatCOP } from '../../lib/formatters'
import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'

function StatCard({ title, value, icon: Icon, iconColor, sub, subPositive }) {
  const { hideBalances } = useTheme()
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide leading-tight">{title}</p>
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', iconColor)}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">
        {hideBalances ? '••••••' : formatCompact(value)}
      </p>
      {sub && (
        <p className={cn('text-xs leading-tight', subPositive ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500')}>
          {hideBalances ? '••••' : sub}
        </p>
      )}
    </Card>
  )
}

export function ResumenCards({ totalIngresos, totalGastos, saldoDisponible, ahorradoDelMes, totalAhorros, totalIngresosMesAnterior, totalGastosMesAnterior, loading }) {
  const deltaIngresos = totalIngresos - totalIngresosMesAnterior
  const deltaGastos = totalGastos - totalGastosMesAnterior

  if (loading) {
    return (
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        {[1,2,3,4].map((i) => <div key={i} className="h-28 bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        title="Income"
        value={totalIngresos}
        icon={ArrowUp}
        iconColor="bg-brand-500"
        sub={deltaIngresos !== 0 ? `${deltaIngresos >= 0 ? '▲' : '▼'} ${formatCompact(Math.abs(deltaIngresos))} vs last month` : undefined}
        subPositive={deltaIngresos >= 0}
      />
      <StatCard
        title="Expenses"
        value={totalGastos}
        icon={ArrowDown}
        iconColor="bg-red-400"
        sub={deltaGastos !== 0 ? `${deltaGastos >= 0 ? '▲' : '▼'} ${formatCompact(Math.abs(deltaGastos))} vs last month` : undefined}
        subPositive={deltaGastos < 0}
      />
      <StatCard
        title="Saved / Invested"
        value={totalAhorros}
        icon={PiggyBank}
        iconColor="bg-purple-500"
        sub={ahorradoDelMes > 0 ? `+${formatCompact(ahorradoDelMes)} deposited this month` : 'No deposits this month'}
        subPositive={ahorradoDelMes > 0}
      />
      <StatCard
        title="Available"
        value={saldoDisponible}
        icon={Wallet}
        iconColor={saldoDisponible >= 0 ? 'bg-blue-500' : 'bg-red-500'}
        sub="Income − Expenses − Savings"
      />
    </div>
  )
}
