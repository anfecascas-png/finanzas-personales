import { Trash2 } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { formatCOP, formatFecha } from '../../lib/formatters'

export function TablaMura({ rows, onDelete, loading }) {
  if (loading) return <div className="h-32 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
  if (!rows?.length) {
    return <div className="text-center py-10 text-sm text-gray-400 dark:text-gray-500">Sin movimientos registrados este mes</div>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-700">
            {['Fecha', 'Concepto', 'Tipo', 'Categoría', 'Monto', ''].map((h) => (
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
                <Badge variant={row.Tipo === 'Ingreso' ? 'green' : 'red'}>{row.Tipo}</Badge>
              </td>
              <td className="py-3 px-2 text-xs text-gray-500 dark:text-gray-400">{row.Categoría_Mura}</td>
              <td className={`py-3 px-2 font-semibold tabular-nums ${row.Tipo === 'Ingreso' ? 'text-brand-600 dark:text-brand-400' : 'text-red-500 dark:text-red-400'}`}>
                {row.Tipo === 'Ingreso' ? '+' : '-'}{formatCOP(row.Monto)}
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
  )
}
