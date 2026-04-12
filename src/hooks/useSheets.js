import { useCallback, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { SHEETS, HEADERS } from '../config'
import {
  getValues,
  appendRow,
  updateRow,
  deleteRow,
  getSpreadsheet,
} from '../lib/googleSheets'
import { rowsToObjects, generateId } from '../lib/utils'
import { todayISO, mesActual, añoActual } from '../lib/formatters'

export function useSheets() {
  const { accessToken, spreadsheetId } = useContext(AuthContext)

  const get = useCallback(
    async (sheet) => {
      const res = await getValues(accessToken, spreadsheetId, `${sheet}!A:Z`)
      return rowsToObjects(res.values || [])
    },
    [accessToken, spreadsheetId]
  )

  const getSheetIds = useCallback(async () => {
    const meta = await getSpreadsheet(accessToken, spreadsheetId)
    const ids = {}
    for (const s of meta.sheets || []) {
      ids[s.properties.title] = s.properties.sheetId
    }
    return ids
  }, [accessToken, spreadsheetId])

  // --- Transacciones ---
  const addTransaccion = useCallback(
    async ({ fecha, descripcion, monto, categoria, subcategoria, tipoGasto, notas = '' }) => {
      const id = generateId()
      const mes = mesActual()
      const año = añoActual()
      await appendRow(accessToken, spreadsheetId, `${SHEETS.TRANSACCIONES}!A:J`, [
        fecha || todayISO(),
        descripcion,
        monto,
        categoria,
        subcategoria,
        tipoGasto,
        mes,
        año,
        id,
        notas,
      ])
    },
    [accessToken, spreadsheetId]
  )

  const deleteTransaccion = useCallback(
    async (rowIndex) => {
      const ids = await getSheetIds()
      await deleteRow(accessToken, spreadsheetId, ids[SHEETS.TRANSACCIONES], rowIndex)
    },
    [accessToken, spreadsheetId, getSheetIds]
  )

  // --- Ingresos ---
  const addIngreso = useCallback(
    async ({ fecha, fuente, monto, notas = '' }) => {
      const mes = mesActual()
      const año = añoActual()
      await appendRow(accessToken, spreadsheetId, `${SHEETS.INGRESOS}!A:F`, [
        fecha || todayISO(),
        fuente,
        monto,
        mes,
        año,
        notas,
      ])
    },
    [accessToken, spreadsheetId]
  )

  const deleteIngreso = useCallback(
    async (rowIndex) => {
      const ids = await getSheetIds()
      await deleteRow(accessToken, spreadsheetId, ids[SHEETS.INGRESOS], rowIndex)
    },
    [accessToken, spreadsheetId, getSheetIds]
  )

  // --- Presupuesto ---
  const upsertPresupuesto = useCallback(
    async ({ mes, año, categoria, limite }) => {
      const rows = await get(SHEETS.PRESUPUESTO)
      const existing = rows.findIndex(
        (r) => String(r.Mes) === String(mes) && String(r.Año) === String(año) && r.Categoría === categoria
      )
      if (existing >= 0) {
        // Update row (existing + 1 for header + 1 for 1-based)
        const rowNum = existing + 2
        await updateRow(
          accessToken,
          spreadsheetId,
          `${SHEETS.PRESUPUESTO}!A${rowNum}:G${rowNum}`,
          [mes, año, categoria, limite, rows[existing].Gastado || 0, rows[existing].Porcentaje || 0, rows[existing].Estado || 'En control']
        )
      } else {
        await appendRow(accessToken, spreadsheetId, `${SHEETS.PRESUPUESTO}!A:G`, [
          mes, año, categoria, limite, 0, 0, 'En control',
        ])
      }
    },
    [accessToken, spreadsheetId, get]
  )

  // --- Mura Café ---
  const addMovimientoMura = useCallback(
    async ({ fecha, concepto, tipo, monto, categoriaMura, notas = '' }) => {
      const mes = mesActual()
      const año = añoActual()
      await appendRow(accessToken, spreadsheetId, `${SHEETS.MURA}!A:H`, [
        fecha || todayISO(),
        concepto,
        tipo,
        monto,
        categoriaMura,
        mes,
        año,
        notas,
      ])
    },
    [accessToken, spreadsheetId]
  )

  const deleteMovimientoMura = useCallback(
    async (rowIndex) => {
      const ids = await getSheetIds()
      await deleteRow(accessToken, spreadsheetId, ids[SHEETS.MURA], rowIndex)
    },
    [accessToken, spreadsheetId, getSheetIds]
  )

  // --- Inversiones ---
  const addInversion = useCallback(
    async ({ fecha, tipo, entidad, descripcion, monto, accion, saldoActual, notas = '' }) => {
      const mes = mesActual()
      const año = añoActual()
      await appendRow(accessToken, spreadsheetId, `${SHEETS.INVERSIONES}!A:J`, [
        fecha || todayISO(),
        tipo,
        entidad,
        descripcion,
        monto,
        accion,
        saldoActual,
        mes,
        año,
        notas,
      ])
    },
    [accessToken, spreadsheetId]
  )

  const deleteInversion = useCallback(
    async (rowIndex) => {
      const ids = await getSheetIds()
      await deleteRow(accessToken, spreadsheetId, ids[SHEETS.INVERSIONES], rowIndex)
    },
    [accessToken, spreadsheetId, getSheetIds]
  )

  return {
    get,
    addTransaccion,
    deleteTransaccion,
    addIngreso,
    deleteIngreso,
    upsertPresupuesto,
    addMovimientoMura,
    deleteMovimientoMura,
    addInversion,
    deleteInversion,
  }
}
