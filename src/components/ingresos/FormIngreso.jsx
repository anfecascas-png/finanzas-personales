import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { CurrencyInput } from '../ui/CurrencyInput'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { FUENTES_INGRESO } from '../../config'
import { todayISO } from '../../lib/formatters'

const CONCEPTOS = {
  Salario: ['Paycheck 1', 'Paycheck 2', 'Full salary', 'Bonus', 'Bonus/Premium', 'Other'],
  'Mura Café': ['Profit withdrawal', 'Monthly sales', 'Event payment', 'Other Mura income'],
  Otro: [],
}

export function FormIngreso({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    fecha: todayISO(),
    fuente: 'Salario',
    concepto: '',
    monto: '',
    notas: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
      ...(field === 'fuente' ? { concepto: '' } : {}),
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.monto) { setError('Amount is required'); return }
    setLoading(true); setError('')
    try {
      const notaFinal = [form.concepto, form.notas].filter(Boolean).join(' · ')
      await onSave({ ...form, monto: Number(form.monto), notas: notaFinal })
      setForm({ fecha: todayISO(), fuente: 'Salario', concepto: '', monto: '', notas: '' })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const opciones = CONCEPTOS[form.fuente] || []

  return (
    <Modal open={open} onClose={onClose} title="Add income">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date" type="date" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} />
          <Select label="Source" value={form.fuente} onChange={(e) => set('fuente', e.target.value)}>
            {FUENTES_INGRESO.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
        </div>

        {opciones.length > 0 && (
          <Select label="Concept" value={form.concepto} onChange={(e) => set('concepto', e.target.value)}>
            <option value="">Select concept...</option>
            {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
        )}

        {form.fuente === 'Mura Café' && (
          <div className="bg-orange-50 rounded-xl px-4 py-3 text-xs text-orange-700">
            Remember you can also record full details in the <strong>Mura Café</strong> section to see the P&L.
          </div>
        )}

        <CurrencyInput
          label="Amount"
          value={form.monto}
          onChange={(v) => set('monto', v)}
        />

        <Input
          label="Additional notes (optional)"
          placeholder={form.fuente === 'Mura Café' ? 'e.g. Week of Jan 1–15...' : 'e.g. Includes overtime...'}
          value={form.notas}
          onChange={(e) => set('notas', e.target.value)}
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}
