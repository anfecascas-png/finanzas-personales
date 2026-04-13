import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { formatCompact, formatCOP } from '../../lib/formatters'
import { useTheme } from '../../context/ThemeContext'
import { TODAS_CATEGORIAS, COLORES_GRAFICA } from '../../config'

// Assign a color to each category (same as pie chart)
const CAT_COLORS = {}
TODAS_CATEGORIAS.forEach((c, i) => {
  CAT_COLORS[c.nombre] = COLORES_GRAFICA[i % COLORES_GRAFICA.length]
})
CAT_COLORS['Inversiones / Ahorros'] = '#8b5cf6'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg px-3 py-2 text-xs max-w-[200px]">
      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{label}</p>
      {payload.filter(p => p.value > 0).map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-3 mb-0.5">
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: p.fill || p.color }} />
            <span className="text-gray-500 dark:text-gray-400 truncate">{p.name}</span>
          </div>
          <span className="font-medium text-gray-900 dark:text-gray-100 tabular-nums shrink-0">{formatCompact(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function GraficaTendencia({ data, loading }) {
  const { dark } = useTheme()
  const [showCategories, setShowCategories] = useState(false)
  const axisColor = dark ? '#6b7280' : '#9ca3af'
  const gridColor = dark ? '#1f2937' : '#f3f4f6'

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Monthly Trend</CardTitle></CardHeader>
        <div className="h-56 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
      </Card>
    )
  }

  const categories = TODAS_CATEGORIAS.map(c => c.nombre)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Trend</CardTitle>
        <button
          onClick={() => setShowCategories(v => !v)}
          className="text-xs text-gray-400 hover:text-brand-500 transition-colors font-medium"
        >
          {showCategories ? 'Show totals' : 'By category'}
        </button>
      </CardHeader>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={(v) => formatCompact(v)} width={45} />
          <Tooltip content={<CustomTooltip />} />

          {/* Income bar (always shown) */}
          <Bar dataKey="ingresos" name="Income" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={24} />

          {/* Expenses: either total or by category stacked */}
          {showCategories ? (
            categories.map((cat, i) => (
              <Bar key={cat} dataKey={cat} name={cat} stackId="gastos" fill={CAT_COLORS[cat]} maxBarSize={24}
                radius={i === categories.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
            ))
          ) : (
            <Bar dataKey="gastos" name="Expenses" fill="#ef4444" radius={[3, 3, 0, 0]} maxBarSize={24} />
          )}
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
