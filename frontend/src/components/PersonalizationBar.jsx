import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'nutrivision_age_group'

export function getAgeGroup() {
  return localStorage.getItem(STORAGE_KEY) || 'adult'
}

export function setAgeGroup(group) {
  localStorage.setItem(STORAGE_KEY, group)
}

export default function PersonalizationBar({ onAgeGroupChange }) {
  const { t } = useTranslation()
  const [ageGroup, setAgeGroupState] = useState(getAgeGroup)

  const groups = [
    { key: 'child', emoji: '👶', label: t('personalization.child') },
    { key: 'adult', emoji: '🧑', label: t('personalization.adult') },
    { key: 'elderly', emoji: '👴', label: t('personalization.elderly') },
  ]

  const handleChange = (key) => {
    setAgeGroupState(key)
    setAgeGroup(key)
    if (onAgeGroupChange) onAgeGroupChange(key)
  }

  return (
    <div className="flex items-center gap-3 glass-card rounded-xl px-4 py-2 shadow-sm">
      <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{t('personalization.cookFor')}:</span>
      {groups.map(g => (
        <button key={g.key} onClick={() => handleChange(g.key)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${ageGroup === g.key ? 'bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/50'}`}>
          <span>{g.emoji}</span> {g.label}
        </button>
      ))}
    </div>
  )
}
