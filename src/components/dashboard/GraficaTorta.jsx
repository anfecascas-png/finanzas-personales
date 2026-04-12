import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { formatCOP } from '../../lib/formatters'
import { useTheme } from '../../context/ThemeContext'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const { name, value, color } = payload[0].payload
  const total = payload[0].payload.total
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg px-3 py-2 text-xs">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
        <span className="font-medium text-gray-700 dark:text-gray-300">{name}</span>
      </div>
      <div className="text-gray-900 dark:text-gray-100 font-semibold">{formatCOP(value)}</div>
      <div className="text-gray-400 dark:text-gray-500">{pct}% del total</div>
    </div>
  )
}

const RADIAN = Math.PI / 180
function renderPorcentaje({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.06) return null
  const r = innerRadius + (outerRadius - innerRadius) * 0.55
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${Math.round(percent * 100)}%`}
    </text>
  )
}

export function GraficaTorta({ data, loading }) {
  const { dark } = useTheme()
  const total = data?.reduce((s, d) => s + d.value, 0) || 0
  const dataConTotal = data?.map((d) => ({ ...d, total })) || []

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Gastos por categoría</CardTitle></CardHeader>
        <div className="h-56 bg-gray-50 dark:bg-gray-800 rounded-xl animate-pulse" />
      </Card>
    )
  }
  if (!data?.length) {
    return (
      <Card>
        <CardHeader><CardTitle>Gastos por categoría</CardTitle></CardHeader>
        <div className="h-56 flex items-center justify-center text-sm text-gray-400 dark:text-gray-500">Sin datos este mes</div>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader><CardTitle>Distribución del mes</CardTitle></CardHeader>
      <ResponsiveContainer width="100%" height={230}>
        <PieChart>
          <Pie data={dataConTotal} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" labelLine={false} label={renderPorcentaje}>
            {dataConTotal.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke={dark ? '#111827' : 'white'} strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600 dark:text-gray-400">{v}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
