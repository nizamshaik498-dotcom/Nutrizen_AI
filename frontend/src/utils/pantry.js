const STORAGE_KEY = 'nutrivision_pantry'

export function getPantry() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

export function addToPantry(item) {
  const pantry = getPantry()
  if (!pantry.some(i => i.toLowerCase() === item.toLowerCase())) {
    pantry.push(item)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pantry))
  }
  return pantry
}

export function removeFromPantry(item) {
  const pantry = getPantry().filter(i => i.toLowerCase() !== item.toLowerCase())
  localStorage.setItem(STORAGE_KEY, JSON.stringify(pantry))
  return pantry
}

export function clearPantry() {
  localStorage.removeItem(STORAGE_KEY)
  return []
}
