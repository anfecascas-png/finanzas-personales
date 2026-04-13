import { Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { formatCOP, formatFecha, formatFechaCorta, formatCompact } from '../../lib/formatters'

const ACCION_BADGE = { Depósito: 'green', Retiro: 'red' }
const TIPO_BADGE = { Bolsillo: 'brand', Plazo_Fijo: 'blue', Acciones: 'orange' }

export function TablaMovimientos({ rows, onDelete, loading }) {
  if (loading) {
    return <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
  }
  if (!rows?.length) {
    return <div className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No entries yet</div>
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between py-3 px-1 group">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{row.Descripción}</span>
                <Badge variant={ACCION_BADGE[row.Acción] || 'gray'}>{row.Acción}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <span>{formatFechaCorta(row.Fecha)}</span>
                {row.Entidad && <span>· {row.Entidad}</span>}
                <Badge variant={TIPO_BADGE[row.Tipo] || 'gray'}>{row.Tipo}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <div className="text-right">
                <p className="text-sm font-bold tabular-nums text-gray-900 dark:text-gray-100">{formatCompact(row.Monto)}</p>
                <p className="text-xs text-brand-600 dark:text-brand-400 tabular-nums">{formatCompact(row.Saldo_Actual)}</p>
              </div>
              <button onClick={() => onDelete(i + 1)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-all">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              {['Date', 'Type', 'Institution', 'Description', 'Action', 'Amount', 'Current balance', ''].map((h) => (
                <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-colors">
                <td className="py-3 px-2 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{formatFecha(row.Fecha)}</td>
                <td className="py-3 px-2"><Badge variant={TIPO_BADGE[row.Tipo] || 'gray'}>{row.Tipo}</Badge></td>
                <td className="py-3 px-2 text-gray-700 dark:text-gray-300 text-xs">{row.Entidad}</td>
                <td className="py-3 px-2 text-gray-700 dark:text-gray-300 max-w-[160px] truncate">{row.Descripción}</td>
                <td className="py-3 px-2"><Badge variant={ACCION_BADGE[row.Acción] || 'gray'}>{row.Acción}</Badge></td>
                <td className="py-3 px-2 font-semibold tabular-nums text-gray-900 dark:text-gray-100">{formatCOP(row.Monto)}</td>
                <td className="py-3 px-2 font-semibold tabular-nums text-brand-600 dark:text-brand-400">{formatCOP(row.Saldo_Actual)}</td>
                <td className="py-3 px-2">
                  <button onClick={() => onDelete(i + 1)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-all">
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
