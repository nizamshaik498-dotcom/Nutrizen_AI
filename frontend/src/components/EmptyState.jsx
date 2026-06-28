import { useTranslation } from 'react-i18next'

export default function EmptyState({ emoji = '📭', title, description, action }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-6xl mb-5 animate-emptyFloat">{emoji}</div>
      <h3 className="text-xl font-bold text-stone-700 dark:text-stone-200 mb-2">{title || t('common.empty')}</h3>
      <p className="text-sm text-stone-400 dark:text-stone-500 max-w-xs mb-6">{description || t('common.emptyDesc')}</p>
      {action}
    </div>
  )
}