import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Target, Clock, AlertTriangle, ChevronRight, Wifi } from "lucide-react";
import BackgroundFX from "../components/BackgroundFX";
import RadarSweep from "../components/RadarSweep";
import GlassCard from "../components/GlassCard";

const features = [
  { icon: Clock, label: "30-Minute Mission", desc: "Timed assessment with auto-submission" },
  { icon: Shield, label: "Secure Environment", desc: "Anti-cheat monitoring active" },
  { icon: Target, label: "17 Questions", desc: "MCQ, Short & Long Answer" },
  { icon: Wifi, label: "Live Monitoring", desc: "Session tracked by administrators" },
];

const rules = [
  "Do NOT switch browser tabs during the exam.",
  "Do NOT minimize or leave the exam window.",
  "Do NOT press Escape or exit fullscreen mode.",
  "Exam auto-submits immediately on any violation.",
  "Results are reviewed exclusively by administrators.",
  "Ensure a stable internet connection before starting.",
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-navy-950 overflow-hidden">
      <BackgroundFX />

      {/* Scan line overlay */}
      <div className="fixed inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)",
        }}
      />

      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="border-b border-cyan-500/20 bg-navy-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-7 h-7 text-cyan-400" />
              <div>
                <span className="font-display text-sm font-bold text-cyan-300 tracking-widest uppercase">AirForce Exam Portal</span>
                <div className="font-mono text-xs text-metal-500 tracking-wider">SECURE ASSESSMENT SYSTEM v2.4</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <motion.div className="w-2 h-2 rounded-full bg-green-400"
                animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
              <span className="font-mono text-xs text-metal-400 hidden sm:block">SYSTEMS NOMINAL</span>
            </div>
          </div>
        </div>

        {/* Hero section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
          {/* Radar + title */}
          <div className="flex flex-col items-center gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative"
            >
              <RadarSweep size={160} />
              {/* Outer glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full border border-cyan-400/20"
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ margin: "-10px" }}
              />
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div className="font-mono text-xs text-cyan-400/70 tracking-[0.3em] mb-3 uppercase">
                Bangladesh Air Force
              </div>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-3"
                style={{ textShadow: "0 0 40px rgba(34,211,238,0.3)" }}>
                SELECTION<br />
                <span className="text-cyan-400">ASSESSMENT</span>
              </h1>
              <p className="font-body text-metal-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
                Authorized personnel only. This secure platform is used for official recruitment and promotion assessments.
              </p>
            </motion.div>
          </div>

          {/* Feature cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl w-full mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="rounded-xl border border-cyan-500/20 bg-slate-900/60 backdrop-blur-sm p-4 text-center"
                whileHover={{ borderColor: "rgba(34,211,238,0.5)", y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <f.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <div className="font-display text-xs font-bold text-white mb-1 tracking-wide">{f.label}</div>
                <div className="font-mono text-xs text-metal-500">{f.desc}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Rules card */}
          <motion.div
            className="max-w-2xl w-full mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <GlassCard className="p-5 sm:p-6" glow animate={false}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <h2 className="font-display text-sm font-bold text-yellow-400 tracking-widest uppercase">
                  Exam Rules — Anti-Cheat Protocol
                </h2>
              </div>
              <ul className="space-y-2">
                {rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-5 h-5 rounded bg-red-500/10 border border-red-500/30 flex items-center justify-center mt-0.5">
                      <span className="font-mono text-xs text-red-400">{i + 1}</span>
                    </div>
                    <span className="font-body text-sm text-slate-300">{rule}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-slate-700/60">
                <p className="font-mono text-xs text-metal-500 text-center">
                  By proceeding, you agree to these terms and consent to monitoring.
                </p>
              </div>
            </GlassCard>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <motion.button
              onClick={() => navigate("/register")}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative group px-10 py-4 rounded-xl font-display text-base font-bold tracking-widest uppercase text-navy-950 overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #22d3ee, #0ea5e9)",
                boxShadow: "0 0 30px rgba(34,211,238,0.4), 0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Proceed to Registration
                <ChevronRight className="w-5 h-5" />
              </span>
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
          </motion.div>

          {/* Admin link */}
          <motion.div
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
          >
            <button
              onClick={() => navigate("/admin/login")}
              className="font-mono text-xs text-metal-500 hover:text-cyan-400 transition-colors underline underline-offset-4"
            >
              Administrator Access →
            </button>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-cyan-500/10 py-3 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="font-mono text-xs text-metal-600">CLASSIFIED — AUTHORIZED USE ONLY</span>
            <span className="font-mono text-xs text-metal-600">ENC: AES-256 | SESSION MONITORED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
