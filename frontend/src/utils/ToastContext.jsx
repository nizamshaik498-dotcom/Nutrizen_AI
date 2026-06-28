import { createContext, useContext } from 'react'
import { useToast } from './useToast'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const { toasts, addToast, removeToast } = useToast()
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
          {toasts.map(t => (
            <div key={t.id} className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-slideInRight ${t.type === 'success' ? 'glass text-lime-700 dark:text-lime-300 border-lime-300/50 dark:border-lime-600/30' : t.type === 'error' ? 'glass text-red-700 dark:text-red-300 border-red-300/50 dark:border-red-600/30' : 'glass text-stone-700 dark:text-stone-200 border-stone-300/50 dark:border-stone-600/30'}`}>
              <span>{t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'ℹ'}</span>
              <span className="flex-1">{t.message}</span>
              <button onClick={() => removeToast(t.id)} className="opacity-50 hover:opacity-100 transition-opacity">✕</button>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToastContext must be used within ToastProvider')
  return ctx
}
