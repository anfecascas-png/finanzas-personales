const SHEETS_BASE = 'https://sheets.googleapis.com/v4/spreadsheets'

async function request(url, accessToken, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Error HTTP ${res.status}`)
  }
  return res.json()
}

export async function getValues(accessToken, spreadsheetId, range) {
  return request(
    `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    accessToken
  )
}

export async function appendRow(accessToken, spreadsheetId, range, values) {
  return request(
    `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    accessToken,
    { method: 'POST', body: JSON.stringify({ values: [values] }) }
  )
}

export async function updateRow(accessToken, spreadsheetId, range, values) {
  return request(
    `${SHEETS_BASE}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    accessToken,
    { method: 'PUT', body: JSON.stringify({ values: [values] }) }
  )
}

export async function batchUpdate(accessToken, spreadsheetId, requests) {
  return request(
    `${SHEETS_BASE}/${spreadsheetId}:batchUpdate`,
    accessToken,
    { method: 'POST', body: JSON.stringify({ requests }) }
  )
}

export async function deleteRow(accessToken, spreadsheetId, sheetId, rowIndex) {
  return batchUpdate(accessToken, spreadsheetId, [
    {
      deleteDimension: {
        range: {
          sheetId,
          dimension: 'ROWS',
          startIndex: rowIndex,
          endIndex: rowIndex + 1,
        },
      },
    },
  ])
}

export async function createSpreadsheet(accessToken, title) {
  return request(SHEETS_BASE, accessToken, {
    method: 'POST',
    body: JSON.stringify({ properties: { title } }),
  })
}

export async function getSpreadsheet(accessToken, spreadsheetId) {
  return request(`${SHEETS_BASE}/${spreadsheetId}`, accessToken)
}

export async function addSheetTab(accessToken, spreadsheetId, title) {
  const res = await batchUpdate(accessToken, spreadsheetId, [
    { addSheet: { properties: { title } } },
  ])
  return res.replies[0].addSheet.properties.sheetId
}

export async function getAllSheetData(accessToken, spreadsheetId, ranges) {
  const encoded = ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join('&')
  return request(
    `${SHEETS_BASE}/${spreadsheetId}/values:batchGet?${encoded}`,
    accessToken
  )
}
