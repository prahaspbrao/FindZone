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

  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Fetch items
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

  // On load – fetch items & logged-in user ID
  useEffect(() => {
    fetchItems("");

    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setLoggedInUserId(Number(data.userId)));
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

      setTimeout(() => {
        router.push("/dashboard");
      }, 800);
    } catch (err) {
      alert("Verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* HEADER */}
      <header className="w-full px-6 sm:px-10 py-4 flex justify-between items-center 
        bg-black/30 backdrop-blur-2xl border-b border-white/10 shadow-lg relative z-30">

        <div className="flex items-center gap-4">
          <img src="/nie-logo.png" className="w-14 h-14" />
          <div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              NIE Find Zone
            </h2>
            <p className="text-slate-300 text-sm">The National Institute of Engineering, Mysuru</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl font-semibold shadow-lg">
          Logout
        </button>
      </header>

      {/* SEARCH BAR */}
      <div className="max-w-3xl mx-auto flex gap-4 bg-white/10 border border-white/20 backdrop-blur-xl p-4 rounded-2xl shadow-xl mt-10 mb-10">
        <FiSearch className="text-indigo-300 text-3xl" />
        <input
          type="text"
          placeholder="Search by item name, description, USN…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-transparent outline-none text-white placeholder-slate-400"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-indigo-600 rounded-lg font-semibold cursor-pointer">
          Search
        </button>
      </div>

      {/* ITEMS GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 pb-20">
        {/* LOST ITEMS */}
        <div className="bg-white/5 p-6 rounded-2xl">
          <h2 className="text-3xl font-bold text-red-300 mb-4">Lost Items</h2>

          {lostItems.map((item) => (
            <div key={item.id} className="bg-white/5 p-5 rounded-xl mb-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p><strong>Reported By:</strong> {item.usn}</p>

              {/* ⭐ HIDE BUTTON IF CREATOR */}
              {!item.isReturned && item.userId !== loggedInUserId && (
                <button
                  onClick={() => handleVerifyAndReturn(item.id)}
                  className="mt-4 w-full py-2 bg-red-600 rounded-xl font-semibold cursor-pointer">
                  Verify & Return
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FOUND ITEMS */}
        <div className="bg-white/5 p-6 rounded-2xl">
          <h2 className="text-3xl font-bold text-green-300 mb-4">Found Items</h2>

          {foundItems.map((item) => (
            <div key={item.id} className="bg-white/5 p-5 rounded-xl mb-4">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p><strong>Reported By:</strong> {item.usn}</p>

              {/* ⭐ HIDE BUTTON IF CREATOR */}
              {!item.isReturned && item.userId !== loggedInUserId && (
                <button
                  onClick={() => handleVerifyAndReturn(item.id)}
                  className="mt-4 w-full py-2 bg-green-600 rounded-xl font-semibold cursor-pointer">
                  Verify & Get
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">Verify OTP</h2>
            <p className="text-slate-300 mb-4 text-sm">
              Enter the OTP sent to <span className="font-semibold">{currentEmail}</span>
            </p>

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
                  className="w-12 h-14 text-2xl bg-slate-700 rounded-xl text-center"
                />
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 bg-gray-600 rounded-lg cursor-pointer">
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                className="px-4 py-2 bg-indigo-600 rounded-lg cursor-pointer">
                Verify
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
