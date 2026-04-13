import { Coffee, TrendingUp, TrendingDown } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { formatCompact, formatCOP } from '../../lib/formatters'
import { cn } from '../../lib/utils'

export function MiniMura({ muraIngresos, muraGastos, muraProfit, muraProfitMargen, loading }) {
  const isPositive = muraProfit >= 0

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Mura Café</CardTitle><Coffee size={16} className="text-mura-500" /></CardHeader>
        <div className="h-20 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
      </Card>
    )
  }

  if (muraIngresos === 0 && muraGastos === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Mura Café — Monthly P&L</CardTitle><Coffee size={16} className="text-mura-500" /></CardHeader>
        <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500">No entries this month</div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Mura Café — Monthly P&L</CardTitle><Coffee size={16} className="text-mura-500" /></CardHeader>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Revenue', value: muraIngresos, color: 'text-brand-600 dark:text-brand-400' },
          { label: 'Costs', value: muraGastos, color: 'text-red-500' },
          { label: 'Profit', value: muraProfit, color: isPositive ? 'text-brand-600 dark:text-brand-400' : 'text-red-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
            <p className={cn('text-sm font-bold tabular-nums', color)}>{formatCompact(value)}</p>
          </div>
        ))}
      </div>
      <div className={cn('mt-3 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium', isPositive ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400')}>
        {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {muraProfitMargen}% margin
      </div>
    </Card>
  )
}
