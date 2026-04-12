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
    if (!form.tipo || !form.monto || !form.saldoActual) { setError('Tipo, monto y saldo actual son obligatorios'); return }
    setLoading(true); setError('')
    try {
      await onSave({ ...form, monto: Number(form.monto), saldoActual: Number(form.saldoActual) })
      setForm({ fecha: todayISO(), tipo: '', entidad: '', descripcion: '', monto: '', accion: 'Depósito', saldoActual: '', notas: '' })
      onClose()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuevo movimiento de inversión / ahorro">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Fecha" type="date" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} />
          <Select label="Tipo" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
            <option value="">Seleccionar...</option>
            {TIPOS_INVERSION.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Entidad" placeholder="ej. Bancolombia, Nubank..." value={form.entidad} onChange={(e) => set('entidad', e.target.value)} />
          <Select label="Acción" value={form.accion} onChange={(e) => set('accion', e.target.value)}>
            <option value="Depósito">Depósito</option>
            <option value="Retiro">Retiro</option>
          </Select>
        </div>
        <Input label="Descripción" placeholder="ej. Bolsillo vacaciones, Acciones ETF..." value={form.descripcion} onChange={(e) => set('descripcion', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <CurrencyInput label="Monto" value={form.monto} onChange={(v) => set('monto', v)} />
          <CurrencyInput label="Saldo actual" value={form.saldoActual} onChange={(v) => set('saldoActual', v)} />
        </div>
        <Input label="Notas (opcional)" value={form.notas} onChange={(e) => set('notas', e.target.value)} />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>Guardar</Button>
        </div>
      </form>
    </Modal>
  )
}
