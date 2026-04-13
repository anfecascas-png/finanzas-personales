import { Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { formatCOP, formatFecha, formatFechaCorta, formatCompact } from '../../lib/formatters'

function tipoBadgeVariant(tipo) {
  if (tipo === 'Ingreso') return 'green'
  if (tipo === 'Gasto') return 'red'
  return 'blue'
}

function tipoAmountClass(tipo) {
  if (tipo === 'Ingreso') return 'text-brand-600 dark:text-brand-400'
  if (tipo === 'Gasto') return 'text-red-500 dark:text-red-400'
  return 'text-blue-500 dark:text-blue-400'
}

function tipoSign(tipo) {
  if (tipo === 'Ingreso') return '+'
  if (tipo === 'Gasto') return '-'
  return ''
}

export function TablaMura({ rows, onDelete, loading }) {
  if (loading) return <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
  if (!rows?.length) {
    return <div className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">No entries this month</div>
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between py-3 px-1 group">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{row.Concepto}</span>
                <Badge variant={tipoBadgeVariant(row.Tipo)}>{row.Tipo}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                <span>{formatFechaCorta(row.Fecha)}</span>
                {row.Categoría_Mura && <span>· {row.Categoría_Mura}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className={`text-sm font-bold tabular-nums ${tipoAmountClass(row.Tipo)}`}>
                {tipoSign(row.Tipo)}{formatCompact(row.Monto)}
              </span>
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
              {['Date', 'Concept', 'Type', 'Category', 'Amount', ''].map((h) => (
                <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 group transition-colors">
                <td className="py-3 px-2 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{formatFecha(row.Fecha)}</td>
                <td className="py-3 px-2 text-gray-900 dark:text-gray-100 font-medium">{row.Concepto}</td>
                <td className="py-3 px-2">
                  <Badge variant={tipoBadgeVariant(row.Tipo)}>{row.Tipo}</Badge>
                </td>
                <td className="py-3 px-2 text-xs text-gray-500 dark:text-gray-400">{row.Categoría_Mura}</td>
                <td className={`py-3 px-2 font-semibold tabular-nums ${tipoAmountClass(row.Tipo)}`}>
                  {tipoSign(row.Tipo)}{formatCOP(row.Monto)}
                </td>
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
