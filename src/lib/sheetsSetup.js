import { FIXED_SPREADSHEET_ID, SHEETS, HEADERS, TODAS_CATEGORIAS } from '../config'
import {
  getSpreadsheet,
  addSheetTab,
  appendRow,
  batchUpdate,
} from './googleSheets'

export function getStoredSpreadsheetId() {
  return FIXED_SPREADSHEET_ID
}

export function setStoredSpreadsheetId() {}

export function clearStoredSpreadsheetId() {}

async function setupSheetHeaders(accessToken, spreadsheetId, sheetTitle, headers) {
  // Style headers: bold + frozen row + background
  const sheetMeta = await getSpreadsheet(accessToken, spreadsheetId)
  const sheet = sheetMeta.sheets?.find((s) => s.properties.title === sheetTitle)
  if (!sheet) return

  const sheetId = sheet.properties.sheetId

  await batchUpdate(accessToken, spreadsheetId, [
    {
      repeatCell: {
        range: { sheetId, startRowIndex: 0, endRowIndex: 1 },
        cell: {
          userEnteredFormat: {
            backgroundColor: { red: 0.067, green: 0.729, blue: 0.506 },
            textFormat: { bold: true, foregroundColor: { red: 1, green: 1, blue: 1 } },
          },
        },
        fields: 'userEnteredFormat(backgroundColor,textFormat)',
      },
    },
    {
      updateSheetProperties: {
        properties: { sheetId, gridProperties: { frozenRowCount: 1 } },
        fields: 'gridProperties.frozenRowCount',
      },
    },
  ])
}

async function populateConfigSheet(accessToken, spreadsheetId) {
  for (const cat of TODAS_CATEGORIAS) {
    const tipo = ['Hogar', 'Salud', 'Suscripciones'].includes(cat.nombre) ? 'Fijo' : 'Variable'
    await appendRow(accessToken, spreadsheetId, `${SHEETS.CONFIG}!A:D`, [
      cat.nombre,
      cat.subcategorias.join(', '),
      tipo,
      'TRUE',
    ])
  }
}

export async function initializeSpreadsheet(accessToken) {
  const spreadsheetId = FIXED_SPREADSHEET_ID
  if (!spreadsheetId) {
    throw new Error('VITE_SPREADSHEET_ID no está configurado')
  }

  const meta = await getSpreadsheet(accessToken, spreadsheetId)
  const existingTitles = new Set(meta.sheets.map((s) => s.properties.title))

  const allSheets = [
    SHEETS.TRANSACCIONES,
    SHEETS.PRESUPUESTO,
    SHEETS.INGRESOS,
    SHEETS.MURA,
    SHEETS.INVERSIONES,
    SHEETS.CONFIG,
  ]

  for (const sheetName of allSheets) {
    if (existingTitles.has(sheetName)) continue
    await addSheetTab(accessToken, spreadsheetId, sheetName)
    await appendRow(accessToken, spreadsheetId, `${sheetName}!A1`, HEADERS[sheetName])
    await setupSheetHeaders(accessToken, spreadsheetId, sheetName, HEADERS[sheetName])
    if (sheetName === SHEETS.CONFIG) {
      await populateConfigSheet(accessToken, spreadsheetId)
    }
  }

  return spreadsheetId
}
