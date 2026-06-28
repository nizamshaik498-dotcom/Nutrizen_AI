import { useTranslation } from 'react-i18next'

export default function CostEstimation({ cost_estimation, improvements }) {
  const { t } = useTranslation()
  if (!cost_estimation || cost_estimation.length === 0) return null
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-sm shadow-sm">💰</div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('scan.sections.cost')}</h2>
      </div>
      {improvements?.estimated_total_cost && (
        <div className="bg-gradient-to-r from-lime-50 to-lime-50 dark:from-lime-900/30 dark:to-lime-900/30 border border-lime-200 dark:border-lime-700/40 rounded-2xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center text-lg shadow-sm">💰</div>
            <div>
              <p className="text-xs font-semibold text-lime-700 dark:text-lime-300 uppercase tracking-wide">{t('improvements.estimatedTotalCost')}</p>
              <p className="text-xl font-extrabold text-stone-800 dark:text-stone-100">{improvements.estimated_total_cost}</p>
            </div>
          </div>
          {improvements.leftover_recipe_suggestion && (
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-3 pt-3 border-t border-lime-200/50 dark:border-lime-700/30 flex items-start gap-1.5">
              <span>♻️</span> {improvements.leftover_recipe_suggestion}
            </p>
          )}
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cost_estimation.map((veg) => (
          <div key={veg.vegetable_id} className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 p-4 hover:shadow-md hover:-transtone-y-0.5 transition-all duration-300">
            <h3 className="font-bold text-stone-800 dark:text-stone-100 text-sm mb-2">{veg.vegetable_name}</h3>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-400 dark:text-stone-500">{t('costEstimation.pricePerKg')}</span>
                <span className="font-semibold text-stone-700 dark:text-stone-200">{veg.estimated_price_per_kg}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-400 dark:text-stone-500">{t('costEstimation.thisScan')}</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{veg.estimated_cost_for_this_scan}</span>
              </div>
              {veg.price_seasonality && (
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-1.5 pt-1.5 border-t border-stone-100 dark:border-stone-700">{veg.price_seasonality}</p>
              )}
              {veg.budget_tip && (
                <div className="bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/40 rounded-lg p-2 mt-1.5">
                  <p className="text-xs text-emerald-700 dark:text-emerald-300"><span className="font-bold">💡</span> {veg.budget_tip}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
