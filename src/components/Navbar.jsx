import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function Navbar({ title = "AirForce Exam Portal", subtitle }) {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/20 bg-navy-950/90 backdrop-blur-md"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Shield className="w-8 h-8 text-cyan-400" />
            <motion.div
              className="absolute inset-0 rounded-full bg-cyan-400/20"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h1 className="font-display text-sm sm:text-base font-bold text-cyan-300 tracking-widest uppercase">
              {title}
            </h1>
            {subtitle && (
              <p className="font-mono text-xs text-metal-400 tracking-wider">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-cyan-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="font-mono text-xs text-metal-400 hidden sm:inline">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Scan line effect at bottom of nav */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
    </motion.nav>
  );
}
