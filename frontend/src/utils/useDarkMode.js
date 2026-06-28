import { useState, useEffect } from 'react'

export default function useDarkMode() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('nutrivision_dark')
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    const root = document.documentElement
    if (dark) root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('nutrivision_dark', dark)
  }, [dark])

  const toggle = () => setDark(prev => !prev)

  return [dark, toggle]
}
