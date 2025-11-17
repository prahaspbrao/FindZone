"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiPlusCircle,
  FiAlertTriangle,
  FiLogOut,
} from "react-icons/fi";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute -top-20 -left-32 w-[350px] h-[350px] bg-indigo-500 blur-[160px] opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600 blur-[160px] opacity-30"></div>

      {/* ===================== HEADER ===================== */}
      <header className="w-full px-6 sm:px-10 py-4 flex justify-between items-center 
  bg-black/30 backdrop-blur-2xl border-b border-white/10 shadow-xl relative z-30
  before:absolute before:bottom-0 before:left-0 before:w-full before:h-[2px]
  before:bg-gradient-to-r before:from-indigo-500 before:to-purple-400 before:opacity-60  before:rounded-full">

  {/* Left Section: Logo + Title */}
  <div className="flex items-center gap-4">
    <div className="relative">
      <img
        src="/nie-logo.png"
        alt="NIE Logo"
        className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]"
      />
    </div>

    <div className="leading-tight select-none">
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-wide bg-gradient-to-r 
        from-indigo-300 to-purple-300 bg-clip-text text-transparent drop-shadow">
        NIE Find Zone
      </h2>

      <p className="text-slate-300 text-xs sm:text-sm opacity-90">
        The National Institute of Engineering, Mysuru
      </p>
    </div>
  </div>

  {/* Logout Button */}
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold cursor-pointer
      bg-gradient-to-r from-red-500 to-pink-500
      shadow-lg shadow-red-500/30 hover:shadow-red-500/50
      hover:scale-105 active:scale-95 transition-all"
  >
    <FiLogOut className="text-lg" />
    Logout
  </button>
</header>


      {/* ===================== BANNER IMAGE ===================== */}
      <div className="relative w-full h-[240px] sm:h-[300px] overflow-hidden rounded-b-3xl shadow-xl mb-10">
        <img
          src="/campus-banner.png"
          alt="Campus Banner"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

        <div className="absolute bottom-6 left-6">
          <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text drop-shadow-xl">
            Dashboard
          </h1>
          <p className="text-slate-300 mt-1 text-lg">
            Manage your campus lost & found activities
          </p>
        </div>
      </div>

      {/* ===================== CARDS ===================== */}
      <div className="relative z-20 grid grid-cols-1 md:grid-cols-3 gap-10 px-6 sm:px-12 pb-16">

        {/* Report Found */}
        <Link
          href="/dashboard/report-found"
          className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2"
        >
          <img
            src="/found-card.jpeg"
            className="w-full h-36 object-cover rounded-t-2xl opacity-90 group-hover:opacity-100 transition"
            alt="Report Found"
          />
          <div className="p-6">
            <FiPlusCircle className="text-indigo-300 text-4xl mb-3 group-hover:text-white transition" />
            <h2 className="text-2xl font-bold mb-1">Report Found Item</h2>
            <p className="text-slate-300 mb-6">
              Submit details of items you have found.
            </p>

            <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold cursor-pointer">
              Go to Report Found
            </button>
          </div>
        </Link>

        {/* Report Lost */}
        <Link
          href="/dashboard/report-lost"
          className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2"
        >
          <img
            src="/lost-card.jpeg"
            className="w-full h-36 object-cover rounded-t-2xl opacity-90 group-hover:opacity-100 transition"
            alt="Report Lost"
          />
          <div className="p-6">
            <FiAlertTriangle className="text-green-300 text-4xl mb-3 group-hover:text-white transition" />
            <h2 className="text-2xl font-bold mb-1">Report Lost Item</h2>
            <p className="text-slate-300 mb-6">
              Lost something? Report it here.
            </p>

            <button className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 transition font-semibold cursor-pointer">
              Go to Report Lost
            </button>
          </div>
        </Link>

        {/* Search Items */}
        <Link
          href="/dashboard/search"
          className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2"
        >
          <img
            src="/search-card.jpeg"
            className="w-full h-36 object-cover rounded-t-2xl opacity-90 group-hover:opacity-100 transition"
            alt="Search Items"
          />
          <div className="p-6">
            <FiSearch className="text-orange-300 text-4xl mb-3 group-hover:text-white transition" />
            <h2 className="text-2xl font-bold mb-1">Search Items</h2>
            <p className="text-slate-300 mb-6">
              Look up lost and found items.
            </p>

            <button className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 transition font-semibold cursor-pointer">
              Go to Search
            </button>
          </div>
        </Link>

      </div>
    </div>
  );
}
