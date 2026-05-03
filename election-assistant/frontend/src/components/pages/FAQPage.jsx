import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiThumbsUp, FiChevronDown } from 'react-icons/fi'
import api from '../../utils/api'
import useThemeStore from '../../context/themeStore'

export default function FAQPage() {
  const [faqs, setFaqs] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [openId, setOpenId] = useState(null)
  const [loading, setLoading] = useState(true)
  const { language } = useThemeStore()

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    api.get('/faq/categories').then(r => setCategories(r.data.categories))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ language })
    if (activeCategory !== 'all') params.append('category', activeCategory)
    if (debouncedSearch) params.append('search', debouncedSearch)
    api.get(`/faq/?${params}`).then(r => { setFaqs(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [activeCategory, debouncedSearch, language])

  const handleOpen = (id) => {
    if (openId !== id) api.post(`/faq/${id}/view`).catch(() => {})
    setOpenId(openId === id ? null : id)
  }

  const markHelpful = async (e, id) => {
    e.stopPropagation()
    await api.post(`/faq/${id}/helpful`)
    setFaqs(faqs.map(f => f.id === id ? { ...f, helpful_count: f.helpful_count + 1 } : f))
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="section-heading mb-3">❓ {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'hi' ? 'चुनाव संबंधी सामान्य प्रश्नों के उत्तर खोजें' : 'Find answers to common election-related questions'}
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-8">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={language === 'hi' ? 'प्रश्न खोजें...' : 'Search questions...'}
          className="input-field pl-12 text-base py-4"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === 'all' ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300'}`}
        >
          🔍 All
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300'}`}
          >
            {cat.icon} {language === 'hi' ? cat.label_hi : cat.label}
          </button>
        ))}
      </div>

      {/* FAQ list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <div key={i} className="h-16 shimmer rounded-2xl" />)}
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p>No FAQs found. Try a different search.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all cursor-pointer ${openId === faq.id ? 'border-orange-400 shadow-lg' : 'border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700'}`}
            >
              <button onClick={() => handleOpen(faq.id)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="font-semibold text-gray-900 dark:text-white pr-4">
                  {language === 'hi' && faq.question_hi ? faq.question_hi : faq.question}
                </span>
                <motion.span animate={{ rotate: openId === faq.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <FiChevronDown className="text-gray-400 shrink-0" size={18} />
                </motion.span>
              </button>
              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {language === 'hi' && faq.answer_hi ? faq.answer_hi : faq.answer}
                      </p>
                      <div className="mt-4 flex items-center gap-4">
                        <button onClick={(e) => markHelpful(e, faq.id)} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-green-500 transition-colors">
                          <FiThumbsUp size={13} /> Helpful ({faq.helpful_count})
                        </button>
                        <span className="text-xs text-gray-400">{faq.views} views</span>
                        {faq.tags && (
                          <div className="flex gap-1 ml-auto flex-wrap">
                            {faq.tags.split(',').slice(0,3).map(tag => (
                              <span key={tag} className="badge bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs">{tag.trim()}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* Help prompt */}
      <div className="mt-12 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-3xl p-8 text-center border border-orange-200 dark:border-orange-700">
        <div className="text-4xl mb-3">🤖</div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-2">
          {language === 'hi' ? 'अपना प्रश्न नहीं मिला?' : "Can't find your answer?"}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-5 text-sm">
          {language === 'hi' ? 'हमारे AI सहायक से पूछें - वह तुरंत जवाब देगा!' : 'Ask our AI assistant — it answers instantly!'}
        </p>
        <a href="/chatbot" className="btn-primary inline-block">
          {language === 'hi' ? '🤖 AI से पूछें' : '🤖 Ask AI Assistant'}
        </a>
      </div>
    </div>
  )
}
