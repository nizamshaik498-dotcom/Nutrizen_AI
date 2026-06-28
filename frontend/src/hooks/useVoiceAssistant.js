import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API from '../utils/api'

export default function useVoiceAssistant() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [status, setStatus] = useState('')
  const navigate = useNavigate()
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)
  const finalRef = useRef('')

  useEffect(() => {
    setIsSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  }, [])

  const speak = useCallback((text) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.9
    window.speechSynthesis.speak(u)
  }, [])

  const process = useCallback(async (text) => {
    const t = text.trim()
    if (!t) return
    setTranscript(t)
    setStatus('Thinking...')
    try {
      const res = await axios.post(`${API}/ai/command`, { prompt: t }, { timeout: 30000 })
      const recipe = res.data?.recipe
      if (recipe && recipe.name && recipe.steps?.length) {
        setStatus(`Starting ${recipe.name}`)
        window.__NUTRIVIZEN_RECIPE__ = recipe
        window.__NUTRIVIZEN_AUTOSPEAK__ = true
        navigate('/cooking-mode')
        setTimeout(() => speak(`${recipe.name}. ${recipe.steps[0]}`), 500)
      } else {
        setStatus('Could not generate recipe')
        speak('Sorry, could not generate that recipe')
      }
    } catch {
      setStatus('Error reaching AI')
      speak('Sorry, something went wrong')
    }
  }, [navigate, speak])

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    setIsListening(true)
    setTranscript('')
    setStatus('')
    finalRef.current = ''

    let rec
    try { rec = new SR() } catch { setIsListening(false); setStatus('Speech recognition not available'); return }

    rec.continuous = false
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (e) => {
      for (let i = e.results.length - 1; i >= 0; i--) {
        const r = e.results[i]
        if (r.isFinal) {
          finalRef.current = r[0].transcript
          setTranscript(finalRef.current)
          clearTimeout(timerRef.current)
          rec.stop()
          return
        } else if (i === e.results.length - 1) {
          setTranscript(r[0].transcript)
        }
      }
    }

    rec.onend = () => {
      setIsListening(false)
      clearTimeout(timerRef.current)
      if (finalRef.current) process(finalRef.current)
    }

    rec.onerror = (e) => {
      setIsListening(false)
      if (e.error === 'not-allowed') setStatus('Please allow microphone access in browser settings')
      else if (e.error === 'no-speech') setStatus('No speech detected')
      else setStatus('Microphone error - try typing instead')
    }

    try { rec.start(); recognitionRef.current = rec } catch (e) { setIsListening(false); setStatus('Could not start microphone: ' + e.message) }
    timerRef.current = setTimeout(() => { try { rec.stop() } catch (e) { console.warn(e) } }, 10000)
  }, [process])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) { try { recognitionRef.current.stop() } catch (e) { console.warn(e) }; recognitionRef.current = null }
    clearTimeout(timerRef.current)
    setIsListening(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (recognitionRef.current) stopListening()
    else startListening()
  }, [startListening, stopListening])

  const submitText = useCallback((text) => {
    if (recognitionRef.current) stopListening()
    if (text && text.trim()) process(text)
  }, [process, stopListening])

  const clearStatus = useCallback(() => setStatus(''), [])

  useEffect(() => {
    return () => { if (recognitionRef.current) { try { recognitionRef.current.abort() } catch (e) { console.warn(e) } }; clearTimeout(timerRef.current) }
  }, [])

  return { isListening, transcript, isSupported, status, clearStatus, toggleListening, submitText }
}
