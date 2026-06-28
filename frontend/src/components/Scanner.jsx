import { useState, useRef, useCallback, useEffect } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../utils/AuthContext'
import FridgeScanner from './FridgeScanner'
import { getFridgeItems } from '../utils/fridgeMode'

const API = 'https://FaizBasha05.pythonanywhere.com'

export default function Scanner({ onScanComplete }) {
  const { t } = useTranslation()
  const { getToken } = useAuth()
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState('upload')
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)

  const handleFile = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file); setPreview(URL.createObjectURL(file)); setError('')
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) { setImage(file); setPreview(URL.createObjectURL(file)); setError('') }
    else { setError(t('scanner.dropImage')) }
  }, [t])

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true) }, [])
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setDragOver(false) }, [])

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } })
      setStream(s)
    } catch { setError(t('scanner.cameraDenied')) }
  }, [t])

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  const captureFromCamera = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    canvasRef.current.width = videoRef.current.videoWidth
    canvasRef.current.height = videoRef.current.videoHeight
    ctx.drawImage(videoRef.current, 0, 0)
    canvasRef.current.toBlob((blob) => {
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' })
      setImage(file); setPreview(URL.createObjectURL(file))
    }, 'image/jpeg')
    if (stream) stream.getTracks().forEach(t => t.stop())
    setStream(null)
  }, [stream])

  const handleDemo = async () => {
    setLoading(true); setError('')
    try {
      const token = getToken()
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.get(`${API}/scan/demo`, { headers })
      if (onScanComplete) onScanComplete(res.data)
    } catch { setError(t('scanner.scanFailed')) }
    finally { setLoading(false) }
  }

  const handleScan = async () => {
    if (!image) { setError(t('scanner.selectImage')); return }
    setLoading(true); setError('')
    try {
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
      })
      const base64 = await toBase64(image)
      const token = getToken()
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const res = await axios.post(`${API}/scan/`, { image: base64 }, { headers })
      if (res.data?.error) { setError(res.data.error); return }
      if (onScanComplete) onScanComplete(res.data)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || t('scanner.scanFailed'))
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl shadow-sm p-6 md:p-8 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-lime-400 to-lime-600 rounded-xl flex items-center justify-center shadow-md ring-1 ring-lime-500/20"><span className="text-lg">📸</span></div>
          <div><h2 className="text-xl font-bold text-stone-800 dark:text-stone-100">{t('scanner.title')}</h2><p className="text-sm text-stone-400 dark:text-stone-500">{t('scanner.subtitle')}</p></div>
        </div>

        <div className="relative glass rounded-2xl p-1.5 mb-6">
          <div className="flex gap-1">
            {['upload', 'camera', 'fridge'].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(''); if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null) } }} className={`relative flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${mode === m ? 'bg-white dark:bg-stone-600 text-lime-600 dark:text-lime-300 shadow-sm' : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-white/50 dark:hover:bg-slate-600/30'}`}>
                <span className="flex items-center justify-center gap-2">
                  <span className={`text-base ${mode === m ? 'scale-110' : 'opacity-70'} transition-all duration-200`}>{m === 'upload' ? '📁' : m === 'camera' ? '📷' : '🧊'}</span>
                  <span>{m === 'upload' ? t('scanner.upload') : m === 'camera' ? t('scanner.camera') : t('fridgeMode.title')}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {mode === 'upload' && (
          <div onClick={() => !loading && fileRef.current?.click()} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave} aria-label="Upload image" className={`relative rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${dragOver ? 'border-lime-400 bg-lime-50/80 dark:bg-lime-900/30 scale-[1.01] shadow-lg shadow-lime-500/10' : 'border-dashed border-stone-200 dark:border-stone-600 hover:border-lime-300 dark:hover:border-lime-500 bg-stone-50/50 dark:bg-stone-800/50 hover:bg-lime-50/30 dark:hover:bg-lime-900/20'}`}>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} hidden />
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full bg-lime-100 dark:bg-lime-900/40 animate-ping opacity-25" />
                  <div className="absolute inset-0 border-[3px] border-lime-200/60 dark:border-emerald-800/60 rounded-full" />
                  <div className="absolute inset-0 border-[3px] border-transparent border-t-emerald-500 rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl">🔍</span></div>
                </div>
                <p className="text-lime-600 dark:text-lime-400 font-bold text-lg">{t('scanner.analyzing')}</p>
                <p className="text-stone-400 dark:text-stone-500 text-sm">{t('scanner.identifying')}</p>
              </div>
            ) : preview ? (
              <div className="relative group">
                <img src={preview} alt="Preview" loading="lazy" className="w-full max-h-72 object-contain p-4 img-blur loaded" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-black/20 transition-all duration-300" />
                <button onClick={(e) => { e.stopPropagation(); setImage(null); setPreview(null) }} className="absolute top-3 right-3 w-8 h-8 bg-stone-800/60 hover:bg-slate-800/80 text-white rounded-full flex items-center justify-center text-sm backdrop-blur-sm transition-all hover:scale-110 active:scale-95">✕</button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-lime-100 to-lime-200 dark:from-emerald-900/50 dark:to-emerald-800/50 rounded-2xl flex items-center justify-center text-3xl shadow-inner ring-1 ring-lime-500/10">
                  <span className="drop-shadow-sm">📸</span>
                </div>
                <div>
                  <p className="text-stone-600 dark:text-stone-300 text-lg font-semibold">{t('scanner.clickOrDrag')}</p>
                  <p className="text-stone-400 dark:text-stone-500 text-sm mt-0.5">{t('scanner.supports')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'camera' && (
          <div className="rounded-2xl overflow-hidden glass-card shadow-sm">
            {!stream ? (
              <div className="flex flex-col items-center py-12 gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 rounded-2xl flex items-center justify-center text-3xl shadow-inner ring-1 ring-blue-500/10">📷</div>
                <p className="text-stone-500 dark:text-stone-400">{t('scanner.clickToStartCamera')}</p>
                <button onClick={startCamera} aria-label="Camera capture" className="px-6 py-2.5 btn-glass btn-glass-blue rounded-xl font-semibold active:scale-[0.98]">{t('scanner.startCamera')}</button>
              </div>
            ) : (
              <div>
                <video ref={videoRef} autoPlay className="w-full max-h-72 object-contain bg-black/5 dark:bg-black/20" />
                <div className="flex gap-2 p-3 bg-stone-100/50 dark:bg-stone-700/50 backdrop-blur-sm">
                  <button onClick={captureFromCamera} aria-label="Camera capture" className="flex-1 px-4 py-2.5 btn-glass btn-glass-lime rounded-xl font-semibold active:scale-[0.98]">{t('scanner.capturePhoto')}</button>
                  <button onClick={() => { stream.getTracks().forEach(t => t.stop()); setStream(null) }} className="px-4 py-2.5 bg-stone-200 dark:bg-stone-600 text-stone-600 dark:text-stone-300 rounded-xl font-medium hover:bg-stone-300 dark:hover:bg-stone-500 transition-all duration-200 active:scale-[0.98]">{t('scanner.cancel')}</button>
                </div>
              </div>
            )}
            {preview && <div className="relative border-t border-stone-200 dark:border-stone-600"><img src={preview} alt="Captured" loading="lazy" className="w-full max-h-48 object-contain p-3" /></div>}
          </div>
        )}

        {mode === 'fridge' && <FridgeScanner />}

        {mode !== 'fridge' && getFridgeItems().length > 0 && (
          <div className="mt-4 p-3 rounded-xl glass flex items-center gap-2.5 text-sm">
            <span className="text-lg">🧊</span>
            <span className="text-stone-600 dark:text-stone-300"><strong className="text-lime-600 dark:text-lime-400">{getFridgeItems().length} items</strong> in your fridge — matches will show in scan results</span>
          </div>
        )}

        <canvas ref={canvasRef} hidden />

        {error && (
          <div className="mt-4 p-3 glass-card rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2.5 shadow-sm">
            <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-xs shrink-0">!</span>
            <span>{error}</span>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button onClick={handleScan} disabled={loading || !image} className="flex-1 btn-glass btn-glass-lime py-3 rounded-xl text-base flex items-center justify-center gap-2 active:scale-[0.98]">
            {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('scanner.analyzing')}</> : t('scanner.scanAndAnalyze')}
          </button>
          <button onClick={handleDemo} disabled={loading} className="px-6 py-3 btn-glass btn-glass-purple flex items-center justify-center gap-2 active:scale-[0.98]">
            {loading ? <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {t('common.loading')}</> : t('scanner.demoMode')}
          </button>
        </div>
      </div>
    </div>
  )
}
