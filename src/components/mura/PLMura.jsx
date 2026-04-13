import { TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatCompact } from '../../lib/formatters'
import { cn } from '../../lib/utils'

export function PLMura({ muraIngresos, muraGastos, muraProfit, muraProfitMargen, loading }) {
  const isPositive = muraProfit >= 0

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Income */}
        <Card className="!p-4">
          <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-2">
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Revenue</p>
          {loading ? <div className="h-6 w-20 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" /> :
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatCompact(muraIngresos)}</p>}
        </Card>
        {/* Expenses */}
        <Card className="!p-4">
          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-2">
            <TrendingDown size={16} className="text-red-500" />
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">Op. Costs</p>
          {loading ? <div className="h-6 w-20 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" /> :
            <p className="text-lg font-bold text-red-500 dark:text-red-400 tabular-nums">{formatCompact(muraGastos)}</p>}
        </Card>
      </div>

      {/* Profit — WIP */}
      <Card className="!p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isPositive ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20')}>
              <DollarSign size={16} className={isPositive ? 'text-emerald-500' : 'text-red-500'} />
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Net Profit</p>
              {!loading && <p className={cn('text-lg font-bold tabular-nums', isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400')}>{formatCompact(muraProfit)}</p>}
              {loading && <div className="h-6 w-24 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mt-0.5" />}
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 text-xs font-medium px-2 py-1 rounded-lg">
              <Clock size={11} /> WIP
            </span>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Cost structure pending</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
