import { Card, CardHeader, CardTitle } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { formatCOP } from '../../lib/formatters'
import { cn } from '../../lib/utils'

const ESTADO_BADGE = { 'Excedido': 'red', 'Alerta': 'yellow', 'En control': 'green' }

function BarraDoble({ gastado, pendiente, limite }) {
  const pctGastado = limite > 0 ? Math.min((gastado / limite) * 100, 100) : 0
  const pctPendiente = limite > 0 ? Math.min((pendiente / limite) * 100, 100 - pctGastado) : 0
  const color = pctGastado >= 100 ? 'bg-red-500' : pctGastado >= 80 ? 'bg-yellow-400' : 'bg-brand-500'

  return (
    <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden flex">
      <div className={cn('h-full rounded-l-full transition-all duration-500', color, pctPendiente === 0 && 'rounded-full')} style={{ width: `${pctGastado}%` }} />
      <div className="h-full bg-gray-300 dark:bg-gray-600 transition-all duration-500" style={{ width: `${pctPendiente}%` }} />
    </div>
  )
}

export function GraficaPresupuesto({ data, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Presupuesto vs Real</CardTitle></CardHeader>
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse" />)}</div>
      </Card>
    )
  }
  if (!data?.length) {
    return (
      <Card>
        <CardHeader><CardTitle>Presupuesto vs Real</CardTitle></CardHeader>
        <div className="flex items-center justify-center h-40 text-sm text-gray-400 dark:text-gray-500">Ve a Presupuesto para definir tus límites</div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuesto vs Real</CardTitle>
        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-brand-500 inline-block" /> Pagado</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600 inline-block" /> Pendiente</span>
        </div>
      </CardHeader>
      <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
        {data.map((item) => (
          <div key={item.categoria}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">{item.categoria}</span>
                {item.esFijo && <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">Fijo</span>}
                <Badge variant={ESTADO_BADGE[item.label] || 'gray'}>{item.label}</Badge>
              </div>
              <div className="text-right text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-2">
                <span className="font-medium">{formatCOP(item.gastado)}</span>
                <span className="text-gray-300 dark:text-gray-600"> / {formatCOP(item.limite)}</span>
              </div>
            </div>
            <BarraDoble gastado={item.gastado} pendiente={item.pendiente} limite={item.limite} />
            {item.pendiente > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {formatCOP(item.pendiente)} pendiente por registrar
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
