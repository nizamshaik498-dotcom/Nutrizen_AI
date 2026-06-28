import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'nutrivision_onboarded'

const steps = [
  {
    emoji: '📸',
    title: 'Scan Any Vegetable',
    desc: 'Upload a photo or use your camera. AI identifies vegetables instantly and generates a complete nutrition report.',
  },
  {
    emoji: '🍳',
    title: 'Get Smart Recipes',
    desc: 'Three difficulty levels — Easy, Intermediate, Advanced. Each recipe includes cost estimates and cooking tips.',
  },
  {
    emoji: '📅',
    title: 'Plan & Shop',
    desc: 'Add recipes to your meal planner, build a categorized shopping list, and track freshness with expiry reminders.',
  },
]

export default function OnboardingTour() {
  const { t: _t } = useTranslation()
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setShow(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 animate-scaleIn">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 rounded-2xl flex items-center justify-center text-4xl mb-5 shadow-lg">
            {steps[step].emoji}
          </div>
          <h3 className="text-xl font-bold text-stone-800 dark:text-stone-100 mb-2">{steps[step].title}</h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed mb-8">{steps[step].desc}</p>

          <div className="flex gap-2 mb-8">
            {steps.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-lime-500' : 'bg-slate-300 dark:bg-stone-600'}`} />
            ))}
          </div>

          <div className="flex gap-3 w-full">
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 px-4 py-2.5 border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 rounded-xl text-sm font-medium hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-all">
                Back
              </button>
            )}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} className="flex-1 px-4 py-2.5 btn-glass btn-glass-lime rounded-xl text-sm font-semibold">
                Next
              </button>
            ) : (
              <button onClick={dismiss} className="flex-1 px-4 py-2.5 btn-glass btn-glass-lime rounded-xl text-sm font-semibold">
                Get Started 🚀
              </button>
            )}
          </div>

          <button onClick={dismiss} className="mt-4 text-xs text-stone-400 dark:text-stone-500 hover:text-stone-500 dark:hover:text-stone-400 transition-colors">
            Skip tour
          </button>
        </div>
      </div>
    </div>
  )
}
