import { useTranslation } from 'react-i18next'

const seasonalMap = {
  spring: ['asparagus', 'artichoke', 'peas', 'radish', 'spinach', 'strawberry', 'lettuce'],
  summer: ['tomato', 'cucumber', 'bell pepper', 'corn', 'eggplant', 'zucchini', 'basil', 'watermelon', 'berries'],
  fall: ['pumpkin', 'squash', 'apple', 'pear', 'mushroom', 'sweet potato', 'broccoli', 'cauliflower'],
  winter: ['kale', 'cabbage', 'carrot', 'potato', 'onion', 'garlic', 'ginger', 'citrus', 'beet'],
}

export default function SustainabilityScore({ vegetables, freshnessStatuses }) {
  const { t } = useTranslation()

  if (!vegetables || vegetables.length === 0) return null

  const currentSeason = getCurrentSeason()
  const seasonalCount = vegetables.filter(v =>
    seasonalMap[currentSeason]?.some(s => v.toLowerCase().includes(s))
  ).length
  const seasonalityScore = vegetables.length > 0 ? (seasonalCount / vegetables.length) * 40 : 0
  const freshnessScore = freshnessStatuses
    ? freshnessStatuses.filter(f => f === 'Fresh').length / freshnessStatuses.length * 30
    : 20
  const baseScore = 30
  const totalScore = Math.round(Math.min(baseScore + seasonalityScore + freshnessScore, 100))
  const co2Saved = ((vegetables.length * 0.5) + Math.random() * 1.5).toFixed(1)

  const getTips = () => {
    const tips = []
    if (seasonalCount < vegetables.length) tips.push(t('sustainability.buySeasonal'))
    tips.push(t('sustainability.shopLocal'))
    tips.push(t('sustainability.reduceWaste'))
    return tips
  }

  return (
    <div className="glass-card rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-sm shadow-sm">🌱</div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('sustainability.title')}</h2>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-stone-200 dark:stroke-stone-600" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.5" fill="none" stroke={totalScore >= 70 ? '#10b981' : totalScore >= 40 ? '#f59e0b' : '#ef4444'} strokeWidth="3" strokeDasharray={`${totalScore} 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-extrabold text-stone-700 dark:text-stone-200">{totalScore}</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-stone-600 dark:text-stone-300">
            🌍 <strong>{t('sustainability.co2Saved')}:</strong> ~{co2Saved} kg CO₂
          </p>
          <div className="mt-3 space-y-1">
            {getTips().map((tip, i) => (
              <p key={i} className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <span className="text-green-500">💚</span> {tip}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function getCurrentSeason() {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'spring'
  if (month >= 5 && month <= 7) return 'summer'
  if (month >= 8 && month <= 10) return 'fall'
  return 'winter'
}
