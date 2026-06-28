import { useTranslation } from 'react-i18next'

export default function AllergyReport({ allergy_report }) {
  const { t } = useTranslation()
  if (!allergy_report || allergy_report.length === 0) return null

  const severityConfig = {
    SAFE: { badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700', icon: '✓' },
    CAUTION: { badge: 'bg-lime-100 dark:bg-lime-900/60 text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-700', icon: '⚠' },
    AVOID: { badge: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700', icon: '✕' }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-sm shadow-sm">🩺</div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('allergy.title')}</h2>
      </div>
      <div className="space-y-4">
        {allergy_report.map(veg => (
          <div key={veg.vegetable_id} className="bg-white dark:bg-stone-800 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-700 overflow-hidden hover:shadow-md transition-shadow">
            <div className="bg-gradient-to-r from-stone-50 to-stone-100/50 dark:from-stone-700/50 dark:to-stone-700/30 px-5 py-3 border-b border-stone-100 dark:border-stone-700">
              <h3 className="font-bold text-stone-800 dark:text-stone-100 text-lg">{veg.vegetable_name}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-50/50 dark:bg-stone-700/30">
                    <th className="p-3 text-left font-semibold text-stone-600 dark:text-stone-300">{t('allergy.group')}</th>
                    <th className="p-3 text-left font-semibold text-stone-600 dark:text-stone-300">{t('allergy.status')}</th>
                    <th className="p-3 text-left font-semibold text-stone-600 dark:text-stone-300">{t('allergy.recommendation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {veg.risk_groups?.map((g, i) => {
                    const cfg = severityConfig[g.severity] || { badge: 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300', icon: '?' }
                    return (
                      <tr key={i} className="border-t border-stone-50 dark:border-stone-700/50 hover:bg-stone-50/50 dark:hover:bg-stone-700/30 transition-colors">
                        <td className="p-3 text-stone-700 dark:text-stone-200 font-medium">{g.group}</td>
                        <td className="p-3"><span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.badge}`}>{cfg.icon} {g.severity}</span></td>
                        <td className="p-3 text-stone-500 dark:text-stone-400 text-xs">{g.recommendation || g.reason}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
