import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { CurrencyInput } from '../ui/CurrencyInput'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { FUENTES_INGRESO } from '../../config'
import { todayISO } from '../../lib/formatters'

const CONCEPTOS = {
  Salario: ['Quincena 1', 'Quincena 2', 'Salario completo', 'Bonificación', 'Prima', 'Otro'],
  'Mura Café': ['Retiro de utilidades', 'Venta del mes', 'Pago evento', 'Otro ingreso Mura'],
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
    if (!form.monto) { setError('El monto es obligatorio'); return }
    setLoading(true); setError('')
    try {
      // Guardamos concepto en notas si hay, combinado con notas adicionales
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
    <Modal open={open} onClose={onClose} title="Registrar ingreso">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input label="Fecha" type="date" value={form.fecha} onChange={(e) => set('fecha', e.target.value)} />
          <Select label="Fuente" value={form.fuente} onChange={(e) => set('fuente', e.target.value)}>
            {FUENTES_INGRESO.map((f) => <option key={f} value={f}>{f}</option>)}
          </Select>
        </div>

        {/* Concepto según fuente */}
        {opciones.length > 0 && (
          <Select label="Concepto" value={form.concepto} onChange={(e) => set('concepto', e.target.value)}>
            <option value="">Seleccionar concepto...</option>
            {opciones.map((o) => <option key={o} value={o}>{o}</option>)}
          </Select>
        )}

        {/* Para Mura: campo libre adicional */}
        {form.fuente === 'Mura Café' && (
          <div className="bg-orange-50 rounded-xl px-4 py-3 text-xs text-orange-700">
            Recuerda que también puedes registrar el detalle completo en la sección <strong>Mura Café</strong> para ver el P&L.
          </div>
        )}

        <CurrencyInput
          label="Monto"
          value={form.monto}
          onChange={(v) => set('monto', v)}
        />

        <Input
          label="Notas adicionales (opcional)"
          placeholder={form.fuente === 'Mura Café' ? 'ej. Semana del 1 al 15...' : 'ej. Incluye horas extra...'}
          value={form.notas}
          onChange={(e) => set('notas', e.target.value)}
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>Guardar ingreso</Button>
        </div>
      </form>
    </Modal>
  )
}
