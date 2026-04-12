import { cn } from '../../lib/utils'

export function Select({ label, error, children, className, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <select
        {...props}
        className={cn(
          'w-full rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm',
          'text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800',
          'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-150',
          error && 'border-red-400',
          className
        )}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
