import { Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { formatCOP, formatFecha, formatFechaCorta } from '../../lib/formatters'

const TIPO_BADGE = { Fijo: 'blue', Variable: 'orange' }
const FRECUENCIA_BADGE = { Trimestral: 'blue', Semestral: 'brand', Anual: 'orange' }

function parseFrecuencia(notas) {
  const match = notas?.match(/^\[(Trimestral|Semestral|Anual)\]/)
  return match ? match[1] : null
}

export function TablaTransacciones({ rows, onDelete, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (!rows?.length) {
    return (
      <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">
        Sin transacciones este mes. Agrega la primera.
      </div>
    )
  }

  const freq = (row) => parseFrecuencia(row.Notas)

  return (
    <>
      {/* Mobile: lista de filas */}
      <div className="md:hidden divide-y divide-gray-50 dark:divide-gray-800">
        {rows.map((row, i) => (
          <div key={row.ID || i} className="flex items-center gap-3 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{row.Descripcion || row['Descripción']}</p>
                <Badge variant={TIPO_BADGE[row.Tipo_Gasto] || 'gray'}>{row.Tipo_Gasto}</Badge>
                {freq(row) && <Badge variant={FRECUENCIA_BADGE[freq(row)] || 'gray'}>{freq(row)}</Badge>}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {formatFechaCorta(row.Fecha)} · {row['Categoría'] || row.Categoria}
                {row['Subcategoría'] ? ` / ${row['Subcategoría']}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm font-bold text-red-500 dark:text-red-400 tabular-nums whitespace-nowrap">
                {formatCOP(row.Monto)}
              </span>
              <button
                onClick={() => onDelete(i + 1)}
                className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
        <div className="flex justify-between pt-3">
          <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Total</span>
          <span className="text-sm font-bold text-red-500 dark:text-red-400 tabular-nums">
            {formatCOP(rows.reduce((s, r) => s + Number(r.Monto || 0), 0))}
          </span>
        </div>
      </div>

      {/* Desktop: tabla */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Fecha</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Descripción</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Categoría</th>
              <th className="text-left py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Tipo</th>
              <th className="text-right py-3 px-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Monto</th>
              <th className="py-3 px-2 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {rows.map((row, i) => (
              <tr key={row.ID || i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                <td className="py-3 px-2 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{formatFecha(row.Fecha)}</td>
                <td className="py-3 px-2 text-gray-900 dark:text-gray-100 font-medium max-w-[180px] truncate">{row['Descripción']}</td>
                <td className="py-3 px-2">
                  <div className="text-gray-700 dark:text-gray-300 text-xs">{row['Categoría']}</div>
                  {row['Subcategoría'] && <div className="text-gray-400 dark:text-gray-500 text-xs">{row['Subcategoría']}</div>}
                </td>
                <td className="py-3 px-2">
                  <div className="flex flex-wrap gap-1">
                    <Badge variant={TIPO_BADGE[row.Tipo_Gasto] || 'gray'}>{row.Tipo_Gasto}</Badge>
                    {freq(row) && <Badge variant={FRECUENCIA_BADGE[freq(row)] || 'gray'}>{freq(row)}</Badge>}
                  </div>
                </td>
                <td className="py-3 px-2 text-right font-semibold text-red-600 dark:text-red-400 tabular-nums">{formatCOP(row.Monto)}</td>
                <td className="py-3 px-2">
                  <button onClick={() => onDelete(i + 1)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition-all">
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 dark:border-gray-700">
              <td colSpan={4} className="py-3 px-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Total</td>
              <td className="py-3 px-2 text-right font-bold text-red-600 dark:text-red-400 tabular-nums">
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
