import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

export default function About() {
  const { t } = useTranslation()

  const features = [
    { emoji: '📸', title: t('about.features.aiScanner'), desc: t('about.features.aiScannerDesc') },
    { emoji: '🍳', title: t('about.features.smartRecipes'), desc: t('about.features.smartRecipesDesc') },
    { emoji: '🥦', title: t('about.features.nutritionData'), desc: t('about.features.nutritionDataDesc') },
    { emoji: '🩺', title: t('about.features.allergyReports'), desc: t('about.features.allergyReportsDesc') },
    { emoji: '📊', title: t('about.features.mealPlanning'), desc: t('about.features.mealPlanningDesc') },
    { emoji: '💰', title: t('about.features.budgetCooking'), desc: t('about.features.budgetCookingDesc') },
  ]

  return (
    <>
      <SEO title="About" description="Learn about NutriZen AI — the AI-powered smart kitchen assistant." />
      <div className="animate-fadeIn">
      <div className="relative overflow-hidden bg-gradient-to-br from-lime-600 via-lime-500 to-lime-600 py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-float">🥗</div>
          <div className="absolute top-20 right-20 text-5xl animate-float stagger-2">🤖</div>
          <div className="absolute bottom-16 left-1/4 text-4xl animate-float stagger-3">🥕</div>
          <div className="absolute top-1/3 right-1/4 text-5xl animate-float stagger-4">🍅</div>
          <div className="absolute bottom-20 right-10 text-4xl animate-float stagger-5">🥦</div>
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-5 py-1.5 mb-6 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span className="text-sm font-medium text-white/90">{t('about.tagline')}</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight drop-shadow-md">
            {t('about.title')}
          </h1>
          <p className="text-lg text-emerald-100/90 mb-6 leading-relaxed max-w-xl mx-auto">
            {t('about.tagline')} — {t('about.missionDesc')}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="glass-card rounded-2xl shadow-lg p-8 md:p-10 mb-16 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center text-lg shadow-md">🎯</div>
            <h2 className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">{t('about.mission')}</h2>
          </div>
          <p className="text-stone-600 dark:text-stone-300 leading-relaxed text-lg">
            {t('about.missionDesc')}
          </p>
        </div>

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-stone-100 mb-3">{t('home.featuresTitle')}</h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto">{t('home.featuresDesc')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {features.map((item, i) => (
            <div key={i} className="group glass-card rounded-2xl shadow-sm p-6 hover:shadow-xl hover:border-lime-300 dark:hover:border-lime-600 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                {item.emoji}
              </div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1.5 text-lg">{item.title}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl shadow-lg p-8 md:p-10 text-center mb-16 hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4">❤️</div>
          <h3 className="text-2xl font-extrabold text-stone-800 dark:text-stone-100 mb-2">{t('about.team')}</h3>
          <p className="text-stone-500 dark:text-stone-400 max-w-md mx-auto">
            {t('about.tagline')}
          </p>
        </div>


      </div>
    </div>
    </>
  )
}
