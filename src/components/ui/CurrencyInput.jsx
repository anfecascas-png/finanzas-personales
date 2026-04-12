import { cn } from '../../lib/utils'

/**
 * Input de monto en COP con formato automático de miles (puntos)
 * mientras el usuario escribe. Ej: 1000000 → 1.000.000
 * Internamente guarda el número puro como string.
 */
export function CurrencyInput({ label, value, onChange, placeholder = '0', className, disabled }) {
  // Formatea el número con separadores de miles (es-CO usa puntos)
  const display = value
    ? Number(String(value).replace(/\./g, '')).toLocaleString('es-CO')
    : ''

  function handleChange(e) {
    // Solo deja dígitos
    const raw = e.target.value.replace(/\./g, '').replace(/[^0-9]/g, '')
    onChange(raw)
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400 dark:text-gray-500 pointer-events-none">
          $
        </span>
        <input
          type="text"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'w-full pl-7 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700',
            'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'tabular-nums'
          )}
        />
      </div>
    </div>
  )
}
