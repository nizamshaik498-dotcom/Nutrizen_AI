import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../utils/AuthContext'
import SEO from '../components/SEO'
import EmptyState from '../components/EmptyState'
import RecipeCard from '../components/RecipeCard'
import NutritionTable from '../components/NutritionTable'
import AllergyReport from '../components/AllergyReport'
import Substitutions from '../components/Substitutions'
import Improvements from '../components/Improvements'
import { getScanHistory, clearScanHistory, getScanPreview } from '../utils/scanHistory'

export default function History() {
  const { t } = useTranslation()
  const { user, getToken } = useAuth()
  const token = getToken()
  const [history, setHistory] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && token) {
      fetch('https://FaizBasha05.pythonanywhere.com/scan/history', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setHistory(data.map(s => ({
            id: s.id,
            timestamp: s.created_at,
            ...s.preview,
          })))
          setLoading(false)
        })
        .catch(() => {
          setHistory(getScanHistory())
          setLoading(false)
        })
    } else {
      setHistory(getScanHistory())
      setLoading(false)
    }
  }, [user, token])

  const handleSelectServer = async (id) => {
    try {
      const res = await fetch(`https://FaizBasha05.pythonanywhere.com/scan/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      const data = await res.json()
      setSelected({ id, timestamp: data.created_at, result: data.full_response })
    } catch (err) {
      console.warn('Failed to fetch scan:', err)
    }
  }

  const handleClear = () => { clearScanHistory(); setHistory([]); setSelected(null) }

  const r = selected?.result
  const score = r?.improvements?.meal_balance_score_out_of_10 ?? 0

  return (
    <>
      <SEO title="Scan History" description="View your past vegetable scans and recipe results." />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-br from-lime-600 via-lime-500 to-lime-600 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl shadow-lime-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl shadow-inner">📋</div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{t('history.title')}</h1>
                <p className="text-emerald-100/80 text-sm">{t('history.scansSaved', { count: history.length })}</p>
              </div>
            </div>
            {history.length > 0 && !user && (
              <button onClick={handleClear} className="px-4 py-2.5 bg-white/15 backdrop-blur-sm text-white/90 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/25 transition-all hover:shadow-lg active:scale-[0.98]">
                {t('history.clearAll')}
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-lime-200 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : history.length === 0 && !selected ? (
          <EmptyState
            emoji="📜"
            title={t('history.noScans')}
            description={t('history.noScansDesc')}
            action={
              <Link to="/scan" className="inline-flex items-center gap-2 btn-glass btn-glass-lime px-7 py-3.5 rounded-xl text-sm">
                📸 {t('history.scanNow')} →
              </Link>
            }
          />
        ) : selected && r ? (
          <div>
            <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 text-sm text-lime-600 dark:text-lime-400 font-medium mb-5 hover:text-lime-700 dark:hover:text-lime-300 transition-colors group">
              <span className="group-hover:-translate-x-0.5 transition-transform">←</span> {t('history.back')}
            </button>
            <div className="glass-card rounded-2xl shadow-lg p-5 md:p-7 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center shadow-md text-lg">📊</div>
                <div>
                  <h2 className="text-xl font-extrabold text-stone-800 dark:text-stone-100">{t('scan.results')}</h2>
                  <p className="text-sm text-stone-400 dark:text-stone-500">{new Date(selected.timestamp).toLocaleString()}</p>
                </div>
              </div>
            </div>
            {r.improvements?.overall_verdict && (
              <div className="glass-card rounded-2xl p-6 mb-6 shadow-sm">
                <div className="flex items-start gap-4 flex-col sm:flex-row sm:items-center">
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="relative w-20 h-20">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-stone-200 dark:stroke-stone-600" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.5" fill="none" stroke={score >= 8 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444'} strokeWidth="3" strokeDasharray={`${score / 10 * 100} 100`} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-extrabold text-stone-700 dark:text-stone-200">{score}</span></div>
                    </div>
                    <div><span className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">{t('scan.score')}</span><p className="text-lg font-bold text-stone-800 dark:text-stone-100">{t('scan.mealBalance')}</p></div>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">{r.improvements.overall_verdict}</p>
                </div>
              </div>
            )}
            {r.scan_summary?.items && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-lime-400 to-lime-500 rounded-lg flex items-center justify-center text-xs shadow-sm">🥬</div>
                  <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">{t('scan.sections.vegetables')}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {r.scan_summary.items.map(item => (
                    <div key={item.id} className="glass-card rounded-xl shadow-sm p-3.5 hover:shadow-md transition-shadow">
                      <p className="font-bold text-stone-800 dark:text-stone-100 text-sm">{item.common_name}</p>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full inline-block mt-1.5 ${item.freshness_status === 'Fresh' ? 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300 border border-lime-200 dark:border-lime-700/50' : item.freshness_status === 'Slightly Aged' ? 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300 border border-lime-200 dark:border-lime-700/50' : 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700/50'}`}>{item.freshness_status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div id="section-recipes"><RecipeCard recipes={r.recipes} /></div>
            <div id="section-nutrition"><NutritionTable nutrition={r.nutrition} /></div>
            <div id="section-allergy"><AllergyReport allergy_report={r.allergy_report} /></div>
            <div id="section-subs"><Substitutions substitutions={r.substitutions} /></div>
            <div id="section-improve"><Improvements improvements={r.improvements} /></div>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((entry) => {
              const preview = user && token ? entry : getScanPreview(entry.result)
              return (
                <button
                  key={entry.id}
                  onClick={() => user && token ? handleSelectServer(entry.id) : setSelected(entry)}
                  className="w-full text-left glass-card rounded-2xl shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40 rounded-xl flex items-center justify-center text-lg shrink-0">🥗</div>
                      <div>
                        <p className="font-bold text-stone-800 dark:text-stone-100 truncate">
                          {user && token ? (entry.veggies || 'Scan') : (preview.veggies || 'Scan')}
                        </p>
                        <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5 flex items-center gap-1.5">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {entry.total_vegetables || preview.count || 0} · {new Date(entry.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {(entry.score != null || preview.score != null) && (
                      <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shadow-sm border" style={{
                        backgroundColor: (entry.score || preview.score) >= 8 ? '#d1fae5' : (entry.score || preview.score) >= 5 ? '#fef3c7' : '#fee2e2',
                        color: (entry.score || preview.score) >= 8 ? '#059669' : (entry.score || preview.score) >= 5 ? '#d97706' : '#dc2626',
                        borderColor: (entry.score || preview.score) >= 8 ? '#a7f3d0' : (entry.score || preview.score) >= 5 ? '#fde68a' : '#fecaca',
                      }}>
                        {entry.score || preview.score}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
