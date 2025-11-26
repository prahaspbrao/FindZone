"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch, FiArrowLeft, FiLock } from "react-icons/fi";
import { useRouter } from "next/navigation";

export default function SearchItemsPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [lostItems, setLostItems] = useState<any[]>([]);
  const [foundItems, setFoundItems] = useState<any[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ================== FETCH LOGGED IN USER ==================
  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setLoggedInUserId(Number(data.userId)));

    fetchItems("");
  }, []);

  // ================== FETCH ITEMS ==================
  const fetchItems = async (searchQuery = "") => {
    const res = await fetch("/api/search", {
      method: "POST",
      body: JSON.stringify({ query: searchQuery }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    setLostItems(data.lostItems || []);
    setFoundItems(data.foundItems || []);
  };

  const handleSearch = () => fetchItems(query.trim());

  // ================== SEND OTP ==================
  const handleVerifyAndReturn = async (itemId: number) => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      body: JSON.stringify({ itemId }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!data.success) return alert(data.message);

    setCurrentEmail(data.email);
    setCurrentItemId(itemId);
    setOtp(["", "", "", "", "", ""]);
    setShowOtpModal(true);

    setTimeout(() => inputRefs.current[0]?.focus(), 150);
  };

  // ================== VERIFY OTP ==================
  const verifyOtp = async () => {
    if (otp.includes("")) return alert("Enter the full OTP");

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
    if (!data.success) return alert(data.message);

    alert("Item successfully returned!");
    setShowOtpModal(false);
    router.push("/dashboard");
  };

  // ================== BUTTON COMPONENT ==================
  const VerifyButton = ({ item, isFound }: any) => {
    const isCreator = item.userId === loggedInUserId;
    const disabled = isCreator || item.isReturned;

    return (
      <button
        disabled={disabled}
        onClick={() =>
          !disabled && handleVerifyAndReturn(item.id)
        }
        className={`mt-4 w-full py-2 rounded-xl font-semibold flex items-center justify-center gap-2 transition
          ${disabled
            ? "bg-gray-700 cursor-not-allowed opacity-60"
            : isFound
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
      >
        {isCreator ? (
          <>
            <FiLock className="text-lg" />
            <span>You Cannot Verify Your Own Item</span>
          </>
        ) : item.isReturned ? (
          "Already Returned"
        ) : (
          isFound ? "Verify & Get" : "Verify & Return"
        )}
      </button>
    );
  };

  // ================== UI ==================
  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute -top-24 -left-20 w-[350px] h-[350px] bg-indigo-500 blur-[160px] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-purple-600 blur-[160px] opacity-30"></div>

      {/* HEADER */}
      <header className="w-full px-6 sm:px-10 py-4 flex justify-between items-center bg-black/30 backdrop-blur-2xl border-b border-white/10 shadow-xl relative z-30">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition"
        >
          <FiArrowLeft className="text-xl" />
          Back
        </button>

        <div className="flex items-center gap-4">
          <img src="/nie-logo.png" className="w-14 h-14" />
          <div>
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              NIE Find Zone
            </h2>
            <p className="text-slate-300 text-xs">
              The National Institute of Engineering, Mysuru
            </p>
          </div>
        </div>
      </header>

      {/* BANNER */}
      <div className="relative w-full h-[260px] overflow-hidden shadow-xl mb-10 rounded-b-3xl">
        <img src="/search-banner.webp" className="w-full h-full object-cover opacity-85" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900"></div>

        <div className="absolute bottom-6 left-6">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
            Search Items
          </h1>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-3xl mx-auto flex gap-4 bg-white/10 border border-white/20 backdrop-blur-xl p-4 rounded-2xl shadow-xl mb-10">
        <FiSearch className="text-indigo-300 text-3xl" />
        <input
          type="text"
          placeholder="Search by description, location, USN..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 bg-transparent outline-none text-white"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold"
        >
          Search
        </button>
      </div>

      {/* ITEMS GRID */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 pb-20">

        {/* LOST ITEMS */}
        <div className="bg-white/10 p-6 rounded-2xl border border-red-400/30 shadow-xl">
          <h2 className="text-3xl font-bold text-red-300 mb-4">Lost Items</h2>

          {lostItems.map((item) => (
            <div key={item.id} className="bg-white/5 p-5 rounded-xl border hover:border-red-400/40 transition shadow-md mb-5">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>USN:</strong> {item.usn}</p>
              <p><strong>Date:</strong> {new Date(item.reportedAt).toLocaleDateString()}</p>

              <VerifyButton item={item} isFound={false} />
            </div>
          ))}
        </div>

        {/* FOUND ITEMS */}
        <div className="bg-white/10 p-6 rounded-2xl border border-green-400/30 shadow-xl">
          <h2 className="text-3xl font-bold text-green-300 mb-4">Found Items</h2>

          {foundItems.map((item) => (
            <div key={item.id} className="bg-white/5 p-5 rounded-xl border hover:border-green-400/40 transition shadow-md mb-5">
              <h3 className="text-xl font-semibold">{item.name}</h3>
              <p><strong>Description:</strong> {item.description}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>USN:</strong> {item.usn}</p>
              <p><strong>Date:</strong> {new Date(item.reportedAt).toLocaleDateString()}</p>

              <VerifyButton item={item} isFound={true} />
            </div>
          ))}
        </div>
      </div>

      {/* OTP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-2xl shadow-2xl w-full max-w-md">
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
                  className="w-12 h-14 text-2xl bg-slate-700 rounded-xl text-center outline-none"
                />
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setShowOtpModal(false)} className="px-4 py-2 bg-gray-600 rounded-lg">
                Cancel
              </button>
              <button onClick={verifyOtp} className="px-4 py-2 bg-indigo-600 rounded-lg">
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
