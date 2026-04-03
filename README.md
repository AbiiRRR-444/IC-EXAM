# ✈️ AirForce Exam Portal

A premium, military aviation-themed online examination platform with anti-cheat enforcement, admin-only result review, and manual marking for written answers.

---

## 📁 Project Structure

```
airforce-exam-app/
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── index.html
├── public/
│   ├── favicon.svg
│   ├── questions.json          ← Edit questions here
│   └── images/
│       ├── rank-badge-1.svg    ← Replace with your own .png/.jpg
│       └── aircraft-fighter.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── data/
    │   └── adminUsers.js       ← Edit admin accounts here
    ├── utils/
    │   ├── storage.js
    │   └── helpers.js
    ├── components/
    │   ├── BackgroundFX.jsx
    │   ├── Navbar.jsx
    │   ├── GlassCard.jsx
    │   ├── RadarSweep.jsx
    │   ├── Timer.jsx
    │   ├── ProgressBar.jsx
    │   ├── QuestionRenderer.jsx
    │   └── ProtectedAdminRoute.jsx
    └── pages/
        ├── LandingPage.jsx
        ├── CandidateFormPage.jsx
        ├── ExamPage.jsx
        ├── SubmittedPage.jsx
        ├── AdminLoginPage.jsx
        └── AdminDashboardPage.jsx
```

---

## 🚀 Installation & Running Locally

### Step 1 — Install Node.js
Download and install Node.js (v18 or higher) from https://nodejs.org

### Step 2 — Install dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### Step 3 — Start development server
```bash
npm run dev
```
Open your browser at: **http://localhost:5173**

---

## 🌐 Deploying to Vercel (Free)

### Method A — Drag & Drop (Easiest)
1. Run `npm run build` in your terminal
2. Go to https://vercel.com and create a free account
3. Click "Add New → Project"
4. Drag and drop the `dist/` folder that was created
5. Done! You'll get a free URL like `https://airforce-exam.vercel.app`

### Method B — GitHub (Recommended for updates)
1. Push this project to a GitHub repository
2. Go to https://vercel.com → "Add New Project"
3. Import your GitHub repo
4. Framework: select **Vite**
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click Deploy

Every time you push to GitHub, Vercel will auto-redeploy.

---

## ✏️ How to Edit Questions

Open `public/questions.json` in any text editor.

### MCQ Format:
```json
{
  "id": 1,
  "type": "mcq",
  "question": "Your question text here?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Option A"
}
```

### MCQ with Image:
```json
{
  "id": 2,
  "type": "mcq",
  "question": "Identify the rank shown.",
  "image": "/images/rank-badge-1.png",
  "options": ["Flying Officer", "Squadron Leader", "Group Captain", "Air Marshal"],
  "correctAnswer": "Squadron Leader"
}
```

### Short Answer (manual marking):
```json
{
  "id": 11,
  "type": "short",
  "question": "Explain situational awareness in aviation.",
  "maxMarks": 5
}
```

### Long Answer (manual marking):
```json
{
  "id": 16,
  "type": "long",
  "question": "Discuss the evolution of air power...",
  "maxMarks": 10
}
```

> **Rules:** `id` must be unique. `correctAnswer` must exactly match one of the options. Order doesn't matter.

---

## 👤 How to Add / Change Admin Users

Open `src/data/adminUsers.js`:

```js
const adminUsers = [
  {
    username: "admin",         // Login username
    password: "airforce2024",  // Login password
    name: "Wing Commander Ahmed",
    rank: "Wing Commander",
  },
  // Add more admins here...
];
```

After editing, run `npm run build` and redeploy.

> ⚠️ For production use, move credentials to environment variables or a backend — never keep passwords in frontend code for real deployments.

---

## 🖼️ Adding Your Own Images

1. Place your image files in `public/images/`
2. Supported formats: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`
3. In `questions.json`, use the path: `"/images/your-filename.png"`
4. The app will auto-fallback to `.svg` if `.png` is not found

---

## 🛡️ Anti-Cheat System

The following events trigger **immediate auto-submission**:

| Trigger | Detection Method | Recorded As |
|---|---|---|
| Switch browser tab | `document.visibilitychange` | `tab_switch` |
| Minimize window | `window.blur` event | `window_blur` |
| Lose window focus | `window.blur` event | `window_blur` |
| Exit fullscreen | `fullscreenchange` event | `fullscreen_exit` |
| Timer reaches 0 | 30-min countdown | `time_expired` |
| Manual submit | Submit button | `manual` |

All violations are recorded in the submission and visible to admins.

---

## 🔑 Admin Features

- Login at `/admin/login`
- View all submissions with status indicators
- Click any submission to review it
- MCQ answers are **auto-checked** against correct answers
- Short/Long answers require **manual marking** (input fields)
- Save marks and admin feedback per submission
- See grand total: MCQ auto + manual written marks

### Marking Scheme:
- MCQ: 1 mark each (10 total)
- Short Answer: 0–5 marks each (25 total max)
- Long Answer: 0–10 marks each (20 total max)
- **Grand Total: 55 marks**

---

## ❓ Frequently Asked Questions

**Q: Can candidates see their scores?**
No. The submitted confirmation page shows only submission details, never scores or correct answers.

**Q: Where is data stored?**
In `localStorage` on the browser. This is for demo/prototype use. For real exams with multiple devices, integrate Firebase or a backend API.

**Q: Can multiple candidates take the exam at the same time?**
Yes, but each on their own device/browser. All submissions are stored in that device's localStorage.

**Q: How do I change the exam duration?**
In `src/pages/ExamPage.jsx`, find line: `const EXAM_DURATION = 30 * 60;` and change `30` to the minutes you want.

---

## 🎨 Customization

- **Colors**: Edit `tailwind.config.js` → `theme.extend.colors`
- **Fonts**: Edit `index.html` Google Fonts link + `tailwind.config.js` → `fontFamily`
- **Exam Timer**: `src/pages/ExamPage.jsx` → `EXAM_DURATION`
- **Organization Name**: Search for "Bangladesh Air Force" in `LandingPage.jsx`

---

*Built with React + Vite + Tailwind CSS + Framer Motion*
