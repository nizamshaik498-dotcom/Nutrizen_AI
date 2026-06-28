import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../utils/AuthContext'
import SEO from '../components/SEO'

export default function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      await login(form.username, form.password)
      navigate('/scan')
    } catch (err) {
      setError(err.response?.data?.detail || t('auth.loginFailed'))
    } finally { setLoading(false) }
  }

  return (
    <>
      <SEO title="Sign In" description="Sign in to your NutriZen AI account." />
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="relative glass-card rounded-2xl shadow-xl p-8">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-lime-500/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-lime-500/20 text-2xl">🔐</div>
              <h1 className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">{t('auth.welcomeBack')}</h1>
              <p className="text-sm text-stone-400 dark:text-stone-500 mt-1.5">{t('auth.signInDesc')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">{t('auth.username')}</label>
                <input value={form.username} onChange={e => setForm({...form, username: e.target.value})} required className="w-full px-4 py-3 glass border border-stone-200/80 dark:border-stone-600/60 rounded-xl text-sm text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-lime-400/60 focus:border-lime-400 transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-500" placeholder={t('auth.username')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">{t('auth.password')}</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required className="w-full px-4 py-3 glass border border-stone-200/80 dark:border-stone-600/60 rounded-xl text-sm text-stone-700 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-lime-400/60 focus:border-lime-400 transition-all shadow-sm placeholder-slate-400 dark:placeholder-slate-500" placeholder={t('auth.password')} />
              </div>

              {error && (
                <div className="p-3.5 glass border border-red-300/50 dark:border-red-600/30 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0 text-xs">⚠</span>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-3 btn-glass btn-glass-lime rounded-xl disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2.5">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('auth.signingIn')}</> : t('auth.signIn')}
              </button>
            </form>

            <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-7 pt-5 border-t border-stone-200/60 dark:border-stone-700/40">
              {t('auth.noAccount')} <Link to="/signup" className="text-lime-600 dark:text-lime-400 font-semibold hover:text-lime-700 dark:hover:text-lime-300 transition-colors">{t('auth.createOne')}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
