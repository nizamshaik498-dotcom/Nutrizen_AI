import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { Camera, Upload, RefreshCw, Loader2 } from "lucide-react";

export default function Scanner({ onScanComplete }) {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState("camera");
  const [capturedImage, setCapturedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setCapturedImage(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const resetCapture = () => {
    setCapturedImage(null);
    setError(null);
  };

  const submitScan = async () => {
    if (!capturedImage) return;
    setLoading(true);
    setError(null);
    try {
      const blob = await (await fetch(capturedImage)).blob();
      const file = new File([blob], "scan.jpg", { type: "image/jpeg" });
      if (onScanComplete) {
        await onScanComplete(file);
      }
    } catch (err) {
      setError(err.message || "Scan failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode("camera"); resetCapture(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            mode === "camera" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          <Camera size={18} /> Camera
        </button>
        <button
          onClick={() => { setMode("upload"); resetCapture(); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
            mode === "upload" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
          }`}
        >
          <Upload size={18} /> Upload
        </button>
      </div>

      {mode === "camera" && !capturedImage && (
        <div className="relative">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }}
            className="w-full rounded-xl"
          />
          <button
            onClick={capture}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-800 p-4 rounded-full shadow-lg hover:bg-gray-100"
          >
            <Camera size={28} />
          </button>
        </div>
      )}

      {mode === "upload" && !capturedImage && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 transition"
        >
          <Upload size={48} className="mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">Tap to upload an image</p>
          <p className="text-sm text-gray-400">JPG, PNG accepted</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {capturedImage && (
        <div>
          <img src={capturedImage} alt="Captured" className="w-full rounded-xl" />
          <div className="flex gap-2 mt-3">
            <button
              onClick={resetCapture}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <RefreshCw size={18} /> Retake
            </button>
            <button
              onClick={submitScan}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
}
