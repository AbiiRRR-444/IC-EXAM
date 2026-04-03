import { motion } from "framer-motion";

export default function ProgressBar({ current, total, answered }) {
  const pct = (current / total) * 100;
  const answeredPct = (answered / total) * 100;

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center">
        <span className="font-mono text-xs text-metal-400 tracking-wider">
          QUESTION {current} / {total}
        </span>
        <span className="font-mono text-xs text-cyan-400 tracking-wider">
          {answered} ANSWERED
        </span>
      </div>
      <div className="relative h-2 rounded-full bg-navy-700 overflow-hidden">
        {/* Answered progress (teal) */}
        <motion.div
          className="absolute h-full rounded-full bg-cyan-500/40"
          animate={{ width: `${answeredPct}%` }}
          transition={{ duration: 0.4 }}
        />
        {/* Current position indicator (bright) */}
        <motion.div
          className="absolute h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-400"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.3 }}
        />
        {/* Glow */}
        <motion.div
          className="absolute top-0 h-full w-4 bg-white/20 blur-sm rounded-full"
          animate={{ left: `${Math.max(pct - 2, 0)}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
