import { useTranslation } from 'react-i18next'

function Bar({ value, max, color }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="w-full bg-stone-100 dark:bg-stone-700 rounded-full h-2 mt-1.5 overflow-hidden">
      <div className={`h-2 rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function NutritionTable({ nutrition }) {
  const { t } = useTranslation()
  if (!nutrition || nutrition.length === 0) return null

  const rows = [
    { key: 'calories_kcal', label: t('nutrition.calories'), max: 100, color: 'bg-gradient-to-r from-lime-400 to-lime-500' },
    { key: 'carbohydrates_g', label: t('nutrition.carbs'), max: 30, color: 'bg-gradient-to-r from-yellow-400 to-lime-500' },
    { key: 'dietary_fibre_g', label: t('nutrition.fibre'), max: 10, color: 'bg-gradient-to-r from-emerald-400 to-emerald-500' },
    { key: 'protein_g', label: t('nutrition.protein'), max: 10, color: 'bg-gradient-to-r from-blue-400 to-blue-500' },
    { key: 'fat_g', label: t('nutrition.fat'), max: 10, color: 'bg-gradient-to-r from-red-400 to-red-500' },
    { key: 'vitamin_c_mg', label: t('nutrition.vitaminC'), max: 100, color: 'bg-gradient-to-r from-lime-400 to-lime-400' },
    { key: 'iron_mg', label: t('nutrition.iron'), max: 10, color: 'bg-gradient-to-r from-purple-400 to-purple-500' },
    { key: 'potassium_mg', label: t('nutrition.potassium'), max: 600, color: 'bg-gradient-to-r from-indigo-400 to-indigo-500' },
  ]

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-lime-500 to-lime-600 rounded-lg flex items-center justify-center text-sm shadow-sm">🥦</div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('nutrition.title')}</h2>
      </div>
      <div className="overflow-x-auto rounded-2xl shadow-sm glass-card">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/40 dark:to-teal-900/40">
              <th className="p-3 text-left text-sm font-bold text-stone-700 dark:text-stone-200 border-b border-stone-100 dark:border-stone-700 whitespace-nowrap">{t('nutrition.nutrient')} ({t('nutrition.per100g')})</th>
              {nutrition.map(n => <th key={n.vegetable_id} className="p-3 text-left text-sm font-bold text-stone-700 dark:text-stone-200 border-b border-stone-100 dark:border-stone-700 whitespace-nowrap">{n.vegetable_name}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ key, label, max, color }) => (
              <tr key={key} className="hover:bg-lime-50/30 dark:hover:bg-lime-900/20 transition-colors">
                <td className="p-3 text-sm text-stone-600 dark:text-stone-300 border-b border-slate-50 dark:border-stone-700/50 font-medium whitespace-nowrap">{label}</td>
                {nutrition.map(n => {
                  const val = n.per_100g?.[key]
                  return (
                    <td key={n.vegetable_id} className="p-3 text-sm text-stone-700 dark:text-stone-200 border-b border-slate-50 dark:border-stone-700/50 min-w-[120px]">
                      <span className="font-bold text-stone-800 dark:text-stone-100">{val ?? '-'}</span>
                      {val != null && <Bar value={val} max={max} color={color} />}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {nutrition.map(n => (
          <div key={n.vegetable_id} className="text-sm glass-card rounded-xl px-4 py-2 shadow-sm">
            <span className="font-bold text-stone-700 dark:text-stone-200">{n.vegetable_name}</span>
            <span className="text-stone-400 dark:text-stone-500 mx-1.5">·</span>
            <span className="text-stone-500 dark:text-stone-400">{t('nutrition.glycemicIndex')} {n.glycemic_index ?? t('common.na')}</span>
            <span className="text-stone-400 dark:text-stone-500 mx-1.5">·</span>
            <span className="text-lime-600 dark:text-lime-400 font-semibold">{n.health_score_out_of_10}/10</span>
          </div>
        ))}
      </div>
      {nutrition.some(n => n.data_confidence === 'Estimated') && <p className="text-xs text-lime-600 dark:text-lime-400 mt-3 flex items-center gap-1">⚠ {t('nutrition.someValuesEstimated')}</p>}
    </div>
  )
}
