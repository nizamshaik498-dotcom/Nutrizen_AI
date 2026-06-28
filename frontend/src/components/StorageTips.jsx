import { useTranslation } from 'react-i18next'

export default function StorageTips({ storage_tips }) {
  const { t } = useTranslation()
  if (!storage_tips || storage_tips.length === 0) return null
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg flex items-center justify-center text-sm shadow-sm">❄️</div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('scan.sections.storage')}</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {storage_tips.map((veg) => (
          <div key={veg.vegetable_id} className="glass-card rounded-2xl shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 px-4 py-3 border-b border-stone-100 dark:border-stone-700">
              <h3 className="font-bold text-stone-800 dark:text-stone-100">{veg.vegetable_name}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">{t('storage.method')}</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-0.5">{veg.method}</p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300">⏱ {veg.shelf_life_days} {t('storage.days')}</span>
                {veg.refrigerate
                  ? <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">❄️ {t('storage.refrigerate')}</span>
                  : <span className="text-xs px-2.5 py-1 rounded-full bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300">🌡️ {t('storage.countertop')}</span>
                }
              </div>
              {veg.refrigerate_note && <p className="text-xs text-stone-400 dark:text-stone-500">{veg.refrigerate_note}</p>}
              {veg.freeze_instructions && (
                <div>
                  <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">{t('storage.freezing')}</p>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{veg.freeze_instructions}</p>
                </div>
              )}
              {veg.tip && (
                <div className="bg-lime-50/50 dark:bg-lime-900/20 border border-lime-200/50 dark:border-lime-800/40 rounded-lg p-2.5">
                  <p className="text-xs font-medium text-lime-700 dark:text-lime-300 flex items-start gap-1"><span>💡</span> {veg.tip}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
