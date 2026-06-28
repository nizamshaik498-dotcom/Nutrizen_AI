import { useState, useRef } from "react";
import { Play, Pause, Volume2, SkipForward, ChevronDown, ChevronUp } from "lucide-react";

export default function VoiceGuide({ voiceCookingGuide }) {
  const [activeDifficulty, setActiveDifficulty] = useState("easy");
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef(window.speechSynthesis);

  if (!voiceCookingGuide) return null;

  const guide = voiceCookingGuide[activeDifficulty];
  if (!guide) return null;

  const speak = (text) => {
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    synthRef.current.speak(utterance);
  };

  const togglePlay = () => {
    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      if (guide.steps?.[currentStep]) {
        speak(guide.steps[currentStep].spoken_instruction);
        setIsPlaying(true);
      }
    }
  };

  const nextStep = () => {
    if (guide.steps && currentStep < guide.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      speak(guide.steps[currentStep + 1].spoken_instruction);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      speak(guide.steps[currentStep - 1].spoken_instruction);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Volume2 size={20} className="text-purple-600" />
        <h3 className="text-lg font-semibold">Voice Cooking Guide</h3>
      </div>

      <div className="flex gap-1">
        {["easy", "intermediate", "advanced"].map((d) => (
          <button
            key={d}
            onClick={() => { setActiveDifficulty(d); setCurrentStep(0); synthRef.current.cancel(); setIsPlaying(false); }}
            className={`flex-1 py-1 text-xs rounded font-medium capitalize ${
              activeDifficulty === d ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
        {guide.intro && <p className="text-sm text-purple-800 mb-3">{guide.intro}</p>}

        <div className="bg-white rounded-lg p-3 mb-3 min-h-[80px]">
          <p className="text-sm font-medium text-gray-700">
            Step {currentStep + 1} of {guide.steps?.length}
          </p>
          <p className="text-gray-800 mt-1">
            {guide.steps?.[currentStep]?.spoken_instruction}
          </p>
          {guide.steps?.[currentStep]?.timer_seconds > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              Timer: {guide.steps[currentStep].timer_seconds}s
            </p>
          )}
          {guide.steps?.[currentStep]?.user_prompt && (
            <p className="text-xs italic text-purple-600 mt-1">
              → {guide.steps[currentStep].user_prompt}
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button onClick={prevStep} disabled={currentStep === 0} className="p-2 disabled:opacity-30">
            <SkipForward size={20} className="rotate-180" />
          </button>
          <button onClick={togglePlay} className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button onClick={nextStep} disabled={currentStep >= (guide.steps?.length || 1) - 1} className="p-2 disabled:opacity-30">
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex gap-1 mt-3 justify-center">
          {guide.steps?.map((_, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${i === currentStep ? "bg-purple-600" : "bg-gray-300"}`} />
          ))}
        </div>

        {guide.completion_message && currentStep === (guide.steps?.length || 1) - 1 && (
          <p className="text-sm text-green-700 mt-3 text-center font-medium">
            {guide.completion_message}
          </p>
        )}
      </div>
    </div>
  );
}
