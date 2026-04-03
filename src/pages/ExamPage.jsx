import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronLeft, ChevronRight, Send, Maximize } from "lucide-react";
import BackgroundFX from "../components/BackgroundFX";
import Timer from "../components/Timer";
import ProgressBar from "../components/ProgressBar";
import QuestionRenderer from "../components/QuestionRenderer";
import GlassCard from "../components/GlassCard";
import { saveSubmission, saveExamProgress, clearExamProgress } from "../utils/storage";
import { generateId } from "../utils/helpers";

const EXAM_DURATION = 30 * 60; // 30 minutes in seconds

export default function ExamPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [warning, setWarning] = useState(null); // { type, message }
  const submittedRef = useRef(false);
  const candidateRef = useRef(null);

  // ============================================================
  // ANTI-CHEAT: Load candidate, redirect if not registered
  // ============================================================
  useEffect(() => {
    const candidate = sessionStorage.getItem("airforce_candidate");
    if (!candidate) { navigate("/register"); return; }
    candidateRef.current = JSON.parse(candidate);
  }, []);

  // Load questions
  useEffect(() => {
    fetch("/questions.json")
      .then((r) => r.json())
      .then(setQuestions)
      .catch(console.error);
  }, []);

  // ============================================================
  // AUTO-SUBMIT FUNCTION
  // ============================================================
  const submitExam = useCallback((reason) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);

    const candidate = candidateRef.current || {};
    const submission = {
      id: generateId(),
      candidate,
      answers,
      submitReason: reason,
      submittedAt: new Date().toISOString(),
      adminMarks: {},
      adminFeedback: "",
      reviewed: false,
    };

    saveSubmission(submission);
    clearExamProgress();
    sessionStorage.setItem("airforce_last_submission_id", submission.id);
    sessionStorage.removeItem("airforce_candidate");
    navigate("/submitted");
  }, [answers, navigate]);

  // ============================================================
  // ANTI-CHEAT: Visibility change (tab switch / minimize)
  // ============================================================
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !submittedRef.current) {
        // ⚠️ ANTI-CHEAT: Tab switched or window minimized
        submitExam("tab_switch");
      }
    };

    // ============================================================
    // ANTI-CHEAT: Window blur (focus lost — another app, devtools, etc.)
    // ============================================================
    const handleBlur = () => {
      if (!submittedRef.current) {
        submitExam("window_blur");
      }
    };

    // ============================================================
    // ANTI-CHEAT: Fullscreen exit detection
    // ============================================================
    const handleFullscreenChange = () => {
      const isFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement;
      if (!isFullscreen && !submittedRef.current) {
        submitExam("fullscreen_exit");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
    };
  }, [submitExam]);

  // ============================================================
  // ANTI-CHEAT: Block right-click and common keyboard shortcuts
  // ============================================================
  useEffect(() => {
    const blockContextMenu = (e) => e.preventDefault();
    const blockKeys = (e) => {
      // Block F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, etc.
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && ["U", "S", "P"].includes(e.key.toUpperCase()))
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeys);
    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  // Request fullscreen on mount
  useEffect(() => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }, []);

  // Auto-save progress
  useEffect(() => {
    if (!submitted) {
      saveExamProgress({ currentIndex, answers });
    }
  }, [currentIndex, answers, submitted]);

  const handleAnswer = (value) => {
    const qid = questions[currentIndex]?.id;
    if (qid == null) return;
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const answeredCount = Object.keys(answers).length;
  const currentQ = questions[currentIndex];

  const enterFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <BackgroundFX />
        <div className="relative z-20 text-center">
          <motion.div
            className="w-16 h-16 border-2 border-cyan-400/40 border-t-cyan-400 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="font-display text-cyan-400 text-sm tracking-widest">LOADING MISSION DATA...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-navy-950 overflow-hidden select-none">
      <BackgroundFX />

      {/* Fullscreen prompt overlay */}
      <AnimatePresence>
        {!document.fullscreenElement && !submitted && (
          <motion.div
            className="fixed inset-0 z-50 bg-navy-950/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <GlassCard className="max-w-sm w-full p-8 text-center" glow animate={false}>
              <Maximize className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h2 className="font-display text-lg font-bold text-white mb-2 tracking-wide">Fullscreen Required</h2>
              <p className="font-body text-sm text-metal-400 mb-6">
                This exam must be taken in fullscreen mode. Exiting fullscreen will auto-submit your paper.
              </p>
              <button
                onClick={enterFullscreen}
                className="w-full py-3 rounded-xl font-display text-sm font-bold tracking-widest uppercase text-navy-950"
                style={{ background: "linear-gradient(135deg, #22d3ee, #0ea5e9)" }}
              >
                Enter Fullscreen & Begin
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20 min-h-screen flex flex-col">
        {/* Top HUD bar */}
        <div className="sticky top-0 z-30 border-b border-cyan-500/20 bg-navy-950/90 backdrop-blur-md px-4 py-3">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
            {/* Candidate info */}
            <div>
              <div className="font-mono text-xs text-metal-500 tracking-wider uppercase">Candidate</div>
              <div className="font-display text-sm text-white font-bold">
                {candidateRef.current?.fullName || "—"}
              </div>
              <div className="font-mono text-xs text-metal-500">{candidateRef.current?.serviceNumber}</div>
            </div>

            {/* Timer */}
            <Timer totalSeconds={EXAM_DURATION} onExpire={() => submitExam("time_expired")} />

            {/* Submit button */}
            <motion.button
              onClick={() => {
                if (window.confirm("Are you sure you want to submit your exam? This cannot be undone.")) {
                  submitExam("manual");
                }
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-display text-xs font-bold tracking-widest uppercase text-navy-950"
              style={{ background: "linear-gradient(135deg, #22d3ee, #0ea5e9)", boxShadow: "0 0 15px rgba(34,211,238,0.3)" }}
            >
              <Send className="w-4 h-4" />
              Submit
            </motion.button>
          </div>

          {/* Progress bar */}
          <div className="max-w-4xl mx-auto mt-3">
            <ProgressBar
              current={currentIndex + 1}
              total={questions.length}
              answered={answeredCount}
            />
          </div>
        </div>

        {/* Question area */}
        <div className="flex-1 flex flex-col items-center justify-start px-4 py-8">
          <div className="w-full max-w-2xl">
            {/* Question type section labels */}
            <div className="mb-4 flex items-center gap-2">
              <div className="h-px flex-1 bg-cyan-500/10" />
              <span className="font-mono text-xs text-metal-500 tracking-widest px-3 uppercase">
                {currentQ?.type === "mcq" ? "Section A — Multiple Choice" :
                 currentQ?.type === "short" ? "Section B — Short Answer" :
                 "Section C — Long Answer"}
              </span>
              <div className="h-px flex-1 bg-cyan-500/10" />
            </div>

            <GlassCard className="p-5 sm:p-7" animate={false}>
              <QuestionRenderer
                question={currentQ}
                answer={answers[currentQ?.id]}
                onChange={handleAnswer}
                questionNumber={currentIndex + 1}
              />
            </GlassCard>

            {/* Navigation */}
            <div className="mt-5 flex items-center justify-between">
              <motion.button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                whileHover={currentIndex > 0 ? { scale: 1.03 } : {}}
                whileTap={currentIndex > 0 ? { scale: 0.97 } : {}}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-display text-xs font-bold tracking-widest uppercase transition-all
                  ${currentIndex === 0
                    ? "border-slate-700/30 text-metal-600 cursor-not-allowed"
                    : "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.button>

              {/* Question dots */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
                {questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    title={`Question ${i + 1}`}
                    className={`w-6 h-6 rounded-md text-xs font-mono transition-all
                      ${i === currentIndex
                        ? "bg-cyan-400 text-navy-950 font-bold"
                        : answers[q.id]
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                        : "bg-slate-700/40 text-metal-500 hover:bg-slate-600/40"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <motion.button
                onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={currentIndex === questions.length - 1}
                whileHover={currentIndex < questions.length - 1 ? { scale: 1.03 } : {}}
                whileTap={currentIndex < questions.length - 1 ? { scale: 0.97 } : {}}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-display text-xs font-bold tracking-widest uppercase transition-all
                  ${currentIndex === questions.length - 1
                    ? "border-slate-700/30 text-metal-600 cursor-not-allowed"
                    : "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Unanswered hint */}
            {questions.length > 0 && answeredCount < questions.length && (
              <motion.p
                className="mt-4 text-center font-mono text-xs text-metal-500"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                {questions.length - answeredCount} question{questions.length - answeredCount !== 1 ? "s" : ""} remaining
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
