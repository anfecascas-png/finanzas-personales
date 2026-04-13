import { Badge } from '../ui/Badge'
import { ProgressBar } from '../ui/ProgressBar'
import { formatCOP } from '../../lib/formatters'

const ESTADO_BADGE = { 'Excedido': 'red', 'Alerta': 'yellow', 'En control': 'green' }

export function TarjetaPresupuesto({ categoria, limite, gastado, porcentaje, label, esFijo, carryForward, pendiente, onEditar }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{categoria}</p>
            {esFijo && <span className="text-xs text-gray-400 dark:text-gray-500">Fixed</span>}
            {carryForward && <span className="text-xs text-blue-400 dark:text-blue-500">Inherited</span>}
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {formatCOP(gastado)} de {formatCOP(limite)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={ESTADO_BADGE[label] || 'gray'}>{label || 'Sin estado'}</Badge>
          <button
            onClick={onEditar}
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors font-medium"
          >
            Edit
          </button>
        </div>
      </div>
      <ProgressBar value={gastado} max={limite} />
      <div className="flex items-center justify-between mt-1.5">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {pendiente > 0 ? `${formatCOP(pendiente)} remaining` : ''}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{porcentaje}% used</p>
      </div>
    </div>
  )
}
