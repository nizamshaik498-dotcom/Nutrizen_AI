import { useTranslation } from 'react-i18next'

export default function Improvements({ improvements }) {
  const { t } = useTranslation()
  if (!improvements) return null
  const score = improvements.meal_balance_score_out_of_10
  const scoreColor = score >= 8 ? 'from-emerald-500 to-emerald-600' : score >= 5 ? 'from-lime-500 to-lime-600' : 'from-red-500 to-red-600'

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-sm shadow-sm">📊</div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('improvements.title')}</h2>
      </div>
      <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 overflow-hidden">
        <div className={`bg-gradient-to-r ${scoreColor} px-6 py-5`}>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="3" strokeDasharray={`${score / 10 * 100} 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-extrabold text-white">{score}</span></div>
            </div>
            <div className="text-white">
              <p className="text-sm font-semibold uppercase tracking-wide opacity-80">{t('improvements.mealBalance')}</p>
              <p className="text-white/90 text-sm mt-1">{improvements.meal_balance_justification}</p>
            </div>
          </div>
        </div>
        <div className="p-5 space-y-5">
          {improvements.nutritional_gaps?.length > 0 && (
            <div>
              <p className="text-sm font-bold text-stone-700 dark:text-stone-200 mb-2 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" /> {t('improvements.nutritionalGaps')}</p>
              <div className="flex flex-wrap gap-2">
                {improvements.nutritional_gaps.map((gap, i) => <span key={i} className="text-xs font-medium bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-2.5 py-1 rounded-lg">{gap}</span>)}
              </div>
            </div>
          )}
          {improvements.suggested_add_ons?.length > 0 && (
            <div>
              <p className="text-sm font-bold text-stone-700 dark:text-stone-200 mb-2 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400" /> {t('improvements.suggestedAddOns')}</p>
              <div className="space-y-2.5">
                {improvements.suggested_add_ons.map((item, i) => (
                  <div key={i} className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-blue-400" /><strong className="text-blue-700 dark:text-blue-300 text-sm font-bold">{item.ingredient}</strong></div>
                    <p className="text-stone-500 dark:text-stone-400 text-xs">{item.reason}</p>
                    <p className="text-stone-400 dark:text-stone-500 text-xs mt-1">{t('improvements.adds')}: {item.nutrient_it_adds}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {improvements.cooking_technique_upgrades && Object.entries(improvements.cooking_technique_upgrades).some(([, v]) => v) && (
            <div>
              <p className="text-sm font-bold text-stone-700 dark:text-stone-200 mb-2 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400" /> {t('improvements.cookingUpgrades')}</p>
              <div className="grid gap-2">
                {Object.entries(improvements.cooking_technique_upgrades).map(([level, tip]) => tip && (
                  <div key={level} className="bg-purple-50/50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800/50 rounded-xl p-3">
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wide capitalize">{level}</span>
                    <p className="text-sm text-stone-600 dark:text-stone-300 mt-0.5">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {improvements.next_scan_suggestion && (
            <div className="bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 rounded-xl p-3.5">
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-1">{t('improvements.nextScanSuggestion')}</p>
              <p className="text-sm text-stone-600 dark:text-stone-300 italic">{improvements.next_scan_suggestion}</p>
            </div>
          )}
          {improvements.overall_verdict && (
            <div className="bg-stone-50 dark:bg-stone-700/50 border border-stone-100 dark:border-stone-600 rounded-xl p-3.5">
              <p className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase tracking-wide mb-1">{t('improvements.verdict')}</p>
              <p className="text-sm text-stone-700 dark:text-stone-200">{improvements.overall_verdict}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
