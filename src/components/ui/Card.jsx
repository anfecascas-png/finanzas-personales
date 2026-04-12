import { cn } from '../../lib/utils'

export function Card({ children, className, ...props }) {
  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return <div className={cn('flex items-center justify-between mb-4', className)}>{children}</div>
}

export function CardTitle({ children, className }) {
  return <h3 className={cn('text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide', className)}>{children}</h3>
}
