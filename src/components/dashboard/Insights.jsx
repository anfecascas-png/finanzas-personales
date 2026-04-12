import { Lightbulb } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '../ui/Card'
import { cn } from '../../lib/utils'

const TYPE_STYLES = {
  success: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
  danger: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
  info: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
}

export function Insights({ insights, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle>Insights del mes</CardTitle></CardHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-50 dark:bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </Card>
    )
  }

  if (!insights.length) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Insights del mes</CardTitle>
        <Lightbulb size={16} className="text-brand-500" />
      </CardHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {insights.map((insight, i) => (
          <div key={i} className={cn('rounded-xl px-4 py-3', TYPE_STYLES[insight.tipo])}>
            <p className="text-xs font-semibold mb-1">{insight.titulo}</p>
            <p className="text-xs leading-relaxed opacity-90">{insight.texto}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
