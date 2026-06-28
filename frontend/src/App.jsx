import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './utils/AuthContext'
import { useTranslation } from 'react-i18next'
import { lazy, Suspense, useState, useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import useDarkMode from './utils/useDarkMode'
import { AnimatePresence, motion } from 'framer-motion'
import VoiceAssistant from './components/VoiceAssistant'

const Home = lazy(() => import('./pages/Home'))
const Scan = lazy(() => import('./pages/Scan'))
const History = lazy(() => import('./pages/History'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Recipes = lazy(() => import('./pages/Recipes'))
const Nutrition = lazy(() => import('./pages/Nutrition'))
const ShoppingList = lazy(() => import('./pages/ShoppingList'))
const CookingMode = lazy(() => import('./pages/CookingMode'))
const MealPlanner = lazy(() => import('./pages/MealPlanner'))
const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Profile = lazy(() => import('./pages/Profile'))
import OnboardingTour from './components/OnboardingTour'
import { ToastProvider } from './utils/ToastContext'
import SiteLockGate from './components/SiteLockGate'

function Nav() {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const links = [
    { to: '/', label: t('nav.home'), icon: '🏠' },
    { to: '/scan', label: t('nav.scan'), icon: '📷' },
    { to: '/recipes', label: t('nav.recipes'), icon: '🍳' },
    { to: '/nutrition', label: t('nav.nutrition'), icon: '🥗' },
    { to: '/shopping-list', label: t('nav.shoppingList'), icon: '🛒' },
    { to: '/meal-planner', label: t('nav.mealPlanner'), icon: '📅' },
    { to: '/history', label: t('nav.history'), icon: '📜' },
    { to: '/about', label: t('nav.about'), icon: 'ℹ️' },
  ]
  return (
    <div className="flex gap-0.5 items-center overflow-x-auto scrollbar-none">
      {links.map(l => (
        <Link key={l.to} to={l.to} aria-current={pathname === l.to ? 'page' : undefined} className={`link-underline px-2 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap flex items-center gap-1 ${pathname === l.to ? 'glass text-lime-700 dark:text-lime-300 ring-1 ring-lime-300/50 dark:ring-lime-500/30' : 'text-stone-600 dark:text-stone-300 hover:text-lime-600 dark:hover:text-lime-400 hover:glass hover:scale-[1.02]'}`}>
          <span className="text-xs sm:text-[15px]">{l.icon}</span>
          <span className="hidden sm:inline">{l.label}</span>
        </Link>
      ))}
    </div>
  )
}

function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress')
    if (!bar) return
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : '0%'
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return <div id="scroll-progress" />
}

function TiltHandler() {
  useEffect(() => {
    const handler = (e) => {
      document.querySelectorAll('.tilt-card').forEach(card => {
        const rect = card.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        const child = card.firstElementChild
        if (child) child.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 8}deg)`
      })
    }
    const reset = () => {
      document.querySelectorAll('.tilt-card').forEach(card => {
        const child = card.firstElementChild
        if (child) child.style.transform = ''
      })
    }
    window.addEventListener('mousemove', handler)
    window.addEventListener('mouseleave', reset)
    return () => {
      window.removeEventListener('mousemove', handler)
      window.removeEventListener('mouseleave', reset)
    }
  }, [])
  return null
}

function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`back-to-top w-12 h-12 btn-glass btn-glass-lime rounded-2xl flex items-center justify-center text-xl shadow-lg ${visible ? 'visible' : ''}`}
      title="Back to top"
    >
      ↑
    </button>
  )
}

function OfflineIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine)
  useEffect(() => {
    const goOff = () => setOffline(true)
    const goOn = () => setOffline(false)
    window.addEventListener('offline', goOff)
    window.addEventListener('online', goOn)
    return () => { window.removeEventListener('offline', goOff); window.removeEventListener('online', goOn) }
  }, [])
  if (!offline) return null
  return (
    <div className="offline-banner fixed top-0 left-0 right-0 z-[999] bg-red-500 text-white text-center text-sm font-semibold py-2 px-4 shadow-lg">
      📡 You're offline — some features may be limited
    </div>
  )
}

function AppContent() {
  const { user, loading } = useAuth()
  const [dark, toggleDark] = useDarkMode()
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const changeLanguage = (lng) => { i18n.changeLanguage(lng); localStorage.setItem('nutrivision_lang', lng) }
  const currentLang = i18n.language || 'en'

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-lime-50/20 to-white dark:from-stone-900 dark:via-stone-800 dark:to-stone-900 flex flex-col transition-colors duration-300">
      <ScrollProgress />
      <TiltHandler />
      <OfflineIndicator />
      <nav className="sticky top-0 z-50 glass-nav shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Link to="/" className="flex items-center gap-2 group shrink-0 logo-hover">
            <div className="w-9 h-9 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:shadow-lime-400/20 transition-all duration-300 logo-icon animate-logoBounce">
              <span className="text-lg">🥗</span>
            </div>
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-lime-600 dark:from-lime-400 dark:to-lime-400 text-sm md:text-base hidden md:inline">
              NutriZen AI
            </span>
          </Link>
          <Nav />
          <div className="flex gap-1.5 shrink-0 items-center">
            {loading ? null : user ? (
              <Link to="/profile" className="px-3 py-1.5 text-sm font-medium text-lime-600 dark:text-lime-400 hover:glass rounded-lg transition-all flex items-center gap-1.5">
                <span>👤</span> <span className="hidden sm:inline">{user.username}</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-lime-600 dark:hover:text-lime-400 rounded-lg hover:glass transition-all">{t('nav.signIn')}</Link>
                <Link to="/signup" className="px-4 py-1.5 text-sm btn-glass btn-glass-lime rounded-lg">{t('nav.signUp')}</Link>
              </>
            )}
            <Link to="/contact" className="px-3 py-1.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:text-lime-600 dark:hover:text-lime-400 rounded-lg hover:glass hidden sm:inline transition-all">{t('nav.contact')}</Link>
            <select
              value={currentLang}
              onChange={(e) => changeLanguage(e.target.value)}
              className="text-xs bg-white/50 dark:bg-stone-800/50 border border-lime-200/30 dark:border-lime-700/30 rounded-lg px-2.5 py-1.5 text-stone-600 dark:text-stone-300 focus:outline-none focus:ring-2 focus:ring-lime-400/50 cursor-pointer backdrop-blur-sm transition-all glass"
            >
              <option value="en">EN</option>
              <option value="hi">हि</option>
              <option value="te">తె</option>
              <option value="ta">த</option>
              <option value="kn">ಕ</option>
              <option value="ml">മ</option>
              <option value="bn">বা</option>
              <option value="mr">मरा</option>
            </select>
            <button onClick={toggleDark} className="w-8 h-8 rounded-xl flex items-center justify-center glass hover:bg-lime-100/30 dark:hover:bg-lime-900/30 transition-all" title={dark ? 'Light mode' : 'Dark mode'}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 transition-all duration-500" style={{ transform: dark ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                {dark ? (
                  <path fill="#BEF264" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26 5.38 5.38 0 0 1-5.38-5.38c0-2.1 1.2-3.92 2.96-4.8A8.9 8.9 0 0 0 12 3z" />
                ) : (
                  <path fill="#84CC16" d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0-12V3m0 18v-2m8-8h2M4 12H2m15.07-7.07l1.41-1.41M5.64 18.36l1.41-1.41M18.36 18.36l1.41 1.41M6.34 5.64L4.93 4.22" stroke="#84CC16" strokeWidth="2" strokeLinecap="round" fill="none" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1">
        <OnboardingTour />
        <Suspense fallback={
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="skeleton skeleton-title mb-8" />
            <div className="skeleton skeleton-text w-3/4 mb-6" />
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              {[1,2,3].map(i => <div key={i} className="skeleton skeleton-card" />)}
            </div>
            <div className="skeleton skeleton-text w-1/2 mt-8" />
            <div className="skeleton skeleton-text w-full mt-2" />
            <div className="skeleton skeleton-text w-2/3 mt-2" />
          </div>
        }>
          <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/cooking-mode" element={<CookingMode />} />
            <Route path="/meal-planner" element={<MealPlanner />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={user ? <Profile /> : <Login />} />
          </Routes>
          </motion.div>
          </AnimatePresence>
          </Suspense>
      </main>
      <VoiceAssistant />
      <BackToTop />
      <footer className="mt-auto">
        <div className="max-w-6xl mx-auto px-4 pb-6 mb-4">
          <div className="glass-footer rounded-2xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-lime-500 to-lime-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-sm">🥗</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-lime-600 to-lime-600 dark:from-lime-400 dark:to-lime-400">NutriZen AI</span>
                  <p className="text-xs text-stone-400 dark:text-stone-500 mt-0.5">{t('footer.tagline')}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-stone-400 dark:text-stone-500">
                <Link to="/about" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">{t('nav.about')}</Link>
                <Link to="/contact" className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors">{t('nav.contact')}</Link>
              </div>
            </div>
            <div className="mt-8 text-center text-xs text-stone-400 dark:text-stone-600">
              &copy; {new Date().getFullYear()} NutriZen AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <SiteLockGate>
              <AppContent />
            </SiteLockGate>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  )
}
