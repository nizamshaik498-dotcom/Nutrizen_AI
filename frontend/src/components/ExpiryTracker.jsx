import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getExpiryItems, addExpiryItem, removeExpiryItem, clearExpiryItems, checkExpiryReminders, requestNotificationPermission } from '../utils/expiryTracker'

export default function ExpiryTracker({ scanResult }) {
  const { t } = useTranslation()
  const [items, setItems] = useState(getExpiryItems)
  const [newName, setNewName] = useState('')
  const [newExpiry, setNewExpiry] = useState('')
  const [reminders, setReminders] = useState([])

  useEffect(() => {
    requestNotificationPermission()
    const r = checkExpiryReminders()
    if (r.length > 0) {
      setReminders(r)
      if ('Notification' in window && Notification.permission === 'granted') {
        r.forEach(rem => new Notification(`⚠️ ${rem.name} expiring soon!`, {
          body: `${rem.name} expires in ${rem.daysLeft} day(s)!`,
          icon: '/favicon.svg'
        }))
      }
    }
    if (scanResult?.scan_summary?.items) {
      scanResult.scan_summary.items.forEach(veg => {
        const exists = items.some(i => i.name.toLowerCase() === veg.common_name.toLowerCase())
        if (!exists) {
          const expiry = new Date()
          expiry.setDate(expiry.getDate() + (veg.freshness_status === 'Fresh' ? 7 : veg.freshness_status === 'Slightly Aged' ? 3 : 1))
          addExpiryItem({
            name: veg.common_name,
            expiryDate: expiry.toISOString(),
            freshnessStatus: veg.freshness_status,
            daysUntilExpiry: veg.freshness_status === 'Fresh' ? 7 : veg.freshness_status === 'Slightly Aged' ? 3 : 1,
          })
        }
      })
      setItems(getExpiryItems())
    }
  }, [scanResult])

  const handleAdd = () => {
    if (!newName.trim() || !newExpiry) return
    addExpiryItem({ name: newName.trim(), expiryDate: new Date(newExpiry).toISOString() })
    setItems(getExpiryItems())
    setNewName('')
    setNewExpiry('')
  }

  const getDaysLeft = (expiryDate) => {
    const diff = new Date(expiryDate) - new Date()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  if (items.length === 0 && !scanResult) return null

  return (
    <div className="glass-card rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-lime-500 rounded-lg flex items-center justify-center text-sm shadow-sm">⏰</div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('expiry.title')}</h2>
      </div>

      {reminders.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">⚠️ {t('expiry.expiringSoon')}</p>
          {reminders.map((r, i) => (
            <p key={i} className="text-xs text-red-500 dark:text-red-300 mt-1">{r.name} — {r.daysLeft} day(s) left</p>
          ))}
        </div>
      )}

      <div className="flex gap-2 mb-4">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder={t('expiry.itemName')} className="flex-1 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lime-400" />
        <input type="date" value={newExpiry} onChange={e => setNewExpiry(e.target.value)} className="w-36 px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-lime-400" />
        <button onClick={handleAdd} className="px-4 py-2 bg-gradient-to-r from-lime-500 to-lime-500 text-white rounded-xl font-semibold text-sm hover:from-lime-600 hover:to-lime-600 transition-all shadow-md">+</button>
      </div>

      <div className="space-y-2">
        {items.map(item => {
          const daysLeft = getDaysLeft(item.expiryDate)
          return (
            <div key={item.id} className="flex items-center gap-3 glass-card rounded-xl px-4 py-2.5">
              <span className={`w-2 h-2 rounded-full ${daysLeft > 3 ? 'bg-green-500' : daysLeft > 1 ? 'bg-lime-500' : 'bg-red-500'}`} />
              <span className="flex-1 text-sm font-medium text-stone-700 dark:text-stone-200">{item.name}</span>
              <span className={`text-xs font-semibold ${daysLeft > 3 ? 'text-green-600' : daysLeft > 1 ? 'text-lime-600' : 'text-red-600'}`}>
                {daysLeft > 0 ? `${daysLeft}d` : t('expiry.expired')}
              </span>
              <span className="text-xs text-stone-400">{new Date(item.expiryDate).toLocaleDateString()}</span>
              <button onClick={() => { removeExpiryItem(item.id); setItems(getExpiryItems()) }} className="text-xs text-stone-400 hover:text-red-500 transition-colors">✕</button>
            </div>
          )
        })}
      </div>

      {items.length > 0 && (
        <button onClick={() => { clearExpiryItems(); setItems([]) }} className="mt-3 text-xs text-red-500 dark:text-red-400 hover:text-red-600 font-medium transition-colors">
          {t('expiry.clearAll')}
        </button>
      )}
    </div>
  )
}
