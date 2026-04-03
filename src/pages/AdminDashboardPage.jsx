import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield, LogOut, ChevronRight, ChevronLeft, CheckCircle,
  XCircle, Clock, Users, FileText, Save, Eye, AlertTriangle
} from "lucide-react";
import BackgroundFX from "../components/BackgroundFX";
import GlassCard from "../components/GlassCard";
import { getAllSubmissions, getAdminSession, clearAdminSession, updateSubmission } from "../utils/storage";
import { formatDateTime, getSubmitReasonLabel, scoreSubmission, getTotalManualMarks } from "../utils/helpers";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [admin] = useState(getAdminSession());
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [markInputs, setMarkInputs] = useState({});
  const [feedback, setFeedback] = useState("");
  const [saved, setSaved] = useState(false);
  const [view, setView] = useState("list"); // "list" | "detail"

  useEffect(() => {
    setSubmissions(getAllSubmissions().reverse());
    fetch("/questions.json").then((r) => r.json()).then(setQuestions).catch(() => {});
  }, []);

  const openSubmission = (sub) => {
    setSelected(sub);
    setMarkInputs(sub.adminMarks || {});
    setFeedback(sub.adminFeedback || "");
    setSaved(false);
    setView("detail");
  };

  const handleSave = () => {
    if (!selected) return;
    const updates = {
      adminMarks: markInputs,
      adminFeedback: feedback,
      reviewed: true,
      reviewedBy: admin?.name,
      reviewedAt: new Date().toISOString(),
    };
    updateSubmission(selected.id, updates);
    setSubmissions(getAllSubmissions().reverse());
    setSaved(true);
    setSelected((prev) => ({ ...prev, ...updates }));
  };

  const handleLogout = () => {
    clearAdminSession();
    navigate("/admin/login");
  };

  const { mcqScore, mcqTotal } = selected && questions.length > 0
    ? scoreSubmission(selected, questions)
    : { mcqScore: 0, mcqTotal: 0 };
  const manualTotal = getTotalManualMarks(markInputs);
  const grandTotal = mcqScore + manualTotal;
  const maxTotal = mcqTotal + 5 * 5 + 2 * 10; // 10 mcq + 5 short(5ea) + 2 long(10ea)

  const nonMcqQuestions = questions.filter((q) => q.type !== "mcq");
  const mcqQuestions = questions.filter((q) => q.type === "mcq");

  return (
    <div className="relative min-h-screen bg-navy-950 overflow-hidden">
      <BackgroundFX />

      {/* Top nav */}
      <div className="sticky top-0 z-30 border-b border-cyan-500/20 bg-navy-950/90 backdrop-blur-md px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view === "detail" && (
              <button onClick={() => setView("list")} className="flex items-center gap-1 text-metal-400 hover:text-cyan-400 transition-colors mr-2">
                <ChevronLeft className="w-4 h-4" />
                <span className="font-mono text-xs">Back</span>
              </button>
            )}
            <Shield className="w-6 h-6 text-cyan-400" />
            <div>
              <div className="font-display text-sm font-bold text-white tracking-wider">Admin Dashboard</div>
              <div className="font-mono text-xs text-metal-500">{admin?.rank} {admin?.name}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-mono text-xs tracking-wider">
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">

          {/* ===================== LIST VIEW ===================== */}
          {view === "list" && (
            <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                  { label: "Total Submissions", value: submissions.length, icon: Users, color: "text-cyan-400" },
                  { label: "Reviewed", value: submissions.filter((s) => s.reviewed).length, icon: CheckCircle, color: "text-green-400" },
                  { label: "Pending Review", value: submissions.filter((s) => !s.reviewed).length, icon: Clock, color: "text-yellow-400" },
                  { label: "Auto-Submitted", value: submissions.filter((s) => s.submitReason !== "manual").length, icon: AlertTriangle, color: "text-red-400" },
                ].map((stat, i) => (
                  <GlassCard key={i} className="p-4" animate={false}>
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="font-mono text-xs text-metal-500 uppercase tracking-wider">{stat.label}</span>
                    </div>
                    <div className={`font-display text-3xl font-black ${stat.color}`}>{stat.value}</div>
                  </GlassCard>
                ))}
              </div>

              <h2 className="font-display text-lg font-bold text-white tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                Submissions
              </h2>

              {submissions.length === 0 ? (
                <GlassCard className="p-10 text-center" animate={false}>
                  <p className="font-body text-metal-500">No submissions yet.</p>
                </GlassCard>
              ) : (
                <div className="space-y-3">
                  {submissions.map((sub, i) => {
                    const { mcqScore: ms, mcqTotal: mt } = questions.length > 0 ? scoreSubmission(sub, questions) : { mcqScore: 0, mcqTotal: 0 };
                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        onClick={() => openSubmission(sub)}
                        className="group cursor-pointer rounded-xl border border-slate-700/40 bg-slate-900/60 backdrop-blur-sm p-4 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-8 rounded-full ${sub.reviewed ? "bg-green-400" : "bg-yellow-400"}`} />
                            <div>
                              <div className="font-body text-sm font-semibold text-white">{sub.candidate?.fullName}</div>
                              <div className="font-mono text-xs text-metal-500">{sub.candidate?.serviceNumber} · {sub.candidate?.rank}</div>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className={`font-mono text-xs px-2 py-1 rounded-full border
                              ${sub.submitReason === "manual" ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" :
                                sub.submitReason === "time_expired" ? "text-blue-400 border-blue-500/40 bg-blue-500/10" :
                                "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"}`}>
                              {getSubmitReasonLabel(sub.submitReason)}
                            </span>
                            <span className={`font-mono text-xs px-2 py-1 rounded-full border ${sub.reviewed ? "text-green-400 border-green-500/40 bg-green-500/10" : "text-metal-400 border-slate-600/40 bg-slate-700/20"}`}>
                              {sub.reviewed ? "✓ Reviewed" : "Pending"}
                            </span>
                            <span className="font-mono text-xs text-metal-500">{formatDateTime(sub.submittedAt)}</span>
                            <ChevronRight className="w-4 h-4 text-metal-500 group-hover:text-cyan-400 transition-colors" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ===================== DETAIL VIEW ===================== */}
          {view === "detail" && selected && (
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              {/* Candidate header */}
              <GlassCard className="p-5 mb-6" animate={false}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-xs text-metal-500 uppercase tracking-wider mb-1">Candidate</div>
                    <h2 className="font-display text-xl font-black text-white">{selected.candidate?.fullName}</h2>
                    <div className="font-mono text-sm text-cyan-400 mt-1">{selected.candidate?.serviceNumber}</div>
                    <div className="font-body text-sm text-metal-400 mt-0.5">{selected.candidate?.rank} · {selected.candidate?.unit}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`font-mono text-xs px-3 py-1.5 rounded-full border
                      ${selected.submitReason === "manual" ? "text-cyan-400 border-cyan-500/40 bg-cyan-500/10" :
                        selected.submitReason === "time_expired" ? "text-blue-400 border-blue-500/40 bg-blue-500/10" :
                        "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"}`}>
                      {getSubmitReasonLabel(selected.submitReason)}
                    </span>
                    <div className="font-mono text-xs text-metal-500">{formatDateTime(selected.submittedAt)}</div>
                    {/* Score summary */}
                    <div className="mt-2 text-right">
                      <div className="font-mono text-xs text-metal-500 mb-1">Current Score</div>
                      <div className="font-display text-2xl font-black text-cyan-400">
                        {grandTotal} <span className="text-metal-500 text-base">/ {maxTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Section A: MCQ Auto-Checked */}
              <div className="mb-6">
                <h3 className="font-display text-sm font-bold text-sky-400 tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-xs">A</span>
                  Section A — Multiple Choice ({mcqScore}/{mcqTotal} marks auto-calculated)
                </h3>
                <div className="space-y-2">
                  {mcqQuestions.map((q, i) => {
                    const candidateAnswer = selected.answers?.[q.id];
                    const isCorrect = candidateAnswer === q.correctAnswer;
                    return (
                      <GlassCard key={q.id} className="p-4" animate={false}>
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                            ${isCorrect ? "bg-green-500/20 border border-green-500/40" : candidateAnswer ? "bg-red-500/20 border border-red-500/40" : "bg-slate-700/40 border border-slate-600/40"}`}>
                            {isCorrect ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                             candidateAnswer ? <XCircle className="w-4 h-4 text-red-400" /> :
                             <span className="font-mono text-xs text-metal-500">—</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-body text-sm text-slate-300 mb-2">Q{i + 1}. {q.question}</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="font-mono text-xs px-2 py-1 rounded bg-slate-800/60 border border-slate-700/40">
                                <span className="text-metal-500">Candidate: </span>
                                <span className={isCorrect ? "text-green-400" : candidateAnswer ? "text-red-400" : "text-metal-500"}>
                                  {candidateAnswer || "No answer"}
                                </span>
                              </span>
                              {!isCorrect && candidateAnswer && (
                                <span className="font-mono text-xs px-2 py-1 rounded bg-green-500/10 border border-green-500/30 text-green-400">
                                  Correct: {q.correctAnswer}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>

              {/* Section B & C: Manual Marking */}
              <div className="mb-6">
                <h3 className="font-display text-sm font-bold text-yellow-400 tracking-widest uppercase mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-xs">B/C</span>
                  Sections B & C — Manual Marking Required
                </h3>
                <div className="space-y-4">
                  {nonMcqQuestions.map((q, i) => {
                    const candidateAnswer = selected.answers?.[q.id] || "";
                    const maxMark = q.maxMarks;
                    const currentMark = markInputs[q.id] ?? "";
                    return (
                      <GlassCard key={q.id} className="p-5" animate={false}>
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-start gap-3 flex-1">
                            <span className={`flex-shrink-0 font-mono text-xs px-2 py-0.5 rounded-full border
                              ${q.type === "short" ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10" : "text-purple-400 border-purple-500/40 bg-purple-500/10"}`}>
                              {q.type === "short" ? "Short" : "Long"} · Max {maxMark} marks
                            </span>
                          </div>
                          {/* Mark input */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <label className="font-mono text-xs text-metal-400">Mark:</label>
                            <input
                              type="number"
                              min="0"
                              max={maxMark}
                              value={currentMark}
                              onChange={(e) => {
                                const v = Math.min(maxMark, Math.max(0, Number(e.target.value)));
                                setMarkInputs((p) => ({ ...p, [q.id]: v }));
                              }}
                              className="w-16 px-2 py-1 rounded-lg bg-slate-800/60 border border-slate-700/60 text-cyan-400 font-display text-sm font-bold text-center focus:outline-none focus:border-cyan-400/60"
                            />
                            <span className="font-mono text-xs text-metal-500">/ {maxMark}</span>
                          </div>
                        </div>
                        <p className="font-body text-sm text-slate-200 mb-3 leading-relaxed">{q.question}</p>
                        <div className="rounded-xl bg-slate-800/40 border border-slate-700/40 p-4">
                          <div className="font-mono text-xs text-metal-500 mb-2 uppercase tracking-wider">Candidate's Answer:</div>
                          {candidateAnswer ? (
                            <p className="font-body text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">{candidateAnswer}</p>
                          ) : (
                            <p className="font-body text-sm text-metal-600 italic">No answer provided.</p>
                          )}
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </div>

              {/* Admin feedback */}
              <GlassCard className="p-5 mb-6" animate={false}>
                <label className="block font-display text-xs font-bold text-metal-400 tracking-widest uppercase mb-3">
                  Admin Feedback / Notes
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter feedback, observations, or notes for this candidate's submission..."
                  className="w-full h-28 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 font-body text-sm leading-relaxed resize-none focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 placeholder-metal-600 transition-all"
                />
              </GlassCard>

              {/* Score summary + Save */}
              <GlassCard className="p-5" glow animate={false}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <div className="font-mono text-xs text-metal-500 uppercase tracking-wider mb-1">MCQ Score</div>
                      <div className="font-display text-xl font-bold text-sky-400">{mcqScore} / {mcqTotal}</div>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-metal-500 uppercase tracking-wider mb-1">Written Score</div>
                      <div className="font-display text-xl font-bold text-yellow-400">{manualTotal} / {5 * 5 + 2 * 10}</div>
                    </div>
                    <div>
                      <div className="font-mono text-xs text-metal-500 uppercase tracking-wider mb-1">Grand Total</div>
                      <div className="font-display text-2xl font-bold text-cyan-400">{grandTotal} / {maxTotal}</div>
                    </div>
                  </div>
                  <motion.button
                    onClick={handleSave}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-display text-sm font-bold tracking-widest uppercase text-navy-950"
                    style={{ background: saved ? "linear-gradient(135deg,#4ade80,#22c55e)" : "linear-gradient(135deg, #22d3ee, #0ea5e9)", boxShadow: "0 0 20px rgba(34,211,238,0.25)" }}
                  >
                    {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Marks</>}
                  </motion.button>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
