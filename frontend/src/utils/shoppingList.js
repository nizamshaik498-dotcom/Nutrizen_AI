const STORAGE_KEY = 'nutrivision_shopping_list'

export function getShoppingList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function addToShoppingList(item) {
  const list = getShoppingList()
  list.push({
    id: Date.now(),
    name: item.name || item,
    quantity: item.quantity || '1',
    checked: false,
    addedAt: new Date().toISOString(),
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return list
}

export function removeFromShoppingList(id) {
  const list = getShoppingList().filter(i => i.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return list
}

export function toggleShoppingItem(id) {
  const list = getShoppingList().map(i => i.id === id ? { ...i, checked: !i.checked } : i)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return list
}

export function reorderShoppingList(items) {
  const sorted = items.map((item, idx) => ({ ...item, order: idx }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sorted))
  return sorted
}

export function clearShoppingList() {
  localStorage.removeItem(STORAGE_KEY)
}

export function addRecipeIngredientsToList(ingredients) {
  const list = getShoppingList()
  ingredients.forEach(name => {
    if (!list.some(i => i.name.toLowerCase() === name.toLowerCase())) {
      list.push({
        id: Date.now() + Math.random(),
        name,
        quantity: '1',
        checked: false,
        addedAt: new Date().toISOString(),
      })
    }
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  return list
}
