import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Input } from '../ui/Input'
import { CurrencyInput } from '../ui/CurrencyInput'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { CATEGORIAS_VARIABLES, CATEGORIAS_FIJAS } from '../../config'

const TODAS = [...CATEGORIAS_FIJAS, ...CATEGORIAS_VARIABLES]

export function FormPresupuesto({ open, onClose, onSave, mes, año, existente }) {
  const [form, setForm] = useState({
    categoria: existente?.categoria || '',
    limite: existente?.limite || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.categoria || !form.limite) { setError('Todos los campos son obligatorios'); return }
    setLoading(true)
    setError('')
    try {
      await onSave({ mes, año, categoria: form.categoria, limite: Number(form.limite) })
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={existente ? 'Editar límite' : 'Definir límite de presupuesto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label="Categoría" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))} disabled={!!existente}>
          <option value="">Seleccionar categoría...</option>
          {TODAS.map((c) => <option key={c.nombre} value={c.nombre}>{c.nombre}</option>)}
        </Select>
        <CurrencyInput
          label="Límite mensual"
          value={form.limite}
          onChange={(v) => setForm((f) => ({ ...f, limite: v }))}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>Guardar límite</Button>
        </div>
      </form>
    </Modal>
  )
}
