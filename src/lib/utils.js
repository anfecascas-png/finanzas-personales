import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export function rowsToObjects(rows) {
  if (!rows || rows.length < 2) return []
  const [headers, ...dataRows] = rows
  return dataRows.map((row) => {
    const obj = {}
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? ''
    })
    return obj
  })
}

export function objectsToRows(objects, headers) {
  return objects.map((obj) => headers.map((h) => obj[h] ?? ''))
}

export function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const k = item[key]
    if (!acc[k]) acc[k] = []
    acc[k].push(item)
    return acc
  }, {})
}

export function sumBy(arr, key) {
  return arr.reduce((sum, item) => sum + (Number(item[key]) || 0), 0)
}

export function presupuestoStatus(porcentaje) {
  if (porcentaje >= 100) return { label: 'Excedido', clase: 'badge-red', color: '#ef4444' }
  if (porcentaje >= 80) return { label: 'Alerta', clase: 'badge-yellow', color: '#f59e0b' }
  return { label: 'En control', clase: 'badge-green', color: '#10b981' }
}

export function calcularPorcentaje(gastado, limite) {
  if (!limite || limite === 0) return 0
  return Math.round((gastado / limite) * 100)
}
