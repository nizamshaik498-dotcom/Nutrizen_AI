const STORAGE_KEY = 'nutrivision_scan_history'
const MAX_ITEMS = 20

export function getScanHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addScanToHistory(result) {
  const history = getScanHistory()
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    result,
  }
  history.unshift(entry)
  if (history.length > MAX_ITEMS) history.length = MAX_ITEMS
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  return entry.id
}

export function clearScanHistory() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getScanPreview(result) {
  const items = result?.scan_summary?.items || []
  return {
    veggies: items.map(i => i.common_name).filter(Boolean).join(', ') || 'Unknown',
    count: items.length,
    score: result?.improvements?.meal_balance_score_out_of_10,
    time: new Date().toLocaleString(),
  }
}
