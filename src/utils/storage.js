// ============================================================
// STORAGE UTILITY
// All data is stored in localStorage for demo purposes.
// In production, replace with Firebase or a real database.
// ============================================================

const SUBMISSIONS_KEY = "airforce_exam_submissions";
const ADMIN_SESSION_KEY = "airforce_admin_session";
const EXAM_PROGRESS_KEY = "airforce_exam_progress";

// ---- SUBMISSIONS ----

export function saveSubmission(submission) {
  const all = getAllSubmissions();
  all.push(submission);
  localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
}

export function getAllSubmissions() {
  try {
    return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY)) || [];
  } catch {
    return [];
  }
}

export function updateSubmission(id, updates) {
  const all = getAllSubmissions();
  const idx = all.findIndex((s) => s.id === id);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
    return true;
  }
  return false;
}

export function getSubmissionById(id) {
  return getAllSubmissions().find((s) => s.id === id) || null;
}

// ---- ADMIN SESSION ----

export function setAdminSession(admin) {
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
}

export function getAdminSession() {
  try {
    return JSON.parse(sessionStorage.getItem(ADMIN_SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

// ---- EXAM PROGRESS (auto-save) ----

export function saveExamProgress(data) {
  localStorage.setItem(EXAM_PROGRESS_KEY, JSON.stringify(data));
}

export function getExamProgress() {
  try {
    return JSON.parse(localStorage.getItem(EXAM_PROGRESS_KEY)) || null;
  } catch {
    return null;
  }
}

export function clearExamProgress() {
  localStorage.removeItem(EXAM_PROGRESS_KEY);
}
