import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { TablaTransacciones } from '../components/transacciones/TablaTransacciones'
import { FormTransaccion } from '../components/transacciones/FormTransaccion'
import { FiltrosTransacciones } from '../components/transacciones/FiltrosTransacciones'
import { TablaIngresos } from '../components/ingresos/TablaIngresos'
import { FormIngreso } from '../components/ingresos/FormIngreso'
import { useFinanzas } from '../hooks/useFinanzas'
import { useSheets } from '../hooks/useSheets'
import { formatCOP } from '../lib/formatters'
import { cn } from '../lib/utils'

const TABS = [
  { id: 'gastos', label: 'Expenses' },
  { id: 'ingresos', label: 'Income' },
]

export function Transacciones({ mes, año, onMesChange, onAñoChange }) {
  const [tab, setTab] = useState('gastos')
  const [modalGasto, setModalGasto] = useState(false)
  const [modalIngreso, setModalIngreso] = useState(false)
  const [search, setSearch] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState('')
  const [tipoFiltro, setTipoFiltro] = useState('')

  const { transacciones, ingresos, todasTransacciones, totalGastos, totalIngresos, presupuestoMap, loading, refresh } = useFinanzas(mes, año)
  const { addTransaccion, deleteTransaccion, addIngreso, deleteIngreso } = useSheets()

  const gastosFiltered = transacciones.filter((t) => {
    const matchSearch = !search || t.Descripción?.toLowerCase().includes(search.toLowerCase())
    const matchCat = !categoriaFiltro || t.Categoría === categoriaFiltro
    const matchTipo = !tipoFiltro || t.Tipo_Gasto === tipoFiltro
    return matchSearch && matchCat && matchTipo
  })

  async function handleSaveGasto(data) { await addTransaccion(data); await refresh() }
  async function handleDeleteGasto(rowIndex) {
    if (!confirm('Delete this expense?')) return
    await deleteTransaccion(rowIndex); await refresh()
  }
  async function handleSaveIngreso(data) { await addIngreso(data); await refresh() }
  async function handleDeleteIngreso(rowIndex) {
    if (!confirm('Delete this income?')) return
    await deleteIngreso(rowIndex); await refresh()
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar mes={mes} año={año} onMesChange={onMesChange} onAñoChange={onAñoChange} title="Transactions" />

      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 pb-24 md:pb-6">

        {/* Resumen rápido — columnas en mobile */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl px-4 py-3">
            <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Ingresos</p>
            <p className="text-base font-bold text-green-700 dark:text-green-400 tabular-nums leading-tight">{formatCOP(totalIngresos)}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl px-4 py-3">
            <p className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">Gastos</p>
            <p className="text-base font-bold text-red-600 dark:text-red-400 tabular-nums leading-tight">{formatCOP(totalGastos)}</p>
          </div>
        </div>

        {/* Tabs + acciones */}
        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl flex-1 md:flex-none">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={cn(
                  'flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                  tab === id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Botones */}
          <Button variant="secondary" size="icon" onClick={refresh} title="Refrescar" className="shrink-0">
            <RefreshCw size={15} />
          </Button>
          {tab === 'gastos' ? (
            <Button onClick={() => setModalGasto(true)} className="shrink-0">
              <Plus size={15} />
              <span className="hidden sm:inline">Nuevo gasto</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          ) : (
            <Button onClick={() => setModalIngreso(true)} className="shrink-0">
              <Plus size={15} />
              <span className="hidden sm:inline">Nuevo ingreso</span>
              <span className="sm:hidden">Nuevo</span>
            </Button>
          )}
        </div>

        {/* Contenido */}
        {tab === 'gastos' && (
          <Card className="!p-4 md:!p-6">
            <div className="mb-4">
              <FiltrosTransacciones
                search={search} onSearch={setSearch}
                categoriaFiltro={categoriaFiltro} onCategoria={setCategoriaFiltro}
                tipoFiltro={tipoFiltro} onTipo={setTipoFiltro}
              />
            </div>
            <TablaTransacciones rows={gastosFiltered} onDelete={handleDeleteGasto} loading={loading} />
          </Card>
        )}

        {tab === 'ingresos' && (
          <Card className="!p-4 md:!p-6">
            <TablaIngresos rows={ingresos} onDelete={handleDeleteIngreso} loading={loading} />
          </Card>
        )}
      </div>

      <FormTransaccion
        open={modalGasto}
        onClose={() => setModalGasto(false)}
        onSave={handleSaveGasto}
        recientes={todasTransacciones}
        presupuestoMap={presupuestoMap}
      />
      <FormIngreso open={modalIngreso} onClose={() => setModalIngreso(false)} onSave={handleSaveIngreso} />
    </div>
  )
}
