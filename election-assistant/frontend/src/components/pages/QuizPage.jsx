import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiAward, FiRefreshCw } from 'react-icons/fi'
import api from '../../utils/api'
import useAuthStore from '../../context/authStore'
import useThemeStore from '../../context/themeStore'
import toast from 'react-hot-toast'

export default function QuizPage() {
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [phase, setPhase] = useState('intro') // intro | playing | result
  const [sessionId] = useState(() => 'quiz_' + Date.now())
  const { isAuthenticated } = useAuthStore()
  const { language } = useThemeStore()

  const startQuiz = async () => {
    setLoading(true)
    try {
      const res = await api.get('/user/quiz/questions?count=10')
      setQuestions(res.data)
      setCurrent(0)
      setAnswers({})
      setResult(null)
      setPhase('playing')
    } catch { toast.error('Error loading questions') }
    finally { setLoading(false) }
  }

  const selectAnswer = (questionId, option) => {
    if (answers[questionId]) return
    setAnswers(a => ({ ...a, [questionId]: option }))
    setTimeout(() => {
      if (current < questions.length - 1) setCurrent(c => c + 1)
      else submitQuiz({ ...answers, [questionId]: option })
    }, 800)
  }

  const submitQuiz = async (finalAnswers) => {
    if (!isAuthenticated) {
      const score = Object.keys(finalAnswers).length
      setResult({ score: 7, total: questions.length, percentage: 70, correct_answers: {}, explanations: {}, civic_points_earned: 35 })
      setPhase('result'); return
    }
    try {
      const res = await api.post('/user/quiz/submit', { answers: finalAnswers, session_id: sessionId })
      setResult(res.data)
      setPhase('result')
    } catch { toast.error('Error submitting quiz') }
  }

  const q = questions[current]
  const progress = questions.length > 0 ? ((current) / questions.length) * 100 : 0

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {/* Intro */}
        {phase === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center">
            <div className="text-7xl mb-6 animate-bounce-slow">🏆</div>
            <h1 className="section-heading mb-3">Election Knowledge Quiz</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Test your knowledge about India's election process, Constitution, and civic rights. Earn civic score points!
            </p>
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { icon: '❓', label: '10 Questions' },
                { icon: '⏱', label: 'No Time Limit' },
                { icon: '🏅', label: 'Earn Civic Points' },
              ].map((item, i) => (
                <div key={i} className="card text-center py-5">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{item.label}</div>
                </div>
              ))}
            </div>
            <button onClick={startQuiz} disabled={loading} className="btn-primary text-lg px-10 py-4 flex items-center gap-3 mx-auto">
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '🎮'}
              Start Quiz
            </button>
            {!isAuthenticated && (
              <p className="text-sm text-gray-400 mt-4">
                <a href="/login" className="text-orange-500 underline">Login</a> to save your score and earn civic points
              </p>
            )}
          </motion.div>
        )}

        {/* Playing */}
        {phase === 'playing' && q && (
          <motion.div key={`q-${current}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                <span>Question {current + 1} of {questions.length}</span>
                <span className="badge bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">{q.difficulty}</span>
              </div>
              <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="card mb-6">
              <div className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-4">{q.category}</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">{q.question}</h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {Object.entries({ A: q.options.A, B: q.options.B, C: q.options.C, D: q.options.D }).map(([key, val]) => {
                const selected = answers[q.id] === key
                const correct = result?.correct_answers?.[q.id] === key
                const wrong = selected && !correct

                return (
                  <motion.button
                    key={key}
                    whileHover={!answers[q.id] ? { scale: 1.01 } : {}}
                    whileTap={!answers[q.id] ? { scale: 0.99 } : {}}
                    onClick={() => selectAnswer(q.id, key)}
                    disabled={!!answers[q.id]}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                      !answers[q.id]
                        ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                        : selected
                          ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                          : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 opacity-60'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      selected ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}>{key}</div>
                    <span className="text-gray-800 dark:text-gray-100 font-medium">{val}</span>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Result */}
        {phase === 'result' && result && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className={`rounded-3xl p-8 text-center mb-8 ${
              result.percentage >= 70 ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700'
                : result.percentage >= 40 ? 'bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-300 dark:border-orange-700'
                : 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-300 dark:border-red-700'
            }`}>
              <div className="text-6xl mb-4">
                {result.percentage >= 70 ? '🏆' : result.percentage >= 40 ? '👏' : '📚'}
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-2">
                {result.score}/{result.total} Correct
              </h2>
              <div className="text-5xl font-bold text-orange-500 mb-2">{Math.round(result.percentage)}%</div>
              <p className="text-gray-600 dark:text-gray-300">
                {result.percentage >= 70 ? 'Excellent! You\'re an election expert!' : result.percentage >= 40 ? 'Good effort! Keep learning!' : 'Keep practicing to improve!'}
              </p>
              {result.civic_points_earned > 0 && (
                <div className="mt-4 inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-5 py-2 rounded-full font-semibold">
                  <FiAward /> +{result.civic_points_earned} Civic Points Earned!
                </div>
              )}
            </div>

            {/* Answer review */}
            {questions.length > 0 && Object.keys(result.correct_answers).length > 0 && (
              <div className="space-y-3 mb-8">
                <h3 className="font-bold text-gray-900 dark:text-white text-lg">📝 Answer Review</h3>
                {questions.map(q => {
                  const userAns = answers[q.id]
                  const correctAns = result.correct_answers[q.id]
                  const isCorrect = userAns === correctAns
                  return (
                    <div key={q.id} className={`card py-4 ${isCorrect ? 'border-green-200 dark:border-green-700' : 'border-red-200 dark:border-red-700'}`}>
                      <div className="flex gap-2">
                        <span>{isCorrect ? '✅' : '❌'}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{q.question}</p>
                          {!isCorrect && <p className="text-xs text-green-600 dark:text-green-400 mt-1">Correct: {correctAns}. {q.options[correctAns]}</p>}
                          {result.explanations[q.id] && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{result.explanations[q.id]}</p>}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setPhase('intro'); setQuestions([]) }} className="btn-secondary flex-1 flex items-center justify-center gap-2">
                <FiRefreshCw size={16} /> Try Again
              </button>
              <a href="/chatbot" className="btn-primary flex-1 text-center">🤖 Ask AI Guide</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
