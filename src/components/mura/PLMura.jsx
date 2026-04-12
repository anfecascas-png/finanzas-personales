import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatCOP } from '../../lib/formatters'
import { cn } from '../../lib/utils'

export function PLMura({ muraIngresos, muraGastos, muraProfit, muraProfitMargen, loading }) {
  const isPositive = muraProfit >= 0

  const items = [
    { label: 'Ingresos totales', value: muraIngresos, icon: TrendingUp, color: 'text-brand-600 dark:text-brand-400', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Gastos operativos', value: muraGastos, icon: TrendingDown, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
    { label: 'Profit neto', value: muraProfit, icon: DollarSign, color: isPositive ? 'text-brand-600 dark:text-brand-400' : 'text-red-500 dark:text-red-400', bg: isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map(({ label, value, icon: Icon, color, bg }) => (
        <Card key={label}>
          <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', bg)}>
            <Icon size={18} className={color} />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
          {loading ? (
            <div className="h-6 w-24 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <p className={cn('text-xl font-bold tabular-nums', color)}>{formatCOP(value)}</p>
          )}
          {label === 'Profit neto' && !loading && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Margen del {muraProfitMargen}%</p>
          )}
        </Card>
      ))}
    </div>
  )
}
