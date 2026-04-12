import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Button } from '../components/ui/Button'
import { TarjetaPresupuesto } from '../components/presupuesto/TarjetaPresupuesto'
import { FormPresupuesto } from '../components/presupuesto/FormPresupuesto'
import { useFinanzas } from '../hooks/useFinanzas'
import { useSheets } from '../hooks/useSheets'

export function Presupuesto({ mes, año, onMesChange, onAñoChange }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editando, setEditando] = useState(null)

  const { presupuestoVsReal, loading, refresh } = useFinanzas(mes, año)
  const { upsertPresupuesto } = useSheets()

  async function handleSave(data) {
    await upsertPresupuesto(data)
    await refresh()
  }

  function handleEditar(item) {
    setEditando(item)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditando(null)
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar mes={mes} año={año} onMesChange={onMesChange} onAñoChange={onAñoChange} title="Presupuesto" />

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Límites por categoría</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500">Los fijos se heredan automáticamente del mes anterior</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="icon" onClick={refresh}><RefreshCw size={15} /></Button>
            <Button onClick={() => setModalOpen(true)}><Plus size={15} /> Agregar límite</Button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 bg-gray-50 dark:bg-gray-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : presupuestoVsReal.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">No hay límites definidos para este mes</p>
            <Button onClick={() => setModalOpen(true)}><Plus size={15} /> Crear mi primer límite</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {presupuestoVsReal.map((item) => (
              <TarjetaPresupuesto
                key={item.categoria}
                {...item}
                onEditar={() => handleEditar(item)}
              />
            ))}
          </div>
        )}
      </div>

      <FormPresupuesto
        open={modalOpen}
        onClose={handleClose}
        onSave={handleSave}
        mes={mes}
        año={año}
        existente={editando}
      />
    </div>
  )
}
