// ============================================================
// HELPER UTILITIES
// ============================================================

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function formatDateTime(isoString) {
  if (!isoString) return "N/A";
  const d = new Date(isoString);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function scoreSubmission(submission, questions) {
  let mcqScore = 0;
  let mcqTotal = 0;
  questions.forEach((q) => {
    if (q.type === "mcq") {
      mcqTotal++;
      if (submission.answers?.[q.id] === q.correctAnswer) mcqScore++;
    }
  });
  return { mcqScore, mcqTotal };
}

export function getTotalManualMarks(adminMarks) {
  if (!adminMarks) return 0;
  return Object.values(adminMarks).reduce(
    (sum, m) => sum + (Number(m) || 0),
    0
  );
}

export function getSubmitReasonLabel(reason) {
  const map = {
    "time_expired": "⏱ Time Expired",
    "tab_switch": "🚨 Tab Switch Detected",
    "window_blur": "🚨 Window Lost Focus",
    "window_minimize": "🚨 Window Minimized",
    "fullscreen_exit": "🚨 Fullscreen Exited",
    "manual": "✅ Manual Submission",
  };
  return map[reason] || reason;
}
