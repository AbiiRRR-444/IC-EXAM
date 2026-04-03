import { motion } from "framer-motion";

export default function RadarSweep({ size = 200, className = "" }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle cx={cx} cy={cy} r={r} fill="rgba(5,14,31,0.9)" stroke="rgba(34,211,238,0.4)" strokeWidth="1.5" />

        {/* Concentric rings */}
        {[0.25, 0.5, 0.75, 1].map((f, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r * f}
            fill="none"
            stroke="rgba(34,211,238,0.15)"
            strokeWidth="1"
          />
        ))}

        {/* Cross hairs */}
        <line x1={cx} y1={4} x2={cx} y2={size - 4} stroke="rgba(34,211,238,0.2)" strokeWidth="0.8" />
        <line x1={4} y1={cy} x2={size - 4} y2={cy} stroke="rgba(34,211,238,0.2)" strokeWidth="0.8" />

        {/* Static blip dots */}
        <circle cx={cx - r * 0.3} cy={cy - r * 0.4} r="3" fill="rgba(34,211,238,0.7)" />
        <circle cx={cx + r * 0.5} cy={cy - r * 0.2} r="2" fill="rgba(56,189,248,0.6)" />
        <circle cx={cx + r * 0.2} cy={cy + r * 0.55} r="2.5" fill="rgba(34,211,238,0.5)" />
        <circle cx={cx - r * 0.6} cy={cy + r * 0.3} r="1.5" fill="rgba(103,232,249,0.6)" />
      </svg>

      {/* Sweeping line */}
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: "center center" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            <radialGradient id="sweepGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(34,211,238,0.0)" />
              <stop offset="100%" stopColor="rgba(34,211,238,0.5)" />
            </radialGradient>
            <clipPath id="radarClip">
              <circle cx={cx} cy={cy} r={r} />
            </clipPath>
          </defs>
          {/* Sweep wedge */}
          <path
            d={`M ${cx} ${cy} L ${cx} ${4} A ${r} ${r} 0 0 1 ${cx + r * Math.sin(Math.PI / 6)} ${cy - r * Math.cos(Math.PI / 6)} Z`}
            fill="rgba(34,211,238,0.08)"
            clipPath="url(#radarClip)"
          />
          {/* Sweep line */}
          <line
            x1={cx} y1={cy} x2={cx} y2={4}
            stroke="rgba(34,211,238,0.8)"
            strokeWidth="1.5"
            clipPath="url(#radarClip)"
          />
        </svg>
      </motion.div>
    </div>
  );
}
