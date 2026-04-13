import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function formatCOP(amount) {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '$0'
  // es-CO añade un espacio especial entre $ y el número — lo quitamos
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(amount)).replace(/[\u00a0\u202f\s]+/, '')
}

export function formatFecha(dateStr) {
  if (!dateStr) return ''
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
    return format(date, 'dd MMM yyyy', { locale: es })
  } catch {
    return dateStr
  }
}

export function formatFechaCorta(dateStr) {
  if (!dateStr) return ''
  try {
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
    return format(date, 'dd/MM', { locale: es })
  } catch {
    return dateStr
  }
}

export function todayISO() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function mesActual() {
  return new Date().getMonth() + 1
}

export function añoActual() {
  return new Date().getFullYear()
}

export function nombreMes(mesNum) {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ]
  return meses[(mesNum - 1) % 12] || ''
}

export function parseMonto(val) {
  if (val === null || val === undefined || val === '') return 0
  return Number(String(val).replace(/[^0-9.-]/g, '')) || 0
}

export function formatCompact(amount) {
  const n = Number(amount)
  if (isNaN(n)) return '$0'
  const abs = Math.abs(n)
  const sign = n < 0 ? '-' : ''
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(abs % 1_000_000 === 0 ? 0 : 1)}M`
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}K`
  return `${sign}$${abs.toLocaleString('es-CO')}`
}
