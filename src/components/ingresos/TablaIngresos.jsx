import { Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { formatCOP, formatFecha, formatFechaCorta, formatCompact } from '../../lib/formatters'

const FUENTE_BADGE = { Salario: 'blue', 'Mura Café': 'orange', Otro: 'gray' }

export function TablaIngresos({ rows, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!rows?.length) {
    return (
      <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">
        No income recorded this month. Add the first one.
      </div>
    )
  }

  return (
    <>
      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
        {rows.map((row, i) => (
          <div key={i} className="flex items-center justify-between py-3 px-1 group">
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Badge variant={FUENTE_BADGE[row.Fuente] || 'gray'}>{row.Fuente}</Badge>
                {row.Notas && <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{row.Notas}</span>}
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">{formatFechaCorta(row.Fecha)}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-sm font-bold tabular-nums text-brand-600 dark:text-brand-400">{formatCompact(row.Monto)}</span>
              <button
                onClick={() => onDelete(i + 1)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between py-3 px-1 border-t border-gray-200 dark:border-gray-700 mt-1">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Total</span>
          <span className="text-sm font-bold text-brand-600 dark:text-brand-400 tabular-nums">
            {formatCOP(rows.reduce((s, r) => s + Number(r.Monto || 0), 0))}
          </span>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Date</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Source</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Notes</th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Amount</th>
              <th className="py-3 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="py-3 px-2 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{formatFecha(row.Fecha)}</td>
                <td className="py-3 px-2">
                  <Badge variant={FUENTE_BADGE[row.Fuente] || 'gray'}>{row.Fuente}</Badge>
                </td>
                <td className="py-3 px-2 text-gray-500 dark:text-gray-400 text-xs max-w-[200px] truncate">{row.Notas || '—'}</td>
                <td className="py-3 px-2 text-right font-semibold text-brand-600 dark:text-brand-400 tabular-nums">
                  {formatCOP(row.Monto)}
                </td>
                <td className="py-3 px-2">
                  <button
                    onClick={() => onDelete(i + 1)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 dark:border-gray-700">
              <td colSpan={3} className="py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Total</td>
              <td className="py-3 px-2 text-right font-bold text-brand-600 dark:text-brand-400 tabular-nums">
                {formatCOP(rows.reduce((s, r) => s + Number(r.Monto || 0), 0))}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}
