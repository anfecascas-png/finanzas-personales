import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PLMura } from '../components/mura/PLMura'
import { TablaMura } from '../components/mura/TablaMura'
import { FormMura } from '../components/mura/FormMura'
import { useFinanzas } from '../hooks/useFinanzas'
import { useSheets } from '../hooks/useSheets'

export function MuraCafe({ mes, año, onMesChange, onAñoChange }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { muraIngresos, muraGastos, muraProfit, muraProfitMargen, muraDelMes, loading, refresh } = useFinanzas(mes, año)
  const { addMovimientoMura, deleteMovimientoMura } = useSheets()

  async function handleSave(data) {
    await addMovimientoMura(data)
    await refresh()
  }

  async function handleDelete(rowIndex) {
    if (!confirm('¿Eliminar este movimiento?')) return
    await deleteMovimientoMura(rowIndex)
    await refresh()
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar mes={mes} año={año} onMesChange={onMesChange} onAñoChange={onAñoChange} title="Mura Café" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <PLMura
          muraIngresos={muraIngresos}
          muraGastos={muraGastos}
          muraProfit={muraProfit}
          muraProfitMargen={muraProfitMargen}
          loading={loading}
        />

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Movimientos del mes</h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="icon" onClick={refresh}><RefreshCw size={15} /></Button>
              <Button variant="mura" onClick={() => setModalOpen(true)}><Plus size={15} /> Nuevo movimiento</Button>
            </div>
          </div>
          <TablaMura rows={muraDelMes} onDelete={handleDelete} loading={loading} />
        </Card>
      </div>

      <FormMura open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  )
}
