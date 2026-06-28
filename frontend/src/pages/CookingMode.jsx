import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function CookingMode() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const r = location.state?.recipe || null

  const [currentStep, setCurrentStep] = useState(0)
  const timerRef = useRef(null)
  const [checked, setChecked] = useState([])
  const [timerSeconds, setTimerSeconds] = useState(0)

  const steps = Array.isArray(r?.steps) ? r.steps : []
  const ingredients = Array.isArray(r?.additional_ingredients_required) ? r.additional_ingredients_required : []

  useEffect(() => {
    if (window.__NUTRIVIZEN_AUTOSPEAK__ && steps[0]) {
      window.__NUTRIVIZEN_AUTOSPEAK__ = false
      setTimeout(() => {
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(`${r.name}. ${steps[0]}`)
          u.lang = 'en-US'; u.rate = 0.9
          window.speechSynthesis.speak(u)
        }
      }, 500)
    }
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(l => l).catch(() => {})
    }
    return () => { if (timerRef.current) { clearInterval(timerRef.current) } }
  }, [])

  if (!r) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="p-8 text-center"><p className="text-4xl mb-4">👨‍🍳</p><p className="text-white/80 text-xl">No recipe selected</p><p className="text-stone-500 mt-2 text-sm">Use the AI Assistant (🤖) to generate a recipe</p></div>
      </div>
    )
  }

  if (!steps.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900">
        <div className="p-8 text-center"><p className="text-4xl mb-4">🍳</p><p className="text-white/80 text-xl">{r.name}</p><p className="text-stone-500 mt-2 text-sm">No steps</p></div>
      </div>
    )
  }

  const prev = () => setCurrentStep(s => Math.max(0, s - 1))
  const toggleIngredient = (i) => setChecked(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])

  const startTimer = (m) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimerSeconds(m * 60)
    timerRef.current = setInterval(() => {
      setTimerSeconds(s => { if (s <= 1) { clearInterval(timerRef.current); timerRef.current = null; return 0 }; return s - 1 })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 text-white flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 sticky top-0 z-30" style={{background:'rgba(15,15,20,0.9)',backdropFilter:'blur(12px'}}>
        <h1 className="text-xl md:text-2xl font-bold truncate">{r.name}</h1>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-white/10 rounded-xl text-sm hover:bg-white/20">Exit</button>
      </header>

      <div className="flex items-center justify-center gap-2 py-3 px-6 sticky top-[60px] z-20" style={{background:'rgba(15,15,20,0.85)',backdropFilter:'blur(12px',borderTop:'1px solid rgba(255,255,255,0.05)'}}>
        <span className="text-xs text-stone-400">{currentStep+1}/{steps.length}</span>
        <div className="flex gap-1 flex-1 max-w-2xl overflow-x-auto" style={{scrollbarWidth:'none'}}>
          {steps.map((_, i) => (
            <button key={i} onClick={() => setCurrentStep(i)}
              className={`shrink-0 rounded-full transition-all ${i===currentStep?'w-8 h-1.5 bg-lime-400':i<currentStep?'w-2 h-2 bg-emerald-500':'w-2 h-2 bg-stone-600'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        <aside className="lg:w-80 p-6 border-b lg:border-b-0 lg:border-r lg:border-white/5">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><span className="w-1.5 h-5 bg-emerald-400 rounded-full inline-block" />{t('recipeCard.ingredients')}</h2>
          <div className="space-y-2.5">
            {ingredients.map((ing, i) => (
              <button key={i} onClick={() => toggleIngredient(i)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base flex items-center gap-3 transition-all ${checked.includes(i)?'bg-slate-700/50 text-stone-400 line-through':'bg-slate-700/30 hover:bg-slate-700/60'}`}>
                <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${checked.includes(i)?'bg-lime-500 border-lime-500':'border-stone-500'}`}>
                  {checked.includes(i)?'✓':''}
                </span>
                {ing}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/60">
            <h3 className="text-base font-semibold mb-3">⏱ Timer</h3>
            <div className="flex gap-2 flex-wrap">
              {[1,2,3,5,10,15].map(m => (
                <button key={m} onClick={() => startTimer(m)} className="px-3 py-2 bg-slate-700/50 rounded-xl text-sm hover:bg-slate-600/60">{m} min</button>
              ))}
            </div>
            {timerSeconds>0 && (
              <div className="mt-5 text-center bg-slate-700/30 rounded-xl p-4">
                <p className="text-4xl font-mono font-bold text-lime-400">{Math.floor(timerSeconds/60)}:{(timerSeconds%60).toString().padStart(2,'0')}</p>
                <button onClick={()=>{if(timerRef.current){clearInterval(timerRef.current);timerRef.current=null};setTimerSeconds(0)}} className="text-sm text-red-400 mt-2.5">Cancel</button>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <span className="text-sm font-bold text-lime-400">Step {currentStep+1} / {steps.length}</span>
              <div className="w-full bg-slate-700/60 rounded-full h-2 mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-lime-500 to-lime-400 h-2 rounded-full transition-all duration-500" style={{width:`${((currentStep+1)/steps.length)*100}%`}} />
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 md:p-10 mb-8 min-h-[200px] flex items-center justify-center border border-white/10">
              <p className="text-2xl md:text-3xl leading-relaxed text-center font-medium">{steps[currentStep]}</p>
            </div>

            <div className="flex justify-between gap-4 max-w-md mx-auto">
              <button onClick={prev} disabled={currentStep===0}
                className="flex-1 px-6 py-4 bg-slate-700/60 rounded-xl text-lg font-semibold disabled:opacity-30 hover:bg-slate-600/60">← Prev</button>
              {currentStep===steps.length-1
                ? <button onClick={() => navigate(-1)} className="flex-1 px-6 py-4 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-xl text-lg font-semibold">Done ✓</button>
                : <button onClick={()=>setCurrentStep(s=>Math.min(steps.length-1,s+1))} className="flex-1 px-6 py-4 bg-gradient-to-r from-lime-500 to-emerald-500 rounded-xl text-lg font-semibold">Next →</button>}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
