const STORAGE_KEY = 'nutrivision_favorites'

export function getFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function isFavorite(name) {
  return getFavorites().includes(name)
}

export function toggleFavorite(name) {
  const favorites = getFavorites()
  const idx = favorites.indexOf(name)
  if (idx === -1) {
    favorites.push(name)
  } else {
    favorites.splice(idx, 1)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  return idx === -1
}

export function clearFavorites() {
  localStorage.removeItem(STORAGE_KEY)
}

export async function toggleFavoriteServer(name, recipeData, token) {
  if (!token) return toggleFavorite(name)
  try {
    const isFav = await isFavoriteServer(name, token)
    if (isFav) {
      const favs = await getFavoritesServer(token)
      const match = favs.find(f => f.recipe_name === name)
      if (match) {
        await fetch(`https://FaizBasha05.pythonanywhere.com/favorites/${match.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        })
      }
      return false
    } else {
      await fetch('https://FaizBasha05.pythonanywhere.com/favorites/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ recipe_name: name, recipe_data: recipeData || '' }),
      })
      return true
    }
  } catch { return toggleFavorite(name) }
}

export async function getFavoritesServer(token) {
  if (!token) return getFavorites().map(n => ({ recipe_name: n }))
  try {
    const res = await fetch('https://FaizBasha05.pythonanywhere.com/favorites/', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
    if (!res.ok) return getFavorites().map(n => ({ recipe_name: n }))
    return await res.json()
  } catch { return getFavorites().map(n => ({ recipe_name: n })) }
}

export async function isFavoriteServer(name, token) {
  if (!token) return isFavorite(name)
  const favs = await getFavoritesServer(token)
  return favs.some(f => f.recipe_name === name)
}
