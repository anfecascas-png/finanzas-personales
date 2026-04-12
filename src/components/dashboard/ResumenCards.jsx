import { ArrowUp, ArrowDown, Wallet, PiggyBank } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatCOP } from '../../lib/formatters'
import { cn } from '../../lib/utils'

function StatCard({ title, value, icon: Icon, iconColor, sub, subPositive, loading }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{title}</p>
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', iconColor)}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      {loading ? (
        <div className="h-7 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatCOP(value)}</p>
      )}
      {sub && !loading && (
        <p className={cn('text-xs', subPositive ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500')}>{sub}</p>
      )}
    </Card>
  )
}

export function ResumenCards({ totalIngresos, totalGastos, saldoDisponible, ahorradoDelMes, totalAhorros, totalIngresosMesAnterior, totalGastosMesAnterior, loading }) {
  const deltaIngresos = totalIngresos - totalIngresosMesAnterior
  const deltaGastos = totalGastos - totalGastosMesAnterior

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {/* 1. Ingresos */}
      <StatCard
        title="Ingresos del mes"
        value={totalIngresos}
        icon={ArrowUp}
        iconColor="bg-brand-500"
        sub={deltaIngresos !== 0 ? `${deltaIngresos >= 0 ? '▲' : '▼'} ${formatCOP(Math.abs(deltaIngresos))} vs mes anterior` : undefined}
        subPositive={deltaIngresos >= 0}
        loading={loading}
      />
      {/* 2. Gastos */}
      <StatCard
        title="Gastos del mes"
        value={totalGastos}
        icon={ArrowDown}
        iconColor="bg-red-400"
        sub={deltaGastos !== 0 ? `${deltaGastos >= 0 ? '▲' : '▼'} ${formatCOP(Math.abs(deltaGastos))} vs mes anterior` : undefined}
        subPositive={deltaGastos < 0}
        loading={loading}
      />
      {/* 3. Invertido / Ahorro */}
      <StatCard
        title="Invertido / Ahorro"
        value={totalAhorros}
        icon={PiggyBank}
        iconColor="bg-purple-500"
        sub={ahorradoDelMes > 0 ? `+${formatCOP(ahorradoDelMes)} depositado este mes` : 'Sin depósitos este mes'}
        subPositive={ahorradoDelMes > 0}
        loading={loading}
      />
      {/* 4. Disponible */}
      <StatCard
        title="Disponible"
        value={saldoDisponible}
        icon={Wallet}
        iconColor={saldoDisponible >= 0 ? 'bg-blue-500' : 'bg-orange-500'}
        sub="Ingresos − Gastos − Ahorros"
        loading={loading}
      />
    </div>
  )
}
