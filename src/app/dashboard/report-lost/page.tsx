"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User2, Tag, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReportLost() {
  const router = useRouter();

  const [loggedInUSN, setLoggedInUSN] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ⭐ Load logged-in user details
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setLoggedInUSN(data.usn);
        setLoggedInUserId(data.userId);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !description.trim()) {
      setError("Please fill in all fields");
      return;
    }

    if (!loggedInUserId) {
      setError("User authentication error. Try logging in again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/report-lost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          userId: loggedInUserId, // ⭐ ONLY the logged-in user
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to report item");
      } else {
        setSuccess("Lost item reported successfully!");
        setName("");
        setDescription("");

        setTimeout(() => {
          router.push("/dashboard");
        }, 800);
      }
    } catch {
      setError("Unexpected server error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background Animation */}
      <motion.div
        className="absolute -top-32 -left-20 w-[350px] h-[350px] bg-rose-600 opacity-20 blur-[150px]"
        animate={{ x: [0, 20, -20, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[380px] h-[380px] bg-orange-500 opacity-20 blur-[150px]"
        animate={{ x: [0, -20, 20, 0], y: [0, 15, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />

      <div className="relative z-10 w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row">

        {/* LEFT FORM */}
        <div className="w-full md:w-1/2 p-10">

          <h2 className="text-3xl font-bold text-white text-center mb-2">
            Report Lost Item
          </h2>
          <p className="text-center text-slate-300 text-sm mb-8">
            Enter details about the item you lost on campus
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* USN (DISABLED FIXED) */}
            <div>
              <label className="block mb-1 text-slate-300 font-medium">Your USN</label>
              <div className="relative">
                <User2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  disabled
                  value={loggedInUSN}
                  className="w-full bg-slate-800/40 border border-slate-600 rounded-lg p-3 pl-10 text-white opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Item Name */}
            <div>
              <label className="block mb-1 text-slate-300 font-medium">Item Name</label>
              <div className="relative">
                <Tag className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800/40 border border-slate-600 rounded-lg p-3 pl-10 text-white"
                  placeholder="Eg. Calculator, ID Card"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block mb-1 text-slate-300 font-medium">Item Description</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800/40 border border-slate-600 rounded-lg p-3 pl-10 text-white"
                  placeholder="Where you lost it, color, brand, etc."
                />
              </div>
            </div>

            {/* Alerts */}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-green-400 text-sm">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 transition-all py-3 rounded-lg text-white font-semibold shadow-lg flex items-center justify-center"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit"}
            </button>
          </form>
        </div>

        {/* RIGHT IMAGE */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-rose-900/20 to-orange-900/10 p-10 items-center justify-center">
          <div className="text-center">

            <img
              src="/lost.jpeg"
              alt="Lost Illustration"
              className="w-[150%] drop-shadow-2xl"
            />

            <h3 className="text-xl font-semibold text-rose-300 mt-6">
              Help Us Recover Your Belongings
            </h3>

          </div>
        </div>

      </div>
    </div>
  );
}
