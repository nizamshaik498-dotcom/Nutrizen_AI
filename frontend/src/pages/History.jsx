import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { getScanHistory } from "../services/api";
import { ArrowLeft, History as HistoryIcon, Camera, Loader2, Calendar } from "lucide-react";

export default function History() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getScanHistory(user.id).then(setScans).catch(() => {}).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <HistoryIcon size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Please log in to view history.</p>
          <button onClick={() => navigate("/profile")} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600 mb-4">
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex items-center gap-2 mb-6">
          <HistoryIcon size={22} className="text-teal-500" />
          <h1 className="text-2xl font-bold">Scan History</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-gray-400" /></div>
        ) : scans.length === 0 ? (
          <div className="text-center py-12">
            <Camera size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No scans yet. Start by scanning a vegetable!</p>
            <button onClick={() => navigate("/scan")} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg">
              Scan Now
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <button
                key={scan.id}
                onClick={() => navigate(`/scan`)}
                className="w-full bg-white border rounded-xl p-4 text-left hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100 p-2 rounded-full">
                      <Camera size={18} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {scan.detected_vegetables?.map((v) => v.common_name).join(", ") || "Scan"}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar size={12} />
                        {scan.created_at ? new Date(scan.created_at).toLocaleDateString() : ""}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                    {scan.detected_vegetables?.length || 0} items
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
