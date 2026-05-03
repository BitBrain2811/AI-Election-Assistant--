import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import CountUp from 'react-countup'
import { TypeAnimation } from 'react-type-animation'
import { FiArrowRight, FiCheckCircle, FiMessageCircle, FiCalendar, FiSearch, FiShield } from 'react-icons/fi'
import { GiVote } from 'react-icons/gi'
import { BsPeopleFill } from 'react-icons/bs'
import api from '../../utils/api'
import useThemeStore from '../../context/themeStore'

const features = [
  { icon: '📋', title: 'Voter Registration', titleHi: 'मतदाता पंजीकरण', desc: 'Step-by-step guide to register as a voter', path: '/registration', color: 'from-orange-400 to-orange-600' },
  { icon: '✅', title: 'Eligibility Checker', titleHi: 'पात्रता जांचकर्ता', desc: 'Check if you qualify to vote', path: '/eligibility', color: 'from-blue-400 to-blue-600' },
  { icon: '📅', title: 'Election Timeline', titleHi: 'चुनाव समयरेखा', desc: 'Upcoming events and important dates', path: '/timeline', color: 'from-purple-400 to-purple-600' },
  { icon: '🗺️', title: 'Polling Booth', titleHi: 'मतदान केंद्र', desc: 'Find your nearest polling booth', path: '/polling-booth', color: 'from-green-400 to-green-600' },
  { icon: '🤖', title: 'AI Assistant', titleHi: 'AI सहायक', desc: 'Chat with our smart election guide', path: '/chatbot', color: 'from-pink-400 to-pink-600' },
  { icon: '📝', title: 'File Complaint', titleHi: 'शिकायत दर्ज करें', desc: 'Report election violations', path: '/complaint', color: 'from-red-400 to-red-600' },
]

const stats = [
  { value: 970, suffix: 'M+', label: 'Registered Voters', labelHi: 'पंजीकृत मतदाता', icon: BsPeopleFill },
  { value: 543, suffix: '', label: 'Constituencies', labelHi: 'निर्वाचन क्षेत्र', icon: GiVote },
  { value: 1.05, suffix: 'M+', label: 'Polling Booths', labelHi: 'मतदान केंद्र', icon: '🏛️' },
  { value: 67.4, suffix: '%', label: 'Voter Turnout 2019', labelHi: '2019 मतदान', icon: '📊' },
]

function StatCard({ value, suffix, label, labelHi, icon: Icon, delay }) {
  const [ref, inView] = useInView({ triggerOnce: true })
  const { language } = useThemeStore()
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6 }}
      className="stat-card"
    >
      <div className="text-3xl mb-2">{typeof Icon === 'string' ? Icon : <Icon className="mx-auto text-orange-500" />}</div>
      <div className="text-3xl font-display font-bold text-gray-900 dark:text-white">
        {inView ? <CountUp end={value} decimals={value % 1 !== 0 ? 1 : 0} duration={2} /> : '0'}{suffix}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{language === 'hi' ? labelHi : label}</div>
    </motion.div>
  )
}

export default function LandingPage() {
  const { language } = useThemeStore()
  const [notices, setNotices] = useState([])
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  useEffect(() => {
    api.get('/user/notices').then(r => setNotices(r.data.slice(0, 3))).catch(() => {})
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div style={{ y: heroY }} className="absolute -top-20 -right-20 w-96 h-96 bg-orange-200/30 dark:bg-orange-900/20 rounded-full blur-3xl" />
          <motion.div style={{ y: heroY }} className="absolute -bottom-20 -left-20 w-96 h-96 bg-green-200/30 dark:bg-green-900/20 rounded-full blur-3xl" />
          {/* Ashoka Chakra */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            className="absolute top-20 right-10 w-64 h-64 opacity-5 dark:opacity-10"
          >
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="90" stroke="#000080" strokeWidth="4"/>
              <circle cx="100" cy="100" r="12" fill="#000080"/>
              {Array.from({length: 24}).map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180
                const x1 = 100 + 14 * Math.cos(angle), y1 = 100 + 14 * Math.sin(angle)
                const x2 = 100 + 88 * Math.cos(angle), y2 = 100 + 88 * Math.sin(angle)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000080" strokeWidth="2"/>
              })}
            </svg>
          </motion.div>
        </div>

        <motion.div style={{ opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-full px-4 py-2 text-sm text-orange-700 dark:text-orange-300 font-medium mb-6">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  {language === 'hi' ? '🗳️ जन-जन का मताधिकार' : '🗳️ Democracy for Every Citizen'}
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight text-gray-900 dark:text-white">
                  {language === 'hi' ? (
                    <>आपका <span className="gradient-text">मतदान</span> अधिकार</>
                  ) : (
                    <>Your Vote,<br /><span className="gradient-text">Your Voice</span></>
                  )}
                </h1>
                <div className="mt-4 text-xl text-gray-600 dark:text-gray-300 font-medium">
                  <TypeAnimation
                    sequence={[
                      'Understand the Election Process', 2000,
                      'चुनाव प्रक्रिया समझें', 2000,
                      'Register to Vote', 2000,
                      'मतदाता बनें', 2000,
                      'Make Your Vote Count', 2000,
                    ]}
                    wrapper="span"
                    speed={50}
                    repeat={Infinity}
                  />
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg">
                  {language === 'hi'
                    ? 'भारत के चुनाव प्रक्रिया को सरल, इंटरैक्टिव और बहुभाषी तरीके से समझें। AI-powered गाइड के साथ अपनी मतदान यात्रा शुरू करें।'
                    : 'Navigate India\'s election process with confidence. From registration to results — your AI-powered civic companion.'}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/chatbot" className="btn-primary flex items-center gap-2">
                    <FiMessageCircle size={18} />
                    {language === 'hi' ? 'AI गाइड से पूछें' : 'Ask AI Guide'}
                  </Link>
                  <Link to="/registration" className="btn-secondary flex items-center gap-2">
                    {language === 'hi' ? 'पंजीकरण शुरू करें' : 'Start Registration'}
                    <FiArrowRight size={18} />
                  </Link>
                </div>
                <div className="mt-6 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  {['Free to use', 'Multilingual', 'ECI Compliant'].map(tag => (
                    <span key={tag} className="flex items-center gap-1.5"><FiCheckCircle className="text-green-500" size={14} />{tag}</span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Hero visual */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Main card */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl">🗳️</div>
                    <div>
                      <div className="font-bold text-gray-900 dark:text-white">VoterMitra Assistant</div>
                      <div className="text-xs text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />Online</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl rounded-tr-sm p-3 text-sm text-gray-700 dark:text-gray-300 ml-8">
                      How do I register to vote in India?
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl rounded-tl-sm p-3 text-sm text-gray-700 dark:text-gray-300 mr-8">
                      I'll guide you through the process! You need to fill <strong>Form 6</strong> at <strong>nvsp.in</strong>. Are you 18+ and an Indian citizen? ✅
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl rounded-tr-sm p-3 text-sm ml-8">
                      Yes! What documents do I need?
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 text-xs text-gray-400">Type your question...</div>
                    <button className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white text-sm">→</button>
                  </div>
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  className="absolute -left-12 top-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-2xl mb-1">📅</div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">Election</div>
                  <div className="text-xs text-orange-500 font-bold">45 days away</div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                  className="absolute -right-8 bottom-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 border border-gray-100 dark:border-gray-700"
                >
                  <div className="text-2xl mb-1">✅</div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">You're Eligible!</div>
                  <div className="text-xs text-green-500 font-bold">Start now →</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white/50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => <StatCard key={i} {...s} delay={i * 0.1} />)}
          </div>
        </div>
      </section>

      {/* Notices */}
      {notices.length > 0 && (
        <section className="py-8 bg-orange-50 dark:bg-orange-900/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
              <span className="shrink-0 badge bg-orange-500 text-white">📢 Updates</span>
              {notices.map(n => (
                <div key={n.id} className="shrink-0 text-sm text-orange-800 dark:text-orange-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-orange-200 dark:border-orange-700">
                  {n.title}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="section-heading">{language === 'hi' ? 'सभी चुनाव सेवाएं' : 'Everything You Need'}</h2>
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {language === 'hi' ? 'एक ही मंच पर सभी चुनाव सेवाएं' : 'All election services in one powerful platform'}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.path}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={f.path} className="card block group h-full hover:border-orange-200 dark:hover:border-orange-700">
                <div className={`w-14 h-14 bg-gradient-to-br ${f.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  {f.icon}
                </div>
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  {language === 'hi' ? f.titleHi : f.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                <div className="mt-4 flex items-center text-orange-500 text-sm font-medium gap-1 group-hover:gap-2 transition-all">
                  {language === 'hi' ? 'और जानें' : 'Learn more'} <FiArrowRight size={14} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-orange-500 via-orange-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-display font-bold text-center mb-14">
            {language === 'hi' ? 'कैसे काम करता है?' : 'How It Works'}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: '✅', title: 'Check Eligibility', desc: 'Verify age, citizenship & residency requirements' },
              { step: '02', icon: '📋', title: 'Register to Vote', desc: 'Fill Form 6 online or visit your local ERO' },
              { step: '03', icon: '🪪', title: 'Get Voter ID', desc: 'Receive your EPIC card by post within 30-45 days' },
              { step: '04', icon: '🗳️', title: 'Cast Your Vote', desc: 'Visit polling booth on election day with ID' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center"
              >
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center text-4xl mb-4 mx-auto border border-white/30">
                    {item.icon}
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-white text-orange-600 rounded-full text-xs font-bold flex items-center justify-center shadow-lg">{item.step}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/registration" className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold py-3 px-8 rounded-xl hover:shadow-xl transition-all hover:-translate-y-0.5">
              Start Your Voter Journey <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Quiz CTA */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-3xl p-10 md:p-14 border border-blue-100 dark:border-blue-800 text-center">
          <div className="text-5xl mb-4">🏆</div>
          <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-3">
            {language === 'hi' ? 'चुनाव ज्ञान प्रश्नोत्तरी' : 'Election Knowledge Quiz'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            {language === 'hi' ? 'अपना चुनाव ज्ञान परखें और civic score बढ़ाएं!' : 'Test your election knowledge and earn civic points!'}
          </p>
          <Link to="/quiz" className="btn-primary inline-flex items-center gap-2">
            <span>🎮</span> {language === 'hi' ? 'क्विज़ खेलें' : 'Play the Quiz'}
          </Link>
        </div>
      </section>
    </div>
  )
}
