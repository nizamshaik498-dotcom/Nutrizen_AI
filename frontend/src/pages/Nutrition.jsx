import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../utils/AuthContext'
import SEO from '../components/SEO'
import API from '../utils/api'

const nutrientRows = [
  { key: 'calories_kcal', label: 'Calories (kcal)', max: 100, color: 'from-lime-400 to-lime-500' },
  { key: 'carbohydrates_g', label: 'Carbs (g)', max: 30, color: 'from-yellow-400 to-lime-500' },
  { key: 'dietary_fibre_g', label: 'Fibre (g)', max: 10, color: 'from-emerald-400 to-emerald-500' },
  { key: 'protein_g', label: 'Protein (g)', max: 10, color: 'from-blue-400 to-blue-500' },
  { key: 'fat_g', label: 'Fat (g)', max: 10, color: 'from-red-400 to-red-500' },
  { key: 'vitamin_c_mg', label: 'Vitamin C (mg)', max: 100, color: 'from-lime-400 to-lime-400' },
  { key: 'iron_mg', label: 'Iron (mg)', max: 10, color: 'from-purple-400 to-purple-500' },
  { key: 'potassium_mg', label: 'Potassium (mg)', max: 600, color: 'from-indigo-400 to-indigo-500' },
  { key: 'calcium_mg', label: 'Calcium (mg)', max: 200, color: 'from-pink-400 to-pink-500' },
]

const vitaminHighlights = [
  { key: 'vitamin_c_mg', name: 'Vitamin C', unit: 'mg', color: 'from-lime-400 to-lime-400' },
  { key: 'iron_mg', name: 'Iron', unit: 'mg', color: 'from-purple-400 to-purple-500' },
  { key: 'potassium_mg', name: 'Potassium', unit: 'mg', color: 'from-indigo-400 to-indigo-500' },
  { key: 'calcium_mg', name: 'Calcium', unit: 'mg', color: 'from-pink-400 to-pink-500' },
]

function Bar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="w-full bg-stone-100 dark:bg-stone-700 rounded-full h-2 mt-1.5 overflow-hidden shadow-inner">
      <div className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function DailyChart({ data, color, max }) {
  if (!data?.length) return null
  const vals = data.map(d => d.value)
  const chartMax = Math.max(...vals, max || 1) * 1.2
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((d, i) => {
        const h = (d.value / chartMax) * 100
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div className={`w-full rounded-t-md bg-gradient-to-t ${color} transition-all duration-500 hover:opacity-80`} style={{ height: `${Math.max(h, 2)}%` }} />
            <span className="text-[10px] text-stone-400 dark:text-stone-500 truncate w-full text-center">{d.label}</span>
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-stone-200 text-white dark:text-stone-800 text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {d.value?.toFixed(d.value % 1 === 0 ? 0 : 1)}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function Nutrition() {
  const { t } = useTranslation()
  const { user, getToken } = useAuth()
  const token = getToken()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showLogForm, setShowLogForm] = useState(false)
  const [log, setLog] = useState({ food_name: '', meal_type: 'breakfast', calories_kcal: 0, protein_g: 0, carbohydrates_g: 0, fat_g: 0, fibre_g: 0 })
  const [saving, setSaving] = useState(false)
  const [logSaved, setLogSaved] = useState(false)
  const [dailyHistory, setDailyHistory] = useState([])

  useEffect(() => {
    fetch(`${API}/api/scan/demo`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch (${res.status})`)
        return res.json()
      })
      .then(res => { setData(res); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  useEffect(() => {
    if (user && token) {
      fetch(`${API}/api/nutrition/history?days=7`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(setDailyHistory)
        .catch(() => {})
    }
  }, [user, token])

  const handleLog = async () => {
    if (!user || !token) return
    setSaving(true)
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`${API}/api/nutrition/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...log, log_date: today }),
      })
      if (!res.ok) throw new Error()
      setLogSaved(true)
      setLog({ food_name: '', meal_type: 'breakfast', calories_kcal: 0, protein_g: 0, carbohydrates_g: 0, fat_g: 0, fibre_g: 0 })
      setTimeout(() => setLogSaved(false), 2000)
      const hist = await fetch(`${API}/api/nutrition/history?days=7`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      setDailyHistory(await hist.json())
    } catch (err) { console.warn('Log failed:', err) }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn">
        <div className="bg-gradient-to-br from-lime-600 via-lime-500 to-lime-600 rounded-2xl p-6 md:p-8 mb-8 text-white"><div className="h-8 w-48 bg-white/20 rounded-lg animate-pulse" /><div className="h-4 w-72 bg-white/20 rounded-lg mt-3 animate-pulse" /></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-28 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse" />)}</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-lg text-red-500 font-bold mb-2">{t('common.error')}</p>
        <p className="text-sm text-stone-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="px-6 py-3 btn-glass btn-glass-lime rounded-xl">{t('common.retry')}</button>
      </div>
    )
  }

  const nutrition = data?.result?.nutrition || []
  const totals = {}
  nutrientRows.forEach(({ key }) => {
    totals[key] = nutrition.reduce((sum, n) => sum + (n.per_100g?.[key] || 0), 0)
  })

  const topSources = vitaminHighlights.map(v => {
    const sorted = [...nutrition].sort((a, b) => (b.per_100g?.[v.key] || 0) - (a.per_100g?.[v.key] || 0)).slice(0, 3)
    return { ...v, sources: sorted }
  })

  const chartData = [...dailyHistory].reverse()

  return (
    <>
      <SEO title="Nutrition Tracker" description="Track daily nutrition, vitamins, and health scores from your scanned vegetables." />
      <div className="animate-fadeIn">
        <div className="relative overflow-hidden bg-gradient-to-br from-lime-600 via-lime-500 to-lime-600 py-16 md:py-20">
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            <span className="absolute top-4 left-[15%] text-6xl animate-float" style={{ animationDelay: '0s' }}>🥦</span>
            <span className="absolute top-8 right-[20%] text-5xl animate-float" style={{ animationDelay: '1s' }}>🥕</span>
            <span className="absolute bottom-8 left-[30%] text-7xl animate-float" style={{ animationDelay: '2s' }}>🍅</span>
            <span className="absolute bottom-4 right-[25%] text-5xl animate-float" style={{ animationDelay: '0.5s' }}>🥬</span>
          </div>
          <div className="relative max-w-5xl mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 drop-shadow-sm">{t('nutrition.title')}</h1>
            <p className="text-emerald-100/80 text-sm max-w-xl mx-auto">{t('nutrition.dailyProgress')}</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {[
              { key: 'calories_kcal', label: t('nutrition.totalCalories'), suffix: '', decimals: 0, emoji: '🔥' },
              { key: 'protein_g', label: t('nutrition.totalProtein'), suffix: 'g', decimals: 1, emoji: '🥩' },
              { key: 'carbohydrates_g', label: t('nutrition.totalCarbs'), suffix: 'g', decimals: 1, emoji: '🌾' },
              { key: 'fat_g', label: t('nutrition.totalFat'), suffix: 'g', decimals: 1, emoji: '🧈' },
              { key: 'dietary_fibre_g', label: t('nutrition.totalFibre'), suffix: 'g', decimals: 1, emoji: '🌿' },
            ].map((item, i) => (
              <div key={i} className="group glass-card rounded-2xl shadow-sm p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="text-2xl mb-1">{item.emoji}</div>
                <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-lime-600 dark:from-lime-400 dark:to-lime-400">
                  {totals[item.key]?.toFixed(item.decimals) || 0}{item.suffix}
                </div>
                <div className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-1">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Daily Nutrition Tracker */}
          <div className="mb-10 glass-card rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-red-500 rounded-lg flex items-center justify-center text-sm shadow-sm">📊</div>
                <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">{t('nutritionTracker.trackerTitle')}</h2>
              </div>
              <button
                onClick={() => setShowLogForm(!showLogForm)}
                className="px-4 py-2 btn-glass btn-glass-lime rounded-xl text-sm"
              >
                {showLogForm ? t('common.close') : `+ ${t('nutritionTracker.logMeal')}`}
              </button>
            </div>

            {showLogForm && user && token && (
              <div className="glass-card rounded-xl p-4 mb-5">
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <input value={log.food_name} onChange={e => setLog({ ...log, food_name: e.target.value })} placeholder={t('nutritionTracker.foodName')} className="px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm" />
                  <select value={log.meal_type} onChange={e => setLog({ ...log, meal_type: e.target.value })} className="px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm">
                    {['breakfast', 'lunch', 'dinner', 'snack'].map(mt => (
                      <option key={mt} value={mt}>{t(`nutritionTracker.mealTypes.${mt}`)}</option>
                    ))}
                  </select>
                  <input type="number" value={log.calories_kcal || ''} onChange={e => setLog({ ...log, calories_kcal: +e.target.value || 0 })} placeholder={t('nutritionTracker.calories')} className="px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm" />
                  <input type="number" value={log.protein_g || ''} onChange={e => setLog({ ...log, protein_g: +e.target.value || 0 })} placeholder={t('nutritionTracker.protein')} className="px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm" />
                  <input type="number" value={log.carbohydrates_g || ''} onChange={e => setLog({ ...log, carbohydrates_g: +e.target.value || 0 })} placeholder={t('nutritionTracker.carbs')} className="px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm" />
                  <input type="number" value={log.fat_g || ''} onChange={e => setLog({ ...log, fat_g: +e.target.value || 0 })} placeholder={t('nutritionTracker.fat')} className="px-3 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm" />
                </div>
                <button onClick={handleLog} disabled={saving} className="px-5 py-2.5 btn-glass btn-glass-lime rounded-xl text-sm">
                  {saving ? t('common.loading') : logSaved ? `✓ ${t('nutritionTracker.saved')}` : t('nutritionTracker.save')}
                </button>
              </div>
            )}

            {showLogForm && (!user || !token) && (
              <div className="text-center py-4 bg-lime-50 dark:bg-lime-900/20 rounded-xl border border-lime-200/60 dark:border-lime-700/40 mb-5">
                <p className="text-sm text-lime-600 dark:text-lime-400 font-medium">{t('nutritionTracker.signInRequired')}</p>
              </div>
            )}

            {dailyHistory.length > 0 ? (
              <div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
                  {[
                    { key: 'calories', label: t('nutritionTracker.dailyCalories'), target: 2000, color: 'from-lime-400 to-red-500', emoji: '🔥' },
                    { key: 'protein', label: t('nutritionTracker.dailyProtein'), target: 50, color: 'from-blue-400 to-blue-500', emoji: '🥩' },
                    { key: 'carbs', label: t('nutritionTracker.dailyCarbs'), target: 300, color: 'from-yellow-400 to-lime-500', emoji: '🌾' },
                    { key: 'fat', label: t('nutritionTracker.dailyFat'), target: 65, color: 'from-red-400 to-red-500', emoji: '🧈' },
                  ].map((item, i) => {
                    const val = chartData.length > 0 ? chartData[chartData.length - 1][item.key] || 0 : 0
                    const pct = Math.min((val / item.target) * 100, 100)
                    return (
                      <div key={i} className="glass-card rounded-xl p-4">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span>{item.emoji}</span>
                            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">{item.label}</span>
                          </div>
                          <span className="text-sm font-bold text-stone-700 dark:text-stone-200">{val?.toFixed(0) || 0} / {item.target}</span>
                        </div>
                        <div className="w-full bg-stone-200 dark:bg-stone-600 rounded-full h-2.5 overflow-hidden">
                          <div className={`h-2.5 rounded-full bg-gradient-to-r ${item.color} transition-all duration-700`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-wide">{t('nutritionTracker.dailyCalories')}</p>
                    <DailyChart data={chartData.map(d => ({ label: d.date?.slice(5), value: d.calories }))} color="from-lime-400 to-red-500" max={2500} />
                  </div>
                  <div className="glass-card rounded-xl p-4">
                    <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-wide">{t('nutritionTracker.dailyProtein')}</p>
                    <DailyChart data={chartData.map(d => ({ label: d.date?.slice(5), value: d.protein }))} color="from-blue-400 to-blue-500" max={80} />
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-2 uppercase tracking-wide">{t('nutritionTracker.history')}</p>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto">
                    {dailyHistory.map((d, i) => (
                      <div key={i} className="flex items-center justify-between px-3 py-2 glass-card rounded-lg text-xs">
                        <span className="font-medium text-stone-600 dark:text-stone-300">{d.date}</span>
                        <span className="text-stone-400 dark:text-stone-500">{d.calories?.toFixed(0)} cal · {d.protein?.toFixed(0)}g P · {d.carbs?.toFixed(0)}g C · {d.fat?.toFixed(0)}g F</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-2">📊</div>
                <p className="text-sm text-stone-400 dark:text-stone-500">{t('nutritionTracker.noData')}</p>
              </div>
            )}
          </div>

          {/* Per-vegetable nutrition table */}
          {nutrition.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">{t('nutrition.title')}</h2>
              <div className="overflow-x-auto rounded-2xl shadow-sm border border-stone-200/80 dark:border-stone-700/60">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40">
                      <th className="p-3.5 text-left text-sm font-bold text-stone-700 dark:text-stone-200 border-b border-stone-200/60 dark:border-stone-700/50">{t('nutrition.nutrient')} ({t('nutrition.per100g')})</th>
                      {nutrition.map(n => <th key={n.vegetable_id} className="p-3.5 text-left text-sm font-bold text-stone-700 dark:text-stone-200 border-b border-stone-200/60 dark:border-stone-700/50">{n.vegetable_name}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {nutrientRows.map(({ key, label, max, color }) => (
                      <tr key={key} className="hover:bg-lime-50/30 dark:hover:bg-lime-900/20 transition-colors">
                        <td className="p-3.5 text-sm font-medium text-stone-600 dark:text-stone-300 border-b border-stone-200/40 dark:border-stone-700/40">{label}</td>
                        {nutrition.map(n => {
                          const val = n.per_100g?.[key]
                          return (
                            <td key={n.vegetable_id} className="p-3.5 border-b border-stone-200/40 dark:border-stone-700/40">
                              {val != null ? (
                                <div>
                                  <span className="font-bold text-sm text-stone-700 dark:text-stone-200">{typeof val === 'number' ? val.toFixed(val % 1 === 0 ? 0 : 1) : val}</span>
                                  <Bar value={val} max={max} color={color} />
                                </div>
                              ) : <span className="text-stone-300 dark:text-stone-600">—</span>}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vitamin Sources */}
          {nutrition.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-4">💊 {t('nutrition.vitaminSources')}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {topSources.map((v) => (
                  <div key={v.key} className="glass-card rounded-2xl shadow-sm p-5">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white font-bold text-sm mb-3 shadow-sm`}>💊</div>
                    <p className="font-bold text-stone-800 dark:text-stone-100 text-sm mb-2">{v.name}</p>
                    {v.sources.length > 0 ? v.sources.map((s, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 dark:border-stone-700/50 last:border-0">
                        <span className="text-stone-600 dark:text-stone-300">{s.vegetable_name}</span>
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-500 to-lime-600">{s.per_100g?.[v.key]?.toFixed(1) || '—'} {v.unit}</span>
                      </div>
                    )) : <p className="text-xs text-stone-400 dark:text-stone-500">{t('common.noData')}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {nutrition.length === 0 && (
            <div className="text-center py-20 glass-card rounded-2xl shadow-sm">
              <div className="text-4xl mb-4">🥗</div>
              <p className="text-lg text-stone-500 dark:text-stone-400">{t('common.noData')}</p>
            </div>
          )}

          <p className="text-center text-xs text-stone-400 dark:text-stone-500 mt-8">{t('nutrition.someValuesEstimated')}</p>
        </div>
      </div>
    </>
  )
}
