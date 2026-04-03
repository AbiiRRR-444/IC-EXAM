import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { formatTime } from "../utils/helpers";

export default function Timer({ totalSeconds = 1800, onExpire }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const intervalRef = useRef(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          if (!expiredRef.current) {
            expiredRef.current = true;
            onExpire?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const pct = remaining / totalSeconds;
  const isLow = remaining <= 300; // under 5 min
  const isCritical = remaining <= 60;

  const color = isCritical
    ? "text-red-400"
    : isLow
    ? "text-yellow-400"
    : "text-cyan-400";

  const glowColor = isCritical
    ? "rgba(248,113,113,0.5)"
    : isLow
    ? "rgba(250,204,21,0.3)"
    : "rgba(34,211,238,0.3)";

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-xs text-metal-400 tracking-widest uppercase">Mission Clock</span>
      <motion.div
        className={`font-display text-2xl sm:text-3xl font-bold ${color} tabular-nums`}
        style={{ textShadow: `0 0 20px ${glowColor}` }}
        animate={isCritical ? { opacity: [1, 0.6, 1] } : {}}
        transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
      >
        {formatTime(remaining)}
      </motion.div>
      {/* Progress arc */}
      <svg width="60" height="8">
        <rect width="60" height="4" rx="2" fill="rgba(34,211,238,0.1)" y="2" />
        <rect
          width={60 * pct}
          height="4"
          rx="2"
          fill={isCritical ? "#f87171" : isLow ? "#facc15" : "#22d3ee"}
          y="2"
          style={{ transition: "width 1s linear" }}
        />
      </svg>
    </div>
  );
}
