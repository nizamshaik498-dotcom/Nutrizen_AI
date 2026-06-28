import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'
import useScrollReveal from '../hooks/useScrollReveal'

function CountUp({ end, duration = 1500 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const counted = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true
        const start = performance.now()
        const step = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setCount(Math.floor(eased * end))
          if (p < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])
  return <span ref={ref}>{count}</span>
}

const particles = Array.from({ length: 8 }).map((_) => ({
  width: 4 + Math.random() * 8,
  height: 4 + Math.random() * 8,
  left: 10 + Math.random() * 80,
  top: 10 + Math.random() * 80,
  delay: Math.random() * 5,
  duration: 4 + Math.random() * 4,
}))

export default function Home() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const featuresRevealRef = useScrollReveal()
  const ctaRevealRef = useScrollReveal()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      const cards = sectionRef.current.querySelectorAll('.animate-on-scroll')
      cards.forEach((el) => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    const el = document.getElementById('stats-section')
    if (el) {
      const statCards = el.querySelectorAll('.animate-stat')
      statCards.forEach((c) => observer.observe(c))
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    const el = document.getElementById('features-section')
    if (el) {
      const featureCards = el.querySelectorAll('.animate-feature')
      featureCards.forEach((c) => observer.observe(c))
    }

    return () => observer.disconnect()
  }, [])

  const features = [
    { emoji: '📸', title: t('home.features.smartScan'), desc: t('home.features.smartScanDesc') },
    { emoji: '🍳', title: t('home.features.threeLevelRecipes'), desc: t('home.features.threeLevelRecipesDesc') },
    { emoji: '🥦', title: t('home.features.nutritionPer100g'), desc: t('home.features.nutritionPer100gDesc') },
    { emoji: '🩺', title: t('home.features.allergyReport'), desc: t('home.features.allergyReportDesc') },
    { emoji: '🔄', title: t('home.features.smartSubstitutions'), desc: t('home.features.smartSubstitutionsDesc') },
    { emoji: '📊', title: t('home.features.mealBalanceScore'), desc: t('home.features.mealBalanceScoreDesc') },
  ]

  const stats = [
    { value: 5, suffix: '+', label: t('home.stats.vegetables') },
    { value: 15, suffix: '+', label: t('home.stats.recipes') },
    { value: 9, suffix: '', label: t('home.stats.allergyGroups') },
    { value: 100, suffix: '%', label: t('home.stats.free') },
  ]

  return (
    <>
      <SEO title="Home" description="Your smart kitchen companion. Scan vegetables, get AI-powered recipes, nutrition, and allergy insights." />
      <div ref={sectionRef}>
      <div className="relative overflow-hidden bg-gradient-to-br from-lime-700 via-lime-600 to-lime-600 animate-gradient py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-20">
          {particles.map((p, i) => (
            <div key={i} className="particle animate-particleFloat" style={{
              width: `${p.width}px`,
              height: `${p.height}px`,
              background: 'rgba(255,255,255,0.3)',
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }} />
          ))}
          <div className="absolute top-10 left-10 w-20 h-20 glass rounded-2xl flex items-center justify-center text-3xl animate-float stagger-1 shadow-lg">🥦</div>
          <div className="absolute top-20 right-20 w-16 h-16 glass rounded-xl flex items-center justify-center text-2xl animate-float stagger-3 shadow-lg">🍅</div>
          <div className="absolute bottom-16 left-1/4 w-14 h-14 glass rounded-xl flex items-center justify-center text-xl animate-float stagger-5 shadow-md">🥕</div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 glass rounded-xl flex items-center justify-center text-2xl animate-float stagger-2 shadow-lg">🥬</div>
          <div className="absolute bottom-20 right-10 w-14 h-14 glass rounded-xl flex items-center justify-center text-xl animate-float stagger-6 shadow-md">🌶️</div>
          <div className="absolute top-40 left-1/2 w-12 h-12 glass rounded-lg flex items-center justify-center text-lg animate-float stagger-4 shadow-md">🧄</div>
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-1.5 mb-6 shadow-[0_0_20px_rgba(132,204,22,0.3)]">
            <span className="w-2 h-2 rounded-full bg-lime-300 animate-pulse" />
            <span className="text-sm font-medium text-white/90">{t('home.aiPowered')}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            <span className="animate-textReveal inline-block" style={{ animationDelay: '0.1s' }}>{t('home.heroTitle')}</span>
            <span className="block text-emerald-200 mt-2 animate-textReveal" style={{ animationDelay: '0.3s' }}>{t('home.heroTitleLine2')}</span>
          </h1>
          <p className="text-lg md:text-xl text-emerald-50/85 mb-10 leading-relaxed max-w-2xl mx-auto animate-textReveal" style={{ animationDelay: '0.5s' }}>
            {t('home.heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/scan"
              className="group inline-flex items-center gap-2 btn-glass btn-glass-white px-8 py-3.5 rounded-xl text-lg active:scale-[0.97] animate-glow"
            >
              {t('home.startScanning')}
              <span className="inline-block group-hover:translate-x-1.5 transition-transform duration-300 ease-out">→</span>
            </Link>
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 glass rounded-xl px-8 py-3.5 text-lg font-semibold text-white hover:bg-white/20 transition-all duration-300"
            >
              {t('home.tryDemo')} <span>🎮</span>
            </Link>
          </div>
        </div>
      </div>

      <div id="stats-section" className="max-w-5xl mx-auto px-4 -mt-10 relative z-10 reveal reveal-visible">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="animate-stat opacity-0 relative glass-card rounded-2xl shadow-lg p-5 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-lime-500 to-lime-500 rounded-l-2xl" />
              <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-lime-600 dark:from-lime-400 dark:to-lime-400"><CountUp end={s.value} />{s.suffix}</div>
              <div className="text-sm text-stone-500 dark:text-stone-400 font-medium mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div id="features-section" className="max-w-5xl mx-auto px-4 py-20 reveal" ref={featuresRevealRef}>
        <div className="text-center mb-12 animate-on-scroll opacity-0">
          <h2 className="text-3xl md:text-4xl font-extrabold text-stone-800 dark:text-stone-100 mb-3">{t('home.featuresTitle')}</h2>
          <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto">{t('home.featuresDesc')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {features.map((item, i) => (
            <div
              key={i}
              className="animate-feature opacity-0 group relative glass-card rounded-2xl shadow-sm p-6 hover:shadow-xl hover:shadow-lime-500/5 hover:-translate-y-1.5 transition-all duration-300 hover-gradient-border tilt-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-14 h-14 glass rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                {item.emoji}
              </div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-lime-700 via-lime-600 to-lime-600 py-16 reveal" ref={ctaRevealRef}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(255,255,255,0.1)_0%,_transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-6 left-10 w-14 h-14 glass rounded-xl flex items-center justify-center text-xl animate-float stagger-2 shadow-lg">🥦</div>
          <div className="absolute bottom-6 right-10 w-14 h-14 glass rounded-xl flex items-center justify-center text-xl animate-float stagger-4 shadow-lg">🍳</div>
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">{t('home.ctaTitle')}</h2>
          <p className="text-emerald-100/85 mb-8 max-w-lg mx-auto">{t('home.ctaDesc')}</p>
          <Link
            to="/scan"
            className="inline-flex items-center gap-2 btn-glass btn-glass-white px-10 py-4 rounded-xl text-lg active:scale-[0.97]"
          >
            {t('home.getStarted')} <span>→</span>
          </Link>
        </div>
      </div>
    </div>
    </>
  )
}
