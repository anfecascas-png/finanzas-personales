import { PiggyBank, TrendingUp, Landmark } from 'lucide-react'
import { Card } from '../ui/Card'
import { formatCOP } from '../../lib/formatters'
import { cn } from '../../lib/utils'

const TIPO_CONFIG = {
  Bolsillo: { icon: PiggyBank, color: 'bg-purple-500', label: 'Bolsillos' },
  Plazo_Fijo: { icon: Landmark, color: 'bg-blue-500', label: 'Plazo Fijo / CDT' },
  Acciones: { icon: TrendingUp, color: 'bg-brand-500', label: 'Acciones' },
}

export function ResumenInversiones({ saldoPorTipo, totalAhorros, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => <div key={i} className="h-28 bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse" />)}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {saldoPorTipo.map(({ tipo, saldo, movimientos }) => {
          const config = TIPO_CONFIG[tipo] || { icon: PiggyBank, color: 'bg-gray-400', label: tipo }
          const Icon = config.icon
          return (
            <Card key={tipo} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', config.color)}>
                  <Icon size={16} className="text-white" />
                </div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{config.label}</p>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100 tabular-nums">{formatCOP(saldo)}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{movimientos} movimiento{movimientos !== 1 ? 's' : ''}</p>
            </Card>
          )
        })}
      </div>
      <Card className="flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Total patrimonio invertido</p>
        <p className="text-xl font-bold text-brand-600 dark:text-brand-400 tabular-nums">{formatCOP(totalAhorros)}</p>
      </Card>
    </div>
  )
}
