import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { CurrencyInput } from '../ui/CurrencyInput'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { CATEGORIAS_MURA } from '../../config'
import { todayISO } from '../../lib/formatters'

export function FormMura({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    fecha: todayISO(),
    concepto: '',
    tipo: 'Ingreso',
    monto: '',
    categoriaMura: '',
    notas: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.concepto || !form.monto) { setError('Concepto y monto son obligatorios'); return }
    setLoading(true); setError('')
    try {
      await onSave({ ...form, monto: Number(form.monto) })
      setForm({ fecha: todayISO(), concepto: '', tipo: 'Ingreso', monto: '', categoriaMura: '', notas: '' })
      onClose()
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Nuevo movimiento — Mura Café">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Fecha" type="date" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} />
          <Select label="Tipo" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
            <option value="Ingreso">Ingreso</option>
            <option value="Gasto">Gasto</option>
          </Select>
        </div>
        <Input label="Concepto" placeholder="ej. Venta cafés, Compra insumos..." value={form.concepto} onChange={(e) => set('concepto', e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <CurrencyInput label="Monto" value={form.monto} onChange={(v) => set('monto', v)} />
          <Select label="Categoría" value={form.categoriaMura} onChange={(e) => set('categoriaMura', e.target.value)}>
            <option value="">Seleccionar...</option>
            {CATEGORIAS_MURA.map((c) => <option key={c} value={c}>{c}</option>)}
          </Select>
        </div>
        <Input label="Notas (opcional)" value={form.notas} onChange={(e) => set('notas', e.target.value)} />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="mura" loading={loading}>Guardar</Button>
        </div>
      </form>
    </Modal>
  )
}
