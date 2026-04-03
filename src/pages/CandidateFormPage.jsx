import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Hash, BookOpen, Building, ChevronRight, AlertCircle } from "lucide-react";
import BackgroundFX from "../components/BackgroundFX";
import Navbar from "../components/Navbar";
import GlassCard from "../components/GlassCard";

const fields = [
  { name: "fullName", label: "Full Name", placeholder: "e.g. Cadet Rahim/Rahima", icon: User, type: "text" },
  { name: "serviceNumber", label: "Cadet Number", placeholder: "e.g. 25561200", icon: Hash, type: "text" },
  { name: "rank", label: "Current Rank", placeholder: "e.g. Cadet/Cadet LCPL", icon: BookOpen, type: "text" },
  { name: "unit", label: "Institution / Unit", placeholder: "e.g. BNCC Air Wing", icon: Building, type: "text" },
];

export default function CandidateFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    serviceNumber: "",
    rank: "",
    unit: "",
  });
  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    if (!form.serviceNumber.trim()) e.serviceNumber = "Cadet number is required.";
    if (!form.rank.trim()) e.rank = "Rank is required.";
    if (!form.unit.trim()) e.unit = "Unit is required.";
    if (!agreed) e.agreed = "You must acknowledge the exam rules.";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    sessionStorage.setItem("airforce_candidate", JSON.stringify(form));
    navigate("/exam");
  };

  return (
    <div className="relative min-h-screen bg-navy-950 overflow-hidden">
      <BackgroundFX />
      <Navbar subtitle="CANDIDATE REGISTRATION" />

      <div className="relative z-20 pt-24 pb-12 px-4 flex flex-col items-center">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="font-mono text-xs text-cyan-400/60 tracking-[0.3em] uppercase mb-2">Step 1 of 2</div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
            Candidate <span className="text-cyan-400">Registration</span>
          </h1>
          <p className="font-body text-metal-400 text-sm max-w-md">
            Enter your details accurately. These will be recorded with your submission.
          </p>
        </motion.div>

        <GlassCard className="w-full max-w-lg p-6 sm:p-8" glow>
          <div className="space-y-5">
            {fields.map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <label className="block font-mono text-xs text-metal-400 tracking-wider uppercase mb-1.5">
                  {f.label}
                </label>
                <div className="relative">
                  <f.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metal-500" />
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.name]}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, [f.name]: e.target.value }));
                      setErrors((p) => ({ ...p, [f.name]: undefined }));
                    }}
                    className={`w-full pl-9 pr-4 py-3 rounded-xl bg-slate-800/60 border font-body text-sm text-slate-100 placeholder-metal-600 focus:outline-none focus:ring-1 transition-all
                      ${errors[f.name]
                        ? "border-red-500/60 focus:border-red-400 focus:ring-red-400/20"
                        : "border-slate-700/60 focus:border-cyan-400/60 focus:ring-cyan-400/20"
                      }`}
                  />
                </div>
                {errors[f.name] && (
                  <motion.p
                    className="mt-1 font-mono text-xs text-red-400 flex items-center gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors[f.name]}
                  </motion.p>
                )}
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`rounded-xl border p-4 ${errors.agreed ? "border-red-500/40 bg-red-500/5" : "border-slate-700/40 bg-slate-800/30"}`}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => {
                    setAgreed(!agreed);
                    setErrors((p) => ({ ...p, agreed: undefined }));
                  }}
                  className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                    ${agreed ? "bg-cyan-400 border-cyan-400" : "border-slate-500 bg-transparent"}`}
                >
                  {agreed && (
                    <svg className="w-3 h-3 text-navy-950" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="font-body text-sm text-slate-300">
                  I acknowledge the exam rules and understand that switching tabs, minimizing the window, or exiting fullscreen will result in <span className="text-red-400 font-semibold">immediate auto-submission</span> of my exam.
                </span>
              </label>
              {errors.agreed && (
                <p className="mt-2 font-mono text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.agreed}
                </p>
              )}
            </motion.div>
          </div>

          <motion.button
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-6 w-full py-3.5 rounded-xl font-display text-sm font-bold tracking-widest uppercase text-navy-950 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #22d3ee, #0ea5e9)",
              boxShadow: "0 0 20px rgba(34,211,238,0.3)",
            }}
          >
            Proceed to Exam
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </GlassCard>

        <motion.div
          className="mt-6 max-w-lg w-full rounded-xl border border-yellow-500/30 bg-yellow-500/5 px-5 py-3 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <p className="font-mono text-xs text-yellow-300/80">
            Once you start the exam, the 30-minute timer begins immediately and cannot be paused.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
