import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import useVoiceAssistant from '../hooks/useVoiceAssistant'

export default function VoiceAssistant() {
  const location = useLocation()
  const { isListening, transcript, isSupported, status, toggleListening, submitText } = useVoiceAssistant()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  useEffect(() => {
    if (transcript && isListening) setText(transcript)
  }, [transcript, isListening])

  if (location.pathname === '/cooking-mode') return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) { submitText(text.trim()); setText(''); setOpen(false) }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {status && !isListening && open && (
        <div className="glass-card rounded-2xl px-4 py-2.5 shadow-xl border border-lime-500/20 bg-stone-900/90 backdrop-blur-xl max-w-[260px]">
          <p className="text-xs text-stone-300">{status}</p>
        </div>
      )}
      {open && (
        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-3 shadow-xl border border-lime-500/20 bg-stone-900/95 backdrop-blur-xl w-[300px]">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <span className="text-xs font-semibold text-stone-300">AI Recipe Assistant</span>
            {isListening && <span className="text-[10px] text-red-400 animate-pulse ml-auto">Listening...</span>}
          </div>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="e.g. prepare chicken curry"
              className="flex-1 px-3 py-2.5 bg-stone-800 border border-stone-700 rounded-xl text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:border-lime-500/50"
            />
            <div className="flex gap-1.5">
              {isSupported && (
                <button type="button" onClick={toggleListening}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-stone-700 text-stone-300 hover:bg-stone-600'
                  }`}
                  title="Tap to speak"
                >🎤</button>
              )}
              <button type="submit" className="px-4 py-2.5 bg-lime-600 rounded-xl text-sm font-semibold text-white hover:bg-lime-500 transition-all">Go</button>
            </div>
          </div>
          <p className="text-[10px] text-stone-500 mt-2">
            Try: &ldquo;prepare biryani&rdquo; &bull; &ldquo;go to scan&rdquo; &bull; &ldquo;show recipes&rdquo;
          </p>
        </form>
      )}
      <button onClick={() => setOpen(o => !o)}
        className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-xl transition-all duration-300 active:scale-90 bg-gradient-to-br from-lime-400 to-lime-600 shadow-lime-500/30 hover:shadow-lime-500/50 hover:scale-105"
        aria-label="AI Assistant"
      >
        🤖
      </button>
    </div>
  )
}
