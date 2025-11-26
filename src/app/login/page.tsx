"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, CalendarDays, User2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [usn, setUsn] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

 const handleSubmit = async (e: { preventDefault: () => void; }) => {
  e.preventDefault();

  if (!usn || !dob) {
    toast.error("Please enter USN and Date of Birth");
    return;
  }

  setLoading(true);

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usn, dob }),
      credentials: "include", // ⭐ MUST HAVE ⭐
    });

    const data = await res.json();

    if (res.ok && data.success) {
      toast.success("Login successful!");
      router.push("/dashboard");
    } else {
      toast.error(data.message || "Invalid credentials");
    }
  } catch (err) {
    toast.error("Server error. Try again.");
  }

  setLoading(false);
};


  return (
    <div className="w-full flex items-center justify-center p-4 bg-slate-900 min-h-screen">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px]">

        {/* Animated Border Container */}
        <div className="absolute inset-0 rounded-2xl border border-slate-700 bg-slate-800/20 backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 border-2 border-transparent animate-[borderGlow_5s_linear_infinite]" />
        
          {/* Login Columns */}
          <div className="w-full h-full flex flex-col md:flex-row">

            {/* =============== LEFT SECTION =============== */}
            <div className="md:w-1/2 p-10 flex items-center justify-center md:border-r border-slate-700/40">
              <div className="w-full max-w-md">
                
                {/* Heading */}
                <div className="text-center mb-10">
                  <User2 className="w-12 h-12 mx-auto text-indigo-400 mb-4" />
                  <h2 className="text-3xl font-bold text-white">Login</h2>
                  <p className="text-slate-400 mt-1">Access your NIE Portal</p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit}>

                  {/* USN */}
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">USN</label>
                    <div className="relative">
                      <User2 className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                      <input
                        type="text"
                        value={usn}
                        onChange={(e) => setUsn(e.target.value.toUpperCase())}
                        placeholder="4NI23CS167"
                        className="w-full bg-slate-800/30 text-white placeholder-slate-400 border border-slate-600 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* DOB */}
                  <div>
                    <label className="block mb-1 text-slate-300 font-medium">Date of Birth</label>
                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-3 text-slate-400 h-5 w-5" />
                      <input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-slate-800/30 text-white border border-slate-600 rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-semibold text-white shadow-md flex items-center justify-center"
                  >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Login"}
                  </button>
                </form>

                {/* Signup Link */}
                <div className="text-center mt-6">
                  <p className="text-slate-400 text-sm">
                    Don’t have an account?{" "}
                    <span className="text-indigo-400 hover:underline cursor-pointer">
                      Contact Admin
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* =============== RIGHT SECTION =============== */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-8 bg-gradient-to-br from-indigo-900/30 to-slate-800/10">
              
              <div className="text-center">
                <img
                  src="/login.png"
                  alt="Campus Art"
                  className="w-[85%] mx-auto object-contain drop-shadow-2xl"
                />

                <h3 className="text-xl font-semibold text-indigo-300 mt-6">
                  NIE Campus Recovery Portal
                </h3>

                <div className="flex gap-3 justify-center mt-4">
                  <span className="px-4 py-1 rounded-full bg-slate-800/40 text-indigo-300 border border-slate-600 text-sm">
                    Secure
                  </span>
                  <span className="px-4 py-1 rounded-full bg-slate-800/40 text-indigo-300 border border-slate-600 text-sm">
                    Fast
                  </span>
                  <span className="px-4 py-1 rounded-full bg-slate-800/40 text-indigo-300 border border-slate-600 text-sm">
                    Campus Verified
                  </span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
