import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { ResumenInversiones } from '../components/inversiones/ResumenInversiones'
import { TablaMovimientos } from '../components/inversiones/TablaMovimientos'
import { FormInversion } from '../components/inversiones/FormInversion'
import { useFinanzas } from '../hooks/useFinanzas'
import { useSheets } from '../hooks/useSheets'

export function Inversiones({ mes, año, onMesChange, onAñoChange }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { todasInversiones, saldoPorTipo, totalAhorros, loading, refresh } = useFinanzas(mes, año)
  const { addInversion, deleteInversion } = useSheets()

  async function handleSave(data) {
    await addInversion(data)
    await refresh()
  }

  async function handleDelete(rowIndex) {
    if (!confirm('¿Eliminar este movimiento?')) return
    await deleteInversion(rowIndex)
    await refresh()
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar mes={mes} año={año} onMesChange={onMesChange} onAñoChange={onAñoChange} title="Inversiones & Ahorros" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <ResumenInversiones saldoPorTipo={saldoPorTipo} totalAhorros={totalAhorros} loading={loading} />

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Historial de movimientos</h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="icon" onClick={refresh}><RefreshCw size={15} /></Button>
              <Button onClick={() => setModalOpen(true)}><Plus size={15} /> Nuevo movimiento</Button>
            </div>
          </div>
          <TablaMovimientos rows={todasInversiones} onDelete={handleDelete} loading={loading} />
        </Card>
      </div>

      <FormInversion open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} />
    </div>
  )
}
