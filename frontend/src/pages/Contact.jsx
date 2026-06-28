import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SEO from '../components/SEO'

export default function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [expanded, setExpanded] = useState(null)

  const faqItems = [
    { q: t('contact.faqQ1'), a: t('contact.faqA1') },
    { q: t('contact.faqQ2'), a: t('contact.faqA2') },
    { q: t('contact.faqQ3'), a: t('contact.faqA3') },
    { q: t('contact.faqQ4'), a: t('contact.faqA4') },
  ]

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`${t('contact.sent')} ${t('contact.responseTimeValue')}`)
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      <SEO title="Contact" description="Get in touch with the NutriZen AI team." />
      <div className="animate-fadeIn">
      <div className="relative overflow-hidden bg-gradient-to-br from-lime-600 via-lime-500 to-lime-600 py-20 md:py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl animate-float">📬</div>
          <div className="absolute top-20 right-20 text-5xl animate-float stagger-2">✉️</div>
          <div className="absolute bottom-16 left-1/4 text-4xl animate-float stagger-3">💬</div>
          <div className="absolute top-1/3 right-1/4 text-5xl animate-float stagger-4">📧</div>
        </div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight drop-shadow-md">{t('contact.title')}</h1>
          <p className="text-lg text-emerald-100/90 leading-relaxed max-w-xl mx-auto">
            {t('contact.title')}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: '📧', title: t('contact.email'), value: 'support@nutrivision.ai', gradient: 'from-blue-400 to-indigo-500' },
            { icon: '📍', title: t('contact.location'), value: 'Remote · Worldwide', gradient: 'from-rose-400 to-pink-500' },
            { icon: '⏱️', title: t('contact.responseTime'), value: t('contact.responseTimeValue'), gradient: 'from-lime-400 to-lime-500' },
          ].map((item, i) => (
            <div key={i} className="group glass-card rounded-2xl shadow-sm p-6 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-stone-800 dark:text-stone-100 mb-1">{item.title}</h3>
              <p className="text-sm text-stone-500 dark:text-stone-400">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div className="glass-card rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center text-lg shadow-md">✉️</div>
              <h2 className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">{t('contact.submit')}</h2>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">{t('contact.name')}</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-700/80 border border-stone-200/80 dark:border-stone-600/60 text-stone-800 dark:text-stone-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400/60 focus:border-lime-400 transition-all shadow-sm" placeholder={t('contact.name')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">{t('contact.email')}</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-700/80 border border-stone-200/80 dark:border-stone-600/60 text-stone-800 dark:text-stone-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400/60 focus:border-lime-400 transition-all shadow-sm" placeholder={t('contact.email')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">{t('contact.subject')}</label>
                <select name="subject" value={form.subject} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-700/80 border border-stone-200/80 dark:border-stone-600/60 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-lime-400/60 focus:border-lime-400 transition-all shadow-sm">
                  <option value="">{t('contact.subject')}</option>
                  <option value="General Inquiry">{t('contact.generalInquiry')}</option>
                  <option value="Bug Report">{t('contact.bugReport')}</option>
                  <option value="Feature Request">{t('contact.featureRequest')}</option>
                  <option value="Business">{t('contact.business')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">{t('contact.message')}</label>
                <textarea name="message" value={form.message} onChange={handleChange} required rows="5" className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-stone-700/80 border border-stone-200/80 dark:border-stone-600/60 text-stone-800 dark:text-stone-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400/60 focus:border-lime-400 transition-all resize-vertical shadow-sm" placeholder={t('contact.message')} />
              </div>
              <button type="submit" className="w-full py-3 btn-glass btn-glass-lime rounded-xl active:scale-[0.98]">{t('contact.submit')}</button>
            </form>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 bg-gradient-to-br from-lime-400 to-lime-500 rounded-xl flex items-center justify-center text-lg shadow-md">❓</div>
              <h2 className="text-2xl font-extrabold text-stone-800 dark:text-stone-100">{t('contact.title')}</h2>
            </div>
            <div className="space-y-3">
              {faqItems.map((item, i) => (
                <div key={i} className="glass-card rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                  <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50/80 dark:hover:bg-stone-700/40 transition-colors">
                    <span className="font-semibold text-stone-800 dark:text-stone-100 pr-4 text-sm">{item.q}</span>
                    <span className={`shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/50 dark:to-teal-900/50 flex items-center justify-center text-sm font-bold text-lime-600 dark:text-lime-400 transition-all duration-300 border border-lime-200/60 dark:border-lime-700/50 ${expanded === i ? 'rotate-180 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-800/60 dark:to-teal-800/60' : ''}`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {expanded === i && (
                    <div className="px-5 pb-5 animate-fadeIn">
                      <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
