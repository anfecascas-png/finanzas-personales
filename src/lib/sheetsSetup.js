import { SPREADSHEET_NAME, SHEETS, HEADERS, TODAS_CATEGORIAS } from '../config'
import {
  createSpreadsheet,
  getSpreadsheet,
  addSheetTab,
  appendRow,
  batchUpdate,
} from './googleSheets'

const STORAGE_KEY = 'finanzas_spreadsheet_id'

export function getStoredSpreadsheetId() {
  return localStorage.getItem(STORAGE_KEY)
}

export function setStoredSpreadsheetId(id) {
  localStorage.setItem(STORAGE_KEY, id)
}

export function clearStoredSpreadsheetId() {
  localStorage.removeItem(STORAGE_KEY)
}

async function verifySpreadsheetExists(accessToken, spreadsheetId) {
  try {
    await getSpreadsheet(accessToken, spreadsheetId)
    return true
  } catch {
    return false
  }
}

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
  // Check if we already have a stored ID
  const storedId = getStoredSpreadsheetId()
  if (storedId) {
    const exists = await verifySpreadsheetExists(accessToken, storedId)
    if (exists) return storedId
    // Stored ID is invalid, create a new one
  }

  // Create new spreadsheet
  const spreadsheet = await createSpreadsheet(accessToken, SPREADSHEET_NAME)
  const spreadsheetId = spreadsheet.spreadsheetId

  // The default "Sheet1" is created automatically — rename it to first sheet
  await batchUpdate(accessToken, spreadsheetId, [
    {
      updateSheetProperties: {
        properties: {
          sheetId: spreadsheet.sheets[0].properties.sheetId,
          title: SHEETS.TRANSACCIONES,
        },
        fields: 'title',
      },
    },
  ])

  // Add headers to first sheet
  await appendRow(accessToken, spreadsheetId, `${SHEETS.TRANSACCIONES}!A1`, HEADERS[SHEETS.TRANSACCIONES])
  await setupSheetHeaders(accessToken, spreadsheetId, SHEETS.TRANSACCIONES, HEADERS[SHEETS.TRANSACCIONES])

  // Create remaining sheets
  const remainingSheets = [
    SHEETS.PRESUPUESTO,
    SHEETS.INGRESOS,
    SHEETS.MURA,
    SHEETS.INVERSIONES,
    SHEETS.CONFIG,
  ]

  for (const sheetName of remainingSheets) {
    await addSheetTab(accessToken, spreadsheetId, sheetName)
    await appendRow(accessToken, spreadsheetId, `${sheetName}!A1`, HEADERS[sheetName])
    await setupSheetHeaders(accessToken, spreadsheetId, sheetName, HEADERS[sheetName])
  }

  // Populate config sheet with default categories
  await populateConfigSheet(accessToken, spreadsheetId)

  setStoredSpreadsheetId(spreadsheetId)
  return spreadsheetId
}
