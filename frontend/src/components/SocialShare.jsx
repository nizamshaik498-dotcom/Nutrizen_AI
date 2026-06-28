import { useState } from "react";
import { Share2, Check, Copy, MessageCircle, Instagram } from "lucide-react";

export default function SocialShare({ socialShare }) {
  const [activeLevel, setActiveLevel] = useState("easy");
  const [copied, setCopied] = useState(false);

  if (!socialShare) return null;

  const card = socialShare[activeLevel];
  if (!card) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Share2 size={20} className="text-blue-600" />
        <h3 className="text-lg font-semibold">Share</h3>
      </div>

      <div className="flex gap-1">
        {["easy", "intermediate", "advanced"].map((d) => (
          <button
            key={d}
            onClick={() => setActiveLevel(d)}
            className={`flex-1 py-1 text-xs rounded font-medium capitalize ${
              activeLevel === d ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="font-bold text-blue-900">{card.card_title}</h4>
        <p className="text-sm text-blue-700 mt-1">{card.one_line_description}</p>

        {card.hashtags?.length > 0 && (
          <p className="text-xs text-blue-500 mt-2">{card.hashtags.join(" ")}</p>
        )}

        <div className="space-y-2 mt-3">
          <button
            onClick={() => copyToClipboard(card.whatsapp_message)}
            className="w-full flex items-center justify-between gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600"
          >
            <span className="flex items-center gap-2"><MessageCircle size={16} /> WhatsApp</span>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>

          <button
            onClick={() => copyToClipboard(card.instagram_caption)}
            className="w-full flex items-center justify-between gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-600"
          >
            <span className="flex items-center gap-2"><Instagram size={16} /> Instagram</span>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>

        {card.share_url_slug && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Share slug: {card.share_url_slug}
          </p>
        )}
      </div>
    </div>
  );
}
