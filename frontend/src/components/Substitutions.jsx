import { useTranslation } from 'react-i18next'

export default function Substitutions({ substitutions }) {
  const { t } = useTranslation()
  if (!substitutions || substitutions.length === 0) return null

  const matchStyles = {
    High: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700',
    Moderate: 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-700',
    Low: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700'
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-sm shadow-sm">🔄</div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('substitutions.title')}</h2>
      </div>
      <div className="space-y-4">
        {substitutions.map((s, i) => (
          <div key={i} className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 overflow-hidden hover:shadow-md hover:-transtone-y-0.5 transition-all duration-300">
            <div className="p-5">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                  <span className="text-lg font-bold text-stone-800 dark:text-stone-100">{s.original_vegetable_name}</span>
                  <span className="text-2xl text-emerald-500">→</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{s.substitute_vegetable}</span>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border self-start whitespace-nowrap ${matchStyles[s.nutritional_equivalence] || 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'}`}>
                  {s.nutritional_equivalence} {t('substitutions.match')}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-red-50/50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide mb-1">{t('substitutions.risk')}</p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">{s.risk_reason}</p>
                </div>
                <div className="bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-1">{t('substitutions.whySafer')}</p>
                  <p className="text-sm text-stone-600 dark:text-stone-300">{s.why_safer}</p>
                </div>
              </div>
              {s.recipe_update && <p className="text-xs text-stone-500 dark:text-stone-400 mt-3 pt-3 border-t border-stone-100 dark:border-stone-700 italic">📝 {s.recipe_update.updated_ingredient_line}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
