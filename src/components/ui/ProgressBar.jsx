import { cn } from '../../lib/utils'

export function ProgressBar({ value, max = 100, className }) {
  const pct = Math.min(Math.round((value / max) * 100), 100)
  const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-yellow-400' : 'bg-brand-500'

  return (
    <div className={cn('w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden', className)}>
      <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${pct}%` }} />
    </div>
  )
}
