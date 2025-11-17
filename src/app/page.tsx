"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, PackageSearch } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="absolute inset-0 h-screen w-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900 text-white px-4 sm:px-6">

      {/* ===================== PREMIUM HEADER ===================== */}
      <header className="absolute top-0 left-0 w-full z-30">
        <div className="
          w-full 
          px-6 sm:px-12 py-4 
          flex items-center justify-between
          bg-black/50 
          backdrop-blur-xl 
          border-b border-white/10 
          shadow-[0_4px_30px_rgba(0,0,0,0.4)]
        ">
          
          {/* LEFT: Logo + Institute Name */}
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src="/nie-logo.png"
              alt="NIE Logo"
              className="w-15 h-15 sm:w-14 sm:h-14 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
            />

            <div className="flex flex-col leading-tight">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.2)]">
                The National Institute of Engineering
              </h1>
              <span className="text-sm sm:text-base text-indigo-200 tracking-wide">
                Mysuru
              </span>
            </div>
          </div>

          {/* RIGHT: Two Buttons */}
          <div className="flex items-center gap-3 sm:gap-4">

            {/* Parent NIE Button */}
            <a
              href="https://parent.nie.ac.in/"
              target="_blank"
              className="
                px-4 py-2 
                rounded-lg 
                bg-white/10 
                border border-white/20 
                text-white 
                text-sm sm:text-base 
                hover:bg-white/20 
                transition-all 
                shadow-md
              "
            >
              Parent NIE
            </a>

            {/* Visit College Button */}
            <a
              href="https://nie.ac.in/"
              target="_blank"
              className="
                px-4 py-2 
                rounded-lg 
                bg-indigo-600 
                text-white 
                text-sm sm:text-base 
                font-semibold 
                hover:bg-indigo-700 
                transition-all 
                shadow-lg shadow-indigo-500/30
              "
            >
              Visit Website
            </a>

          </div>

        </div>
      </header>

      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#4f4f4f1e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1e_1px,transparent_1px)] bg-[size:18px_28px]" />

      {/* Animated glow blobs */}
      <motion.div
        className="absolute top-0 left-0 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-indigo-500 opacity-25 blur-[100px] sm:blur-[140px]"
        animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 right-0 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-purple-500 opacity-25 blur-[100px] sm:blur-[140px]"
        animate={{ x: [0, -30, 30, 0], y: [0, 20, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating icons */}
      <motion.div
        className="absolute top-24 sm:top-32 right-12 sm:right-24 text-indigo-400/40"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <PackageSearch size={36} className="sm:size-48" />
      </motion.div>

      <motion.div
        className="absolute bottom-20 sm:bottom-28 left-12 sm:left-20 text-purple-400/40"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <Search size={36} className="sm:size-48" />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center max-w-sm sm:max-w-2xl mt-40 sm:mt-48"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold mb-4 sm:mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(129,140,248,0.3)]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          Find Zone
        </motion.h1>

        <motion.p
          className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 leading-relaxed px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Report lost items, find belongings, and connect with your campus —  
          quick, simple, and secure.
        </motion.p>

        {/* Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <button
            onClick={() => router.push("/login")}
            className="group px-8 py-3 sm:px-10 sm:py-4 rounded-2xl bg-indigo-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-all flex items-center gap-2"
          >
            Continue
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              →
            </motion.span>
          </button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <footer className="absolute bottom-3 sm:bottom-4 text-gray-500 text-xs sm:text-sm">
        © {new Date().getFullYear()} Find Zone • Minor Project
      </footer>
    </div>
  );
}
