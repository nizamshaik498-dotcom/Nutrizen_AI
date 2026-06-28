const STORAGE_KEY = 'nutrivision_fridge_items'

export function getFridgeItems() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

export function addFridgeItem(item) {
  const items = getFridgeItems()
  if (!items.some(i => i.name.toLowerCase() === item.name.toLowerCase())) {
    items.push({ ...item, id: Date.now().toString(), addedAt: new Date().toISOString() })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
  return items
}

export function removeFridgeItem(id) {
  const items = getFridgeItems().filter(i => i.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items
}

export function clearFridge() {
  localStorage.removeItem(STORAGE_KEY)
  return []
}

export function findMatchingRecipes(fridgeItems, allRecipes, scannedItems = []) {
  if (!fridgeItems.length || !allRecipes.length) return []
  const fridgeNames = fridgeItems.map(i => i.name.toLowerCase())
  const scannedNames = scannedItems.map(i => i.name?.toLowerCase() || i.common_name?.toLowerCase() || '').filter(Boolean)

  return allRecipes.map(recipe => {
    const recipeWords = (recipe.name || '')
      .toLowerCase()
      .split(/[\s,&]+/)
      .filter(w => w.length > 2 && !['the','and','with','for','in','on','of','a','an','or','by'].includes(w))

    const extra = (recipe.additional_ingredients_required || []).map(i => i.toLowerCase())
    const allIngredientWords = [...new Set([...recipeWords, ...extra, ...scannedNames])]

    const matched = allIngredientWords.filter(word =>
      fridgeNames.some(f => f.includes(word) || word.includes(f))
    )

    const matchPercent = allIngredientWords.length > 0
      ? Math.round((matched.length / allIngredientWords.length) * 100)
      : 0

    return { ...recipe, matchPercent, matchedIngredients: [...new Set(matched)] }
  }).sort((a, b) => b.matchPercent - a.matchPercent)
}
