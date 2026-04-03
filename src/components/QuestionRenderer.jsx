import { motion, AnimatePresence } from "framer-motion";

export default function QuestionRenderer({ question, answer, onChange, questionNumber }) {
  if (!question) return null;

  const variants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-full"
      >
        {/* Question header */}
        <div className="flex items-start gap-3 mb-5">
          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <span className="font-display text-sm text-cyan-400 font-bold">{questionNumber}</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-mono text-xs px-2 py-0.5 rounded-full border tracking-widest uppercase
                ${question.type === "mcq"
                  ? "text-sky-400 border-sky-500/40 bg-sky-500/10"
                  : question.type === "short"
                  ? "text-yellow-400 border-yellow-500/40 bg-yellow-500/10"
                  : "text-purple-400 border-purple-500/40 bg-purple-500/10"
                }`}>
                {question.type === "mcq" ? "Multiple Choice" : question.type === "short" ? `Short Answer — ${question.maxMarks} marks` : `Long Answer — ${question.maxMarks} marks`}
              </span>
            </div>
            <p className="font-body text-base sm:text-lg text-slate-100 leading-relaxed">
              {question.question}
            </p>
          </div>
        </div>

        {/* Image (if present) */}
        {question.image && (
          <div className="mb-5 flex justify-center">
            <div className="relative rounded-xl overflow-hidden border border-cyan-500/30 bg-navy-900">
              <img
                src={question.image}
                alt="Question image"
                className="max-h-48 max-w-full object-contain"
                onError={(e) => {
                  // Show SVG placeholder if image not found
                  const svg = question.image.replace(/\.(png|jpg|jpeg)$/i, ".svg");
                  if (e.target.src !== window.location.origin + svg) {
                    e.target.src = svg;
                  }
                }}
              />
              <div className="absolute inset-0 pointer-events-none border border-cyan-400/10 rounded-xl" />
            </div>
          </div>
        )}

        {/* MCQ Options */}
        {question.type === "mcq" && (
          <div className="space-y-3">
            {question.options.map((opt, i) => {
              const letters = ["A", "B", "C", "D"];
              const selected = answer === opt;
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onChange(opt)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all duration-200
                    ${selected
                      ? "border-cyan-400/70 bg-cyan-500/15 shadow-lg shadow-cyan-500/10"
                      : "border-slate-700/60 bg-slate-800/40 hover:border-cyan-500/40 hover:bg-cyan-500/5"
                    }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-display text-sm font-bold transition-all
                    ${selected ? "bg-cyan-400 text-navy-950" : "bg-slate-700/60 text-metal-400"}`}>
                    {letters[i]}
                  </div>
                  <span className={`font-body text-sm sm:text-base ${selected ? "text-cyan-100" : "text-slate-300"}`}>
                    {opt}
                  </span>
                  {selected && (
                    <motion.div
                      className="ml-auto w-2 h-2 rounded-full bg-cyan-400"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        )}

        {/* Short answer */}
        {question.type === "short" && (
          <div className="relative">
            <textarea
              className="w-full h-32 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 font-body text-sm leading-relaxed resize-none focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 placeholder-metal-500 transition-all"
              placeholder="Type your answer here... (aim for 2-4 sentences)"
              value={answer || ""}
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 font-mono text-xs text-metal-500">
              {(answer || "").length} chars
            </div>
          </div>
        )}

        {/* Long answer */}
        {question.type === "long" && (
          <div className="relative">
            <textarea
              className="w-full h-56 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-100 font-body text-sm leading-relaxed resize-none focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20 placeholder-metal-500 transition-all"
              placeholder="Write your detailed answer here... (aim for 150-250 words)"
              value={answer || ""}
              onChange={(e) => onChange(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 font-mono text-xs text-metal-500">
              {(answer || "").split(/\s+/).filter(Boolean).length} words
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
