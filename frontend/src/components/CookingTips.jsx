import { useTranslation } from 'react-i18next'

export default function CookingTips({ cooking_tips }) {
  const { t } = useTranslation()
  if (!cooking_tips || cooking_tips.length === 0) return null
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-sm shadow-sm">👨‍🍳</div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('scan.sections.cookingTips')}</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {cooking_tips.map((veg) => (
          <div key={veg.vegetable_id} className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 overflow-hidden hover:shadow-md hover:-transtone-y-0.5 transition-all duration-300">
            <div className="bg-gradient-to-r from-lime-50 to-lime-50 dark:from-lime-900/30 dark:to-lime-900/30 px-5 py-3 border-b border-stone-100 dark:border-stone-700">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 text-lg">{veg.vegetable_name}</h3>
            </div>
            <div className="p-4 space-y-3.5">
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide">{t('cookingTips.preparation')}</p>
                <p className="text-sm text-stone-600 dark:text-stone-300 mt-0.5">{veg.preparation}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1.5">{t('cookingTips.bestMethods')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {veg.best_cooking_methods?.map((m, i) => (
                    <span key={i} className="text-xs bg-lime-50 dark:bg-lime-900/30 text-lime-700 dark:text-lime-300 border border-lime-200 dark:border-lime-700/50 px-2.5 py-0.5 rounded-full font-medium">{m}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1.5">{t('cookingTips.flavorPairings')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {veg.flavor_pairings?.map((p, i) => (
                    <span key={i} className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/50 px-2.5 py-0.5 rounded-full font-medium">{p}</span>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-50/50 dark:bg-emerald-900/15 border border-emerald-100 dark:border-emerald-800/40 rounded-xl p-3">
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-0.5">🥦 {t('cookingTips.nutritionTip')}</p>
                <p className="text-xs text-stone-500 dark:text-stone-400">{veg.nutrition_preservation}</p>
              </div>
              <div className="bg-red-50/50 dark:bg-red-900/15 border border-red-100 dark:border-red-800/40 rounded-xl p-3">
                <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-0.5">⚠ {t('cookingTips.commonMistakes')}</p>
                <ul className="text-xs text-stone-500 dark:text-stone-400 list-disc list-inside mt-0.5">
                  {veg.common_mistakes?.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
