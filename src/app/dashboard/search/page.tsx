"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function SearchItemsPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [lostItems, setLostItems] = useState<any[]>([]);
  const [foundItems, setFoundItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fetchItems = async (searchQuery = "") => {
    setLoading(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ query: searchQuery }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setLostItems(
        (data.lostItems || []).map((x: any) => ({
          ...x,
          usn: x.user?.usn || x.usn || "N/A",
        }))
      );
      setFoundItems(
        (data.foundItems || []).map((x: any) => ({
          ...x,
          usn: x.user?.usn || x.usn || "N/A",
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems("");
  }, []);

  const handleSearch = () => {
    fetchItems(query.trim());
  };

  const handleVerifyAndReturn = async (itemId: number) => {
    try {
      const sendRes = await fetch("/api/send-otp", {
        method: "POST",
        body: JSON.stringify({ itemId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await sendRes.json();
      if (!sendRes.ok) return alert(data.message || "Unable to send OTP");

      setCurrentEmail(data.email);
      setCurrentItemId(itemId);
      setOtp(["", "", "", "", "", ""]);
      setShowOtpModal(true);

      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (err) {
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
  if (otp.includes("")) return alert("Enter full OTP");

  try {
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        code: otp.join(""),
        email: currentEmail,
        itemId: currentItemId,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!data.success) return alert("Incorrect OTP!");

    alert("Item returned successfully!");
    setShowOtpModal(false);

    // ⭐ Redirect to dashboard after success
    setTimeout(() => {
      router.push("/dashboard");
    }, 800); // small delay for alert close

  } catch (err) {
    alert("Verification failed");
  }
};


  return (
  <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">

    {/* ===================== BACKGROUND GLOW ===================== */}
    <div className="absolute -top-24 -left-24 w-[350px] h-[350px] bg-indigo-500 blur-[150px] opacity-25"></div>
    <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-purple-600 blur-[150px] opacity-25"></div>

    {/* ===================== HEADER ===================== */}
    <header className="w-full px-6 sm:px-10 py-4 flex justify-between items-center 
      bg-black/30 backdrop-blur-2xl border-b border-white/10 shadow-lg relative z-30
      before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px]
      before:bg-gradient-to-r before:from-indigo-500 before:to-purple-400 before:opacity-60">
      
      {/* Left: Logo + College Name */}
      <div className="flex items-center gap-4">
        <img
          src="/nie-logo.png"
          alt="NIE Logo"
          className="w-14 h-14 drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        />

        <div className="leading-tight select-none">
          <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r 
            from-indigo-300 to-purple-300 bg-clip-text text-transparent">
            NIE Find Zone
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm">
            The National Institute of Engineering, Mysuru
          </p>
        </div>
      </div>

      <button
        onClick={() => router.push("/")}
        className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 
        rounded-xl font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer">
        Logout
      </button>
    </header>

    {/* ===================== HERO IMAGE BANNER ===================== */}
    <div className="relative w-full h-[230px] sm:h-[280px] overflow-hidden shadow-xl mb-10">
      <img
        src="/search-banner.webp"   // <-- Add a campus search-themed or abstract image
        alt="Search Banner"
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

      <div className="absolute bottom-6 left-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent drop-shadow-xl">
          Search Items
        </h1>
        <p className="text-slate-300 mt-2 text-lg">Find lost & found items instantly.</p>
      </div>
    </div>

    {/* ===================== SEARCH BAR ===================== */}
    <div className="max-w-3xl mx-auto flex gap-4 bg-white/10 border border-white/20 backdrop-blur-xl p-4 rounded-2xl shadow-xl mb-10">
      <FiSearch className="text-indigo-300 text-3xl" />

      <input
        type="text"
        placeholder="Search by item name, description, USN…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        className="flex-1 bg-transparent outline-none text-white placeholder-slate-400"
      />

      <button
        onClick={handleSearch}
        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition cursor-pointer">
        Search
      </button>
    </div>

    {/* ===================== COUNTERS ===================== */}
    <div className="max-w-6xl mx-auto flex gap-4 mb-10">
      <span className="px-6 py-2 bg-red-500/20 border border-red-500/30 text-red-300 rounded-xl font-semibold backdrop-blur-xl">
        Lost: {lostItems.length}
      </span>

      <span className="px-6 py-2 bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl font-semibold backdrop-blur-xl">
        Found: {foundItems.length}
      </span>
    </div>

    {/* ===================== MAIN GRID ===================== */}
    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 pb-20">

      {/* LOST ITEMS */}
      <div className="bg-white/5 backdrop-blur-xl border border-red-400/20 rounded-2xl p-6 shadow-xl">
        <h2 className="text-3xl font-bold text-red-300 mb-4">Lost Items</h2>

        {lostItems.length === 0 ? (
          <p className="text-slate-400">No lost items found.</p>
        ) : (
          <div className="space-y-5">
            {lostItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 p-5 rounded-xl border border-transparent hover:border-red-400/40 transition shadow-md"
              >
                {/* TITLE */}
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.name || "Unnamed Item"}
                </h3>

                {/* DETAILS */}
                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Location:</strong> {item.location || "N/A"}</p>
                <p><strong>Date:</strong> {new Date(item.reportedAt).toLocaleDateString()}</p>
                <p><strong>Reported By:</strong> {item.usn}</p>

                <p className="mt-2">
                  <strong>Status:</strong>{" "}
                  {item.isReturned ? (
                    <span className="text-green-400 font-bold">Returned</span>
                  ) : (
                    <span className="text-yellow-300 font-bold">Pending</span>
                  )}
                </p>

                {!item.isReturned && (
                  <button
                    onClick={() => handleVerifyAndReturn(item.id)}
                    className="mt-4 w-full py-2 bg-red-600 hover:bg-red-700 rounded-xl font-semibold transition cursor-pointer">
                    Verify & Return
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FOUND ITEMS */}
      <div className="bg-white/5 backdrop-blur-xl border border-green-400/20 rounded-2xl p-6 shadow-xl">
        <h2 className="text-3xl font-bold text-green-300 mb-4">Found Items</h2>

        {foundItems.length === 0 ? (
          <p className="text-slate-400">No found items.</p>
        ) : (
          <div className="space-y-5">
            {foundItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 p-5 rounded-xl border border-transparent hover:border-green-400/40 transition shadow-md"
              >
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.name || "Unnamed Item"}
                </h3>

                <p><strong>Description:</strong> {item.description}</p>
                <p><strong>Location:</strong> {item.location || "N/A"}</p>
                <p><strong>Date:</strong> {new Date(item.reportedAt).toLocaleDateString()}</p>
                <p><strong>Reported By:</strong> {item.usn}</p>

                <p className="mt-2">
                  <strong>Status:</strong>{" "}
                  {item.isReturned ? (
                    <span className="text-green-400 font-bold">Returned</span>
                  ) : (
                    <span className="text-yellow-300 font-bold">Pending</span>
                  )}
                </p>

                {!item.isReturned && (
                  <button
                    onClick={() => handleVerifyAndReturn(item.id)}
                    className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 rounded-xl font-semibold transition cursor-pointer">
                    Verify & Get
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* ===================== OTP MODAL (UNCHANGED — JUST RESTYLED) ===================== */}
    {showOtpModal && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

        <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md">
          <h2 className="text-xl font-bold mb-3">Verify OTP</h2>
          <p className="text-slate-300 mb-4 text-sm">
            Enter the OTP sent to <span className="font-semibold">{currentEmail}</span>
          </p>

          {/* OTP INPUTS */}
          <div className="flex justify-center gap-3 mb-5">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                maxLength={1}
                inputMode="numeric"
                value={digit}
                ref={(el) => (inputRefs.current[idx] = el)}
                onChange={(e) => {
                  const val = e.target.value;
                  if (!/^\d?$/.test(val)) return;
                  const newOtp = [...otp];
                  newOtp[idx] = val;
                  setOtp(newOtp);
                  if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
                }}
                className="w-12 h-14 text-2xl bg-slate-700 rounded-xl text-center outline-none focus:ring-2 focus:ring-indigo-500"
              />
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setShowOtpModal(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={verifyOtp}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}
