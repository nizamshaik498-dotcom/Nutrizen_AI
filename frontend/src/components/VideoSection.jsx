import { useTranslation } from 'react-i18next'

export default function VideoSection({ recipeName, difficulty }) {
  const { t } = useTranslation()
  const searchQuery = encodeURIComponent(`${recipeName} recipe`)

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-500 rounded-lg flex items-center justify-center text-sm shadow-sm">🎥</div>
        <h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('videoSection.title')}</h2>
      </div>
      <div className="glass-card rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-stone-700 dark:text-stone-200">🍳 {t('videoSection.watch')}: {recipeName}</p>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{t('videoSection.learnWithVideo')}</p>
          </div>
          <a
            href={`https://www.youtube.com/results?search_query=${searchQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
          >
            ▶ {t('videoSection.watchOnYoutube')}
          </a>
        </div>
        {difficulty && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-red-200/40 dark:border-red-800/40">
            <span className="text-xs text-stone-500 dark:text-stone-400">{t('videoSection.suggested')}:</span>
            {['Easy', 'Authentic', 'Quick'].map(tag => (
              <a key={tag} href={`https://www.youtube.com/results?search_query=${searchQuery}+${tag.toLowerCase()}`} target="_blank" rel="noopener noreferrer" className="text-xs px-2.5 py-1 bg-white/60 dark:bg-stone-800/60 rounded-full text-stone-600 dark:text-stone-300 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200/40 dark:border-red-800/40 transition-colors">
                {tag}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
