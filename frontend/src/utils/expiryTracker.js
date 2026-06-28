const STORAGE_KEY = 'nutrivision_expiry'

export function getExpiryItems() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

export function addExpiryItem(item) {
  const items = getExpiryItems()
  const newItem = {
    id: Date.now().toString(),
    name: item.name,
    purchaseDate: item.purchaseDate || new Date().toISOString(),
    expiryDate: item.expiryDate,
    daysUntilExpiry: item.daysUntilExpiry || 7,
    freshnessStatus: item.freshnessStatus || 'Fresh',
    notified: false,
  }
  items.push(newItem)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items
}

export function removeExpiryItem(id) {
  const items = getExpiryItems().filter(i => i.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items
}

export function clearExpiryItems() {
  localStorage.removeItem(STORAGE_KEY)
  return []
}

export function checkExpiryReminders() {
  const items = getExpiryItems()
  const now = new Date()
  const reminders = []
  items.forEach(item => {
    if (item.notified) return
    const expiry = new Date(item.expiryDate)
    const daysLeft = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))
    if (daysLeft <= 1 && daysLeft >= 0) {
      reminders.push({ name: item.name, daysLeft })
      item.notified = true
    }
  })
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return reminders
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission()
  }
}
