import { useState } from 'react'
import { History } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { CurrencyInput } from '../ui/CurrencyInput'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { TODAS_CATEGORIAS, RANGOS_MONTO, CATEGORIAS_FIJAS_NOMBRES } from '../../config'
import { todayISO, formatCOP } from '../../lib/formatters'
import { cn } from '../../lib/utils'

const TIPOS_GASTO = ['Fijo', 'Variable']
const FRECUENCIAS = ['Mensual', 'Trimestral', 'Semestral', 'Anual']

const EMPTY = {
  fecha: todayISO(),
  descripcion: '',
  monto: '',
  rangoIdx: '',
  categoria: '',
  subcategoria: '',
  tipoGasto: 'Variable',
  frecuencia: 'Mensual',
  notas: '',
}

function parseFrecuenciaDeNotas(notas) {
  const match = notas?.match(/^\[(Trimestral|Semestral|Anual)\]/)
  return match ? match[1] : 'Mensual'
}

export function FormTransaccion({ open, onClose, onSave, recientes = [], presupuestoMap = {} }) {
  const [form, setForm] = useState({ ...EMPTY, fecha: todayISO() })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRecientes, setShowRecientes] = useState(false)
  const [justificacion, setJustificacion] = useState('')
  const [showJustificacion, setShowJustificacion] = useState(false)

  const categoriaActual = TODAS_CATEGORIAS.find((c) => c.nombre === form.categoria)
  const esCategoriaFija = CATEGORIAS_FIJAS_NOMBRES.includes(form.categoria)

  // Budget check for fixed categories
  const presupuestoCategoria = presupuestoMap[form.categoria]
  const montoNum = Number(form.monto) || 0
  const excedeLimite = esCategoriaFija && presupuestoCategoria && montoNum > presupuestoCategoria.limite && presupuestoCategoria.limite > 0

  function set(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
      ...(field === 'categoria' ? { subcategoria: '' } : {}),
    }))
  }

  function setRango(idx) {
    const rango = RANGOS_MONTO[idx]
    setForm((f) => ({ ...f, rangoIdx: idx, monto: rango ? String(rango.value) : '' }))
  }

  function aplicarReciente(tx) {
    const freq = parseFrecuenciaDeNotas(tx.Notas)
    const notaLimpia = tx.Notas?.replace(/^\[(Trimestral|Semestral|Anual)\] · ?/, '').replace(/^\[(Trimestral|Semestral|Anual)\]/, '') || ''
    setForm({
      fecha: todayISO(),
      descripcion: tx.Descripción || '',
      monto: tx.Monto || '',
      rangoIdx: '',
      categoria: tx.Categoría || '',
      subcategoria: tx.Subcategoría || '',
      tipoGasto: tx.Tipo_Gasto || 'Variable',
      frecuencia: freq,
      notas: notaLimpia,
    })
    setShowRecientes(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.descripcion || !form.monto || !form.categoria) {
      setError('Description, amount and category are required')
      return
    }

    // Budget validation for fixed categories
    if (excedeLimite && !showJustificacion) {
      setShowJustificacion(true)
      return
    }
    if (excedeLimite && !justificacion.trim()) {
      setError('Justification is required to exceed the fixed budget limit')
      return
    }

    setLoading(true)
    setError('')
    try {
      const notaFinal = [
        form.frecuencia !== 'Mensual' ? `[${form.frecuencia}]` : '',
        excedeLimite && justificacion ? `[Excede límite: ${justificacion}]` : '',
        form.notas,
      ].filter(Boolean).join(' · ')

      await onSave({ ...form, monto: Number(form.monto), notas: notaFinal })
      setForm({ ...EMPTY, fecha: todayISO() })
      setJustificacion('')
      setShowJustificacion(false)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const equiv = (() => {
    if (!form.monto || form.frecuencia === 'Mensual') return null
    const divisor = { Trimestral: 3, Semestral: 6, Anual: 12 }[form.frecuencia]
    return Math.round(Number(form.monto) / divisor)
  })()

  // Last 20 unique by description
  const recientesUnicos = recientes
    .slice()
    .reverse()
    .filter((tx, i, arr) => arr.findIndex((t) => t.Descripción === tx.Descripción) === i)
    .slice(0, 20)

  return (
    <Modal open={open} onClose={onClose} title="New transaction" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Repeat recent button */}
        {recientesUnicos.length > 0 && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRecientes((v) => !v)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-xs text-gray-500 dark:text-gray-400 hover:border-brand-400 hover:text-brand-600 transition-colors"
            >
              <History size={13} />
              Repeat recent transaction
            </button>

            {showRecientes && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
                {recientesUnicos.map((tx, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => aplicarReciente(tx)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{tx.Descripción}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{tx.Categoría} · {tx.Subcategoría}</p>
                    </div>
                    <span className="text-sm font-semibold text-red-500 dark:text-red-400 tabular-nums shrink-0">
                      {formatCOP(tx.Monto)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <Input label="Date" type="date" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} />

        {/* Amount range */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Amount range</label>
          <div className="flex flex-wrap gap-1.5">
            {RANGOS_MONTO.map((r, idx) => (
              <button key={idx} type="button" onClick={() => setRango(idx)}
                className={cn('px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors',
                  form.rangoIdx === idx
                    ? 'bg-brand-500 border-brand-500 text-white'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-brand-300 hover:text-brand-600'
                )}>{r.label}</button>
            ))}
          </div>
        </div>

        {/* Exact amount (editable) */}
        <CurrencyInput
          label="Exact amount (COP)"
          value={form.monto}
          onChange={(v) => set('monto', v)}
        />

        <Input label="Description" placeholder="e.g. Rappi, Netflix, Groceries..." value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />

        <div className="grid grid-cols-2 gap-3">
          <Select label="Category" value={form.categoria} onChange={(e) => set('categoria', e.target.value)}>
            <option value="">Select...</option>
            {TODAS_CATEGORIAS.map((c) => (
              <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
            ))}
          </Select>
          <Select label="Subcategory" value={form.subcategoria} onChange={(e) => set('subcategoria', e.target.value)} disabled={!categoriaActual}>
            <option value="">Select...</option>
            {categoriaActual?.subcategorias.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Expense type" value={form.tipoGasto} onChange={(e) => set('tipoGasto', e.target.value)}>
            {TIPOS_GASTO.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Select label="Frequency" value={form.frecuencia} onChange={(e) => set('frecuencia', e.target.value)}>
            {FRECUENCIAS.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
        </div>

        {equiv && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-2.5 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <span>💡</span>
            <span>Equivalent to <strong>${equiv.toLocaleString('es-CO')}/month</strong> — the full amount is recorded on payment day.</span>
          </div>
        )}

        {/* Fixed budget exceeded alert */}
        {excedeLimite && (
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl px-4 py-3 text-xs text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
            <p className="font-semibold mb-1">⚠️ Exceeds fixed budget for {form.categoria}</p>
            <p>Limit: {formatCOP(presupuestoCategoria.limite)} — Amount: {formatCOP(montoNum)}</p>
          </div>
        )}

        {/* Justification when limit exceeded */}
        {showJustificacion && excedeLimite && (
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
              Justification (required to exceed the limit)
            </label>
            <input
              type="text"
              placeholder="e.g. Emergency repair, annual price..."
              value={justificacion}
              onChange={(e) => setJustificacion(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-orange-300 dark:border-orange-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        )}

        <Input label="Notes (optional)" placeholder="Observations..." value={form.notas} onChange={(e) => set('notas', e.target.value)} />

        {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}

        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>
            {excedeLimite && !showJustificacion ? 'Continue →' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
