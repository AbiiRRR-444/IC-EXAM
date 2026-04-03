import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", glow = false, animate = true, onClick }) {
  const baseClass = `
    relative rounded-xl border border-cyan-500/20
    bg-gradient-to-br from-slate-900/80 via-navy-900/70 to-slate-900/80
    backdrop-blur-md shadow-2xl
    ${glow ? "shadow-cyan-500/10 border-cyan-400/40" : ""}
    ${onClick ? "cursor-pointer" : ""}
    ${className}
  `;

  if (!animate) {
    return (
      <div className={baseClass} onClick={onClick}>
        {glow && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
        )}
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={baseClass}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
    >
      {glow && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
}
