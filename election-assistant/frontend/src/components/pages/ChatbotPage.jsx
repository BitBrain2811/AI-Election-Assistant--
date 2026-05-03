import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSend, FiMic, FiMicOff, FiRefreshCw, FiVolume2 } from 'react-icons/fi'
import { GiVote } from 'react-icons/gi'
import api from '../../utils/api'
import useThemeStore from '../../context/themeStore'
import toast from 'react-hot-toast'

const SUGGESTIONS_EN = [
  'How do I register to vote?',
  'What documents are needed for voter registration?',
  'When is the next election?',
  'How to find my polling booth?',
  'What is NOTA?',
  'Can I vote without Voter ID?',
  'What is the Model Code of Conduct?',
  'How to file an election complaint?'
]
const SUGGESTIONS_HI = [
  'मतदाता पंजीकरण कैसे करें?',
  'पंजीकरण के लिए कौन से दस्तावेज़ चाहिए?',
  'अगला चुनाव कब है?',
  'मतदान केंद्र कैसे खोजें?',
  'NOTA क्या है?',
  'EVM कैसे काम करता है?',
]

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-sm shrink-0">🤖</div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex gap-1.5 items-center h-4">
          {[0, 1, 2].map(i => (
            <motion.span key={i} className="w-2 h-2 bg-orange-400 rounded-full" animate={{ y: [-3, 0, -3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Namaste! 🙏 I'm VoterMitra, your AI election guide. I can help you with voter registration, eligibility, election timelines, polling booth information, and much more. How can I assist you today?\n\n**नमस्ते! मैं वोटर मित्र हूं** - आपका AI चुनाव सहायक। मतदाता पंजीकरण, पात्रता, चुनाव समयरेखा में मैं आपकी मदद कर सकता हूं।", id: 0 }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [sessionId] = useState(() => 'session_' + Date.now())
  const messagesEnd = useRef(null)
  const inputRef = useRef(null)
  const { language } = useThemeStore()
  const suggestions = language === 'hi' ? SUGGESTIONS_HI : SUGGESTIONS_EN

  useEffect(() => { messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, isLoading])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || isLoading) return
    setInput('')
    const newMsg = { role: 'user', content: msg, id: Date.now() }
    setMessages(prev => [...prev, newMsg])
    setIsLoading(true)
    try {
      const res = await api.post('/chat/message', { message: msg, session_id: sessionId, language })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response, id: Date.now(), suggestions: res.data.suggestions }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again. / माफ़ करें, कृपया फिर से प्रयास करें।', id: Date.now() }])
    } finally {
      setIsLoading(false)
    }
  }

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
    recognition.start()
    setIsListening(true)
    recognition.onresult = e => {
      setInput(e.results[0][0].transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
  }

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utt = new SpeechSynthesisUtterance(text.replace(/\*\*/g, '').replace(/\n/g, ' '))
      utt.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
      window.speechSynthesis.speak(utt)
    }
  }

  const renderMessage = (content) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="block font-semibold">{line.slice(2, -2)}</strong>
      const parts = line.split(/(\*\*.*?\*\*)/g)
      return <p key={i} className="mb-1">{parts.map((p, j) => p.startsWith('**') ? <strong key={j}>{p.slice(2,-2)}</strong> : p)}</p>
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">🤖</div>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">VoterMitra AI Assistant</h1>
            <div className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Online — Ready to help with elections
            </div>
          </div>
        </div>
      </motion.div>

      {/* Chat window */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden flex flex-col" style={{ height: '60vh' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-2">
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-2 mb-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'}`}>
                  {msg.role === 'user' ? '👤' : '🤖'}
                </div>
                <div className="flex flex-col gap-2 max-w-sm">
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-orange-500 text-white rounded-tr-sm' : 'bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-sm border border-gray-100 dark:border-gray-700 shadow-sm'}`}>
                    {renderMessage(msg.content)}
                  </div>
                  {msg.role === 'assistant' && (
                    <button onClick={() => speak(msg.content)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500 transition-colors self-start">
                      <FiVolume2 size={12} /> Listen
                    </button>
                  )}
                  {msg.suggestions?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((s, i) => (
                        <button key={i} onClick={() => sendMessage(s)} className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700 px-2.5 py-1 rounded-full hover:bg-orange-100 transition-colors">
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && <TypingIndicator />}
          <div ref={messagesEnd} />
        </div>

        {/* Suggestions */}
        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {suggestions.slice(0, 4).map((s, i) => (
              <button key={i} onClick={() => sendMessage(s)} className="shrink-0 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-700 px-3 py-1.5 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-2.5">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder={language === 'hi' ? 'अपना प्रश्न टाइप करें...' : 'Ask about elections, registration, voting...'}
                className="flex-1 bg-transparent text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 outline-none"
              />
              <button
                onClick={startListening}
                className={`text-gray-400 hover:text-orange-500 transition-colors ${isListening ? 'text-red-500 animate-pulse' : ''}`}
              >
                {isListening ? <FiMicOff size={18} /> : <FiMic size={18} />}
              </button>
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all hover:shadow-lg active:scale-95"
            >
              <FiSend size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Topic grid */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {suggestions.slice(4).map((s, i) => (
          <button key={i} onClick={() => sendMessage(s)} className="card text-left hover:border-orange-200 dark:hover:border-orange-700 p-4">
            <span className="text-sm text-gray-600 dark:text-gray-300">{s}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
