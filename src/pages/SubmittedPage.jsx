import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Shield, Clock, AlertTriangle } from "lucide-react";
import BackgroundFX from "../components/BackgroundFX";
import GlassCard from "../components/GlassCard";
import { getSubmissionById } from "../utils/storage";
import { formatDateTime, getSubmitReasonLabel } from "../utils/helpers";

export default function SubmittedPage() {
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    const id = sessionStorage.getItem("airforce_last_submission_id");
    if (id) {
      setSubmission(getSubmissionById(id));
    }
    // Exit fullscreen if still active
    if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
  }, []);

  const isAutoSubmit = submission?.submitReason !== "manual" && submission?.submitReason !== "time_expired";

  return (
    <div className="relative min-h-screen bg-navy-950 overflow-hidden">
      <BackgroundFX />

      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Icon */}
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
        >
          <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2
            ${isAutoSubmit ? "border-yellow-400/50 bg-yellow-500/10" : "border-cyan-400/50 bg-cyan-500/10"}`}
          >
            {isAutoSubmit
              ? <AlertTriangle className="w-12 h-12 text-yellow-400" />
              : <CheckCircle className="w-12 h-12 text-cyan-400" />
            }
          </div>
          <motion.div
            className={`absolute inset-0 rounded-full border ${isAutoSubmit ? "border-yellow-400/30" : "border-cyan-400/30"}`}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Message */}
        <motion.div
          className="text-center mb-8 max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="font-mono text-xs text-cyan-400/60 tracking-[0.3em] uppercase mb-3">
            Submission Confirmed
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight">
            {isAutoSubmit ? (
              <>Exam <span className="text-yellow-400">Auto-Submitted</span></>
            ) : (
              <>Exam <span className="text-cyan-400">Submitted</span></>
            )}
          </h1>
          <p className="font-body text-metal-400 text-sm leading-relaxed">
            {isAutoSubmit
              ? "Your exam was automatically submitted due to a policy violation. Your answers have been recorded as-is at the time of submission."
              : "Your answers have been securely recorded and transmitted to the examination board. Results will be communicated through official channels."
            }
          </p>
        </motion.div>

        {/* Submission details card */}
        {submission && (
          <GlassCard className="w-full max-w-md p-6 mb-6" glow>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
                <span className="font-mono text-xs text-metal-500 uppercase tracking-wider">Candidate</span>
                <span className="font-body text-sm text-white">{submission.candidate?.fullName}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
                <span className="font-mono text-xs text-metal-500 uppercase tracking-wider">Service No.</span>
                <span className="font-mono text-sm text-cyan-400">{submission.candidate?.serviceNumber}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
                <span className="font-mono text-xs text-metal-500 uppercase tracking-wider">Submitted</span>
                <span className="font-body text-sm text-white">{formatDateTime(submission.submittedAt)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-700/40">
                <span className="font-mono text-xs text-metal-500 uppercase tracking-wider">Submission Type</span>
                <span className={`font-mono text-xs px-2 py-1 rounded-full border
                  ${submission.submitReason === "manual" ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" :
                    submission.submitReason === "time_expired" ? "text-blue-400 border-blue-500/40 bg-blue-500/10" :
                    "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"}`}>
                  {getSubmitReasonLabel(submission.submitReason)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="font-mono text-xs text-metal-500 uppercase tracking-wider">Submission ID</span>
                <span className="font-mono text-xs text-metal-400">{submission.id}</span>
              </div>
            </div>
          </GlassCard>
        )}

        {/* IMPORTANT: No results shown */}
        <motion.div
          className="max-w-md w-full rounded-xl border border-slate-700/40 bg-slate-800/30 p-4 text-center mb-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        >
          <Shield className="w-6 h-6 text-metal-500 mx-auto mb-2" />
          <p className="font-mono text-xs text-metal-500 leading-relaxed">
            Results and scores are confidential and will only be accessible to authorized administrators. Candidates will be notified through official channels.
          </p>
        </motion.div>

        {/* Return button */}
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-xl border border-cyan-500/30 font-display text-sm font-bold tracking-widest uppercase text-cyan-400 hover:bg-cyan-500/10 transition-all"
        >
          Return to Portal
        </motion.button>
      </div>
    </div>
  );
}
