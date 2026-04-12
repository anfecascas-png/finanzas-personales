import { ResumenCards } from '../components/dashboard/ResumenCards'
import { GraficaTorta } from '../components/dashboard/GraficaTorta'
import { GraficaPresupuesto } from '../components/dashboard/GraficaPresupuesto'
import { GraficaTendencia } from '../components/dashboard/GraficaTendencia'
import { MiniMura } from '../components/dashboard/MiniMura'
import { Insights } from '../components/dashboard/Insights'
import { TopBar } from '../components/layout/TopBar'
import { useFinanzas } from '../hooks/useFinanzas'
import { generarInsights } from '../lib/insights'

export function Dashboard({ mes, año, onMesChange, onAñoChange }) {
  const f = useFinanzas(mes, año)

  const insights = f.loading ? [] : generarInsights({
    totalIngresos: f.totalIngresos,
    totalGastos: f.totalGastos,
    saldoDisponible: f.saldoDisponible,
    ahorradoDelMes: f.ahorradoDelMes,
    gastosPorCategoria: f.gastosPorCategoria,
    presupuestoVsReal: f.presupuestoVsReal,
    tendenciaMensual: f.tendenciaMensual,
    muraProfit: f.muraProfit,
    muraProfitMargen: f.muraProfitMargen,
  })

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <TopBar mes={mes} año={año} onMesChange={onMesChange} onAñoChange={onAñoChange} title="Dashboard" />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {f.error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl text-sm text-red-600 dark:text-red-400">
            Error cargando datos: {f.error}
          </div>
        )}

        <ResumenCards
          totalIngresos={f.totalIngresos}
          totalGastos={f.totalGastos}
          saldoDisponible={f.saldoDisponible}
          ahorradoDelMes={f.ahorradoDelMes}
          totalAhorros={f.totalAhorros}
          totalIngresosMesAnterior={f.totalIngresosMesAnterior}
          totalGastosMesAnterior={f.totalGastosMesAnterior}
          loading={f.loading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GraficaTorta data={f.gastosPorCategoria} loading={f.loading} />
          <GraficaPresupuesto data={f.presupuestoVsReal} loading={f.loading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GraficaTendencia data={f.tendenciaMensual} loading={f.loading} />
          </div>
          <MiniMura
            muraIngresos={f.muraIngresos}
            muraGastos={f.muraGastos}
            muraProfit={f.muraProfit}
            muraProfitMargen={f.muraProfitMargen}
            loading={f.loading}
          />
        </div>

        <Insights insights={insights} loading={f.loading} />
      </div>
    </div>
  )
}
