import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import BackgroundFX from "../components/BackgroundFX";
import GlassCard from "../components/GlassCard";
import RadarSweep from "../components/RadarSweep";
import adminUsers from "../data/adminUsers";
import { setAdminSession } from "../utils/storage";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const match = adminUsers.find(
        (a) => a.username === username.trim() && a.password === password
      );
      if (match) {
        setAdminSession({ username: match.username, name: match.name, rank: match.rank });
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials. Access denied.");
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="relative min-h-screen bg-navy-950 overflow-hidden">
      <BackgroundFX />
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div className="flex flex-col items-center gap-5 mb-8" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <RadarSweep size={120} />
          <div className="text-center">
            <div className="font-mono text-xs text-red-400/70 tracking-[0.3em] uppercase mb-1">Restricted Access</div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">Admin <span className="text-cyan-400">Control Panel</span></h1>
            <p className="font-body text-metal-500 text-sm mt-1">Authorized examination board personnel only</p>
          </div>
        </motion.div>

        <GlassCard className="w-full max-w-sm p-7" glow>
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="font-display text-xs text-metal-400 tracking-widest uppercase">Secure Login</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-mono text-xs text-metal-400 tracking-wider uppercase mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metal-500" />
                <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter username"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 font-body text-sm placeholder-metal-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 transition-all" />
              </div>
            </div>
            <div>
              <label className="block font-mono text-xs text-metal-400 tracking-wider uppercase mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metal-500" />
                <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleLogin()} placeholder="Enter password"
                  className="w-full pl-9 pr-10 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 font-body text-sm placeholder-metal-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 transition-all" />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-metal-500 hover:text-metal-300 transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <AnimatePresence>
              {error && (
                <motion.div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="font-mono text-xs text-red-400">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button onClick={handleLogin} disabled={loading} whileHover={!loading ? { scale: 1.02 } : {}} whileTap={!loading ? { scale: 0.98 } : {}}
              className="w-full py-3 rounded-xl font-display text-sm font-bold tracking-widest uppercase text-navy-950 flex items-center justify-center gap-2 disabled:opacity-70"
              style={{ background: "linear-gradient(135deg, #22d3ee, #0ea5e9)", boxShadow: "0 0 20px rgba(34,211,238,0.25)" }}>
              {loading ? (
                <><motion.div className="w-4 h-4 border-2 border-navy-950/40 border-t-navy-950 rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }} />Authenticating...</>
              ) : (
                <><Shield className="w-4 h-4" /> Access Dashboard</>
              )}
            </motion.button>
          </div>
        </GlassCard>

        <motion.button onClick={() => navigate("/")} className="mt-5 font-mono text-xs text-metal-500 hover:text-cyan-400 transition-colors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          ← Return to Portal
        </motion.button>
        <motion.div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700/30 bg-slate-800/20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-mono text-xs text-metal-500">SSL ENCRYPTED — SESSION MONITORED</span>
        </motion.div>
      </div>
    </div>
  );
}
