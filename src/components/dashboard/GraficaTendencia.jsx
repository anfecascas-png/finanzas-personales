import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { formatCOP } from '../../lib/formatters'
import { useTheme } from '../../context/ThemeContext'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-600 dark:text-gray-400">{p.name}:</span>
          <span className="font-medium text-gray-900 dark:text-gray-100">{formatCOP(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export function GraficaTendencia({ data, loading }) {
  const { dark } = useTheme()
  const axisColor = dark ? '#6b7280' : '#9ca3af'
  const gridColor = dark ? '#1f2937' : '#f3f4f6'

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Tendencia últimos 6 meses</CardTitle></CardHeader>
        <div className="h-56 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Tendencia últimos 6 meses</CardTitle></CardHeader>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="mes" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: axisColor }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600 dark:text-gray-400">{v}</span>} />
          <Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="#10b981" strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="gastos" name="Gastos" stroke="#ef4444" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
