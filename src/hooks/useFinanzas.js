import { useState, useEffect, useCallback, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { SHEETS, COLORES_GRAFICA, CATEGORIAS_FIJAS_NOMBRES, TODAS_CATEGORIAS } from '../config'
import { useSheets } from './useSheets'
import { parseMonto, nombreMes } from '../lib/formatters'
import { groupBy, sumBy, calcularPorcentaje, presupuestoStatus } from '../lib/utils'

export function useFinanzas(mes, año) {
  const { isAuthenticated } = useContext(AuthContext)
  const { get } = useSheets()

  const [data, setData] = useState({
    transacciones: [],
    ingresos: [],
    presupuesto: [],
    mura: [],
    inversiones: [],
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    if (!isAuthenticated) return
    setLoading(true)
    setError(null)
    try {
      const [transacciones, ingresos, presupuesto, mura, inversiones] = await Promise.all([
        get(SHEETS.TRANSACCIONES),
        get(SHEETS.INGRESOS),
        get(SHEETS.PRESUPUESTO),
        get(SHEETS.MURA),
        get(SHEETS.INVERSIONES),
      ])
      setData({ transacciones, ingresos, presupuesto, mura, inversiones })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, get])

  useEffect(() => { fetchAll() }, [fetchAll])

  // --- Filtros por mes/año ---
  const txDelMes = data.transacciones.filter(
    (t) => String(t.Mes) === String(mes) && String(t.Año) === String(año)
  )
  const ingresosDelMes = data.ingresos.filter(
    (i) => String(i.Mes) === String(mes) && String(i.Año) === String(año)
  )
  const presupuestoDelMes = data.presupuesto.filter(
    (p) => String(p.Mes) === String(mes) && String(p.Año) === String(año)
  )
  const muraDelMes = data.mura.filter(
    (m) => String(m.Mes) === String(mes) && String(m.Año) === String(año)
  )
  const inversionesDelMes = data.inversiones.filter(
    (i) => String(i.Mes) === String(mes) && String(i.Año) === String(año)
  )

  // --- Resumen del mes ---
  const totalIngresos = sumBy(ingresosDelMes, 'Monto')
  const totalGastos = sumBy(txDelMes, 'Monto')
  const ahorradoDelMes = sumBy(inversionesDelMes.filter((i) => i.Acción === 'Depósito'), 'Monto')
  const saldoDisponible = totalIngresos - totalGastos - ahorradoDelMes

  const ingresosDelMesAnterior = data.ingresos.filter(
    (i) => String(i.Mes) === String(mes - 1) && String(i.Año) === String(año)
  )
  const txMesAnterior = data.transacciones.filter(
    (t) => String(t.Mes) === String(mes - 1) && String(t.Año) === String(año)
  )
  const totalIngresosMesAnterior = sumBy(ingresosDelMesAnterior, 'Monto')
  const totalGastosMesAnterior = sumBy(txMesAnterior, 'Monto')

  // --- Gastos por categoría + inversiones (para torta) ---
  const gastosBase = Object.entries(groupBy(txDelMes, 'Categoría'))
    .map(([name, rows], i) => ({
      name,
      value: sumBy(rows, 'Monto'),
      color: COLORES_GRAFICA[i % COLORES_GRAFICA.length],
    }))
  const gastosPorCategoria = [
    ...gastosBase,
    ...(ahorradoDelMes > 0
      ? [{ name: 'Inversiones / Ahorros', value: ahorradoDelMes, color: '#8b5cf6' }]
      : []),
  ].sort((a, b) => b.value - a.value)

  // --- Presupuesto vs Real con carry-forward para categorías fijas ---
  const presupuestoVsReal = (() => {
    const currentMap = Object.fromEntries(presupuestoDelMes.map((p) => [p.Categoría, p]))

    // Para fijos sin entrada este mes, buscar el último valor histórico
    const carryForward = CATEGORIAS_FIJAS_NOMBRES
      .filter((cat) => !currentMap[cat])
      .map((cat) => {
        const history = data.presupuesto
          .filter((p) => p.Categoría === cat)
          .sort((a, b) => (Number(b.Año) * 12 + Number(b.Mes)) - (Number(a.Año) * 12 + Number(a.Mes)))
        return history.length > 0 ? { ...history[0], Mes: mes, Año: año, _carryForward: true } : null
      })
      .filter(Boolean)

    return [...presupuestoDelMes, ...carryForward].map((p) => {
      const gastado = sumBy(txDelMes.filter((t) => t.Categoría === p.Categoría), 'Monto')
      const limite = parseMonto(p.Límite_COP)
      const pendiente = Math.max(0, limite - gastado)
      const porcentaje = calcularPorcentaje(gastado, limite)
      const status = presupuestoStatus(porcentaje)
      return {
        categoria: p.Categoría,
        limite,
        gastado,
        pendiente,
        porcentaje,
        esFijo: CATEGORIAS_FIJAS_NOMBRES.includes(p.Categoría),
        carryForward: p._carryForward || false,
        ...status,
      }
    })
  })()

  // --- Tendencia desde Enero 2026 (stacked bar) ---
  const START_YEAR = 2026, START_MONTH = 1
  const allMonths = []
  let _y = START_YEAR, _m = START_MONTH
  while (_y < año || (_y === año && _m <= mes)) {
    allMonths.push({ year: _y, month: _m })
    _m++; if (_m > 12) { _m = 1; _y++ }
  }

  const TODAS_CATS = TODAS_CATEGORIAS.map((c) => c.nombre)

  const tendenciaMensual = allMonths.map(({ year, month }) => {
    const txM = data.transacciones.filter((t) => String(t.Mes) === String(month) && String(t.Año) === String(year))
    const ingM = data.ingresos.filter((t) => String(t.Mes) === String(month) && String(t.Año) === String(year))
    const invM = data.inversiones.filter((t) => String(t.Mes) === String(month) && String(t.Año) === String(year) && t.Acción === 'Depósito')
    const entry = {
      label: `${nombreMes(month).slice(0, 3)}`,
      ingresos: sumBy(ingM, 'Monto'),
      gastos: sumBy(txM, 'Monto'),
      ahorros: sumBy(invM, 'Monto'),
    }
    TODAS_CATS.forEach((cat) => {
      entry[cat] = sumBy(txM.filter((t) => (t['Categoría'] || t.Categoria) === cat), 'Monto')
    })
    return entry
  }).filter((e) => e.ingresos > 0 || e.gastos > 0)

  // --- Mura P&L ---
  const muraIngresos = sumBy(muraDelMes.filter((m) => m.Tipo === 'Ingreso'), 'Monto')
  const muraGastos = sumBy(muraDelMes.filter((m) => m.Tipo === 'Gasto'), 'Monto')
  const muraProfit = muraIngresos - muraGastos
  const muraProfitMargen = muraIngresos > 0 ? Math.round((muraProfit / muraIngresos) * 100) : 0

  // --- Inversiones / Ahorros ---
  const inversionesPorTipo = groupBy(data.inversiones, 'Tipo')
  const saldoPorTipo = Object.entries(inversionesPorTipo).map(([tipo, rows]) => ({
    tipo,
    saldo: parseMonto(rows[rows.length - 1]?.Saldo_Actual || 0),
    movimientos: rows.length,
  }))
  const totalAhorros = saldoPorTipo.reduce((s, t) => s + t.saldo, 0)

  return {
    loading, error, refresh: fetchAll,
    transacciones: txDelMes,
    ingresos: ingresosDelMes,
    todasTransacciones: data.transacciones,
    todosIngresos: data.ingresos,
    todasInversiones: data.inversiones,
    todosMura: data.mura,
    totalIngresos, totalGastos, saldoDisponible, ahorradoDelMes,
    totalIngresosMesAnterior, totalGastosMesAnterior,
    gastosPorCategoria, presupuestoVsReal, tendenciaMensual,
    muraIngresos, muraGastos, muraProfit, muraProfitMargen, muraDelMes,
    saldoPorTipo, totalAhorros,
    // Para validación de presupuesto en formulario
    presupuestoMap: Object.fromEntries(presupuestoVsReal.map((p) => [p.categoria, p])),
  }
}
