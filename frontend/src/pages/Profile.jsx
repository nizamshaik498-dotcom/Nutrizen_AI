import { useTranslation } from 'react-i18next'
import { useAuth } from '../utils/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'

export default function Profile() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return (
    <>
      <SEO title="Profile" description="Your NutriZen AI account profile." />
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <div className="glass-card rounded-2xl p-8 shadow-sm">
          <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/50 dark:to-teal-900/50 border-2 border-lime-200 dark:border-lime-700/50 flex items-center justify-center text-4xl shadow-lg">🔒</div>
          <p className="text-xl font-bold text-stone-700 dark:text-stone-200 mb-2">{t('auth.signInRequired')}</p>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-8">{t('auth.signInDesc')}</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="px-6 py-3 btn-glass btn-glass-lime rounded-xl text-sm">{t('nav.signIn')}</Link>
            <Link to="/signup" className="px-6 py-3 btn-glass btn-glass-blue rounded-xl text-sm">{t('nav.signUp')}</Link>
          </div>
        </div>
      </div>
    </>
  )

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <>
      <SEO title="Profile" description="Your NutriZen AI account profile." />
      <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-lime-600 via-lime-500 to-lime-600 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-xl shadow-lime-500/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-white/20">👤</div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-emerald-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-xs">✓</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{user.full_name || user.username}</h1>
            <p className="text-emerald-100/80 text-sm flex items-center gap-1.5">@{user.username}</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-4 border-b border-stone-200/60 dark:border-stone-700/40 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <h2 className="font-bold text-stone-800 dark:text-stone-100">{t('auth.accountDetails')}</h2>
        </div>
        <div className="p-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">{t('auth.email')}</p>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{user.email}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">{t('auth.age')}</p>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{user.age || t('auth.notSet')}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">{t('auth.allergies')}</p>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{user.allergies || t('auth.noneListed')}</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wide mb-1">{t('auth.dietaryPreferences')}</p>
              <p className="text-sm font-medium text-stone-700 dark:text-stone-200">{user.dietary_preferences || t('auth.noneListed')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={handleLogout} className="px-6 py-2.5 btn-glass btn-glass-red rounded-xl active:scale-[0.98] flex items-center gap-2">
          {t('nav.signOut')}
        </button>
        <Link to="/scan" className="px-6 py-2.5 btn-glass btn-glass-lime rounded-xl active:scale-[0.98] flex items-center gap-2">
          {t('nav.scan')}
        </Link>
      </div>
    </div>
    </>
  )
}
