import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { CurrencyInput } from '../ui/CurrencyInput'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { TIPOS_INVERSION } from '../../config'
import { todayISO } from '../../lib/formatters'

export function FormInversion({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    fecha: todayISO(),
    tipo: '',
    entidad: '',
    descripcion: '',
    monto: '',
    accion: 'Depósito',
    saldoActual: '',
    notas: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.tipo || !form.monto || !form.saldoActual) { setError('Type, amount and current balance are required'); return }
    setLoading(true); setError('')
    try {
      await onSave({ ...form, monto: Number(form.monto), saldoActual: Number(form.saldoActual) })
      setForm({ fecha: todayISO(), tipo: '', entidad: '', descripcion: '', monto: '', accion: 'Depósito', saldoActual: '', notas: '' })
      onClose()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="New investment / savings entry">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Date" type="date" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} />
          <Select label="Type" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
            <option value="">Select...</option>
            {TIPOS_INVERSION.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Institution" placeholder="e.g. Bancolombia, Nubank..." value={form.entidad} onChange={(e) => set('entidad', e.target.value)} />
          <Select label="Action" value={form.accion} onChange={(e) => set('accion', e.target.value)}>
            <option value="Depósito">Deposit</option>
            <option value="Retiro">Withdrawal</option>
          </Select>
        </div>
        <Input label="Description" placeholder="e.g. Vacation fund, ETF shares..." value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <CurrencyInput label="Amount" value={form.monto} onChange={(v) => set('monto', v)} />
          <CurrencyInput label="Current balance" value={form.saldoActual} onChange={(v) => set('saldoActual', v)} />
        </div>
        <Input label="Notes (optional)" value={form.notas} onChange={(e) => set('notas', e.target.value)} />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={loading}>Save</Button>
        </div>
      </form>
    </Modal>
  )
}
