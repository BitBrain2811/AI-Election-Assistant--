import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiExternalLink, FiArrowRight } from 'react-icons/fi'
import useThemeStore from '../../context/themeStore'

export default function AboutPage() {
  const { language } = useThemeStore()

  const pillars = [
    { icon: '📖', title: 'Education', titleHi: 'शिक्षा', desc: 'Clear, simple explanations of complex election processes' },
    { icon: '🤝', title: 'Accessibility', titleHi: 'पहुंच', desc: 'Multilingual support and accessible design for all citizens' },
    { icon: '🔒', title: 'Trust', titleHi: 'विश्वास', desc: 'Data sourced from official Election Commission of India' },
    { icon: '🚀', title: 'Innovation', titleHi: 'नवाचार', desc: 'AI-powered assistance for personalized election guidance' },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <div className="text-6xl mb-6">🏛️</div>
        <h1 className="section-heading mb-4">{language === 'hi' ? 'VoterMitra के बारे में' : 'About VoterMitra'}</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
          {language === 'hi'
            ? 'VoterMitra एक AI-संचालित प्लेटफॉर्म है जो भारतीय नागरिकों को चुनाव प्रक्रिया को सरल और इंटरैक्टिव तरीके से समझने में मदद करता है।'
            : 'VoterMitra is an AI-powered platform that helps Indian citizens understand the election process in a simple, interactive, and multilingual way — making democracy more accessible for every citizen.'}
        </p>
      </motion.div>

      {/* Mission */}
      <div className="grid lg:grid-cols-2 gap-10 mb-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4">
            {language === 'hi' ? 'हमारा उद्देश्य' : 'Our Mission'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            India has nearly 970 million registered voters — the largest electorate in the world. Yet many citizens remain unaware of their rights, the registration process, or how elections work.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            VoterMitra bridges this gap by providing an intelligent, conversational, and visually engaging platform that guides every Indian citizen through their democratic journey — from checking eligibility to casting their vote.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
          {[
            { num: '970M+', label: 'Voters Served', icon: '🗳️' },
            { num: '12', label: 'Key Features', icon: '⚡' },
            { num: '2', label: 'Languages', icon: '🌐' },
            { num: '100%', label: 'Free to Use', icon: '🆓' },
          ].map((item, i) => (
            <div key={i} className="card text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-2xl font-bold text-orange-500 font-display">{item.num}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Pillars */}
      <div className="mb-16">
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-8 text-center">
          {language === 'hi' ? 'हमारे मूल्य' : 'Our Core Values'}
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          {pillars.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card text-center">
              <div className="text-4xl mb-3">{p.icon}</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{language === 'hi' ? p.titleHi : p.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ECI Links */}
      <div className="card bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">🔗 Official Election Commission Resources</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            ['Election Commission of India', 'https://eci.gov.in'],
            ['NVSP - National Voter Service Portal', 'https://nvsp.in'],
            ['Electoral Search', 'https://electoralsearch.eci.gov.in'],
            ['Voter Helpline - 1950', 'tel:1950'],
          ].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-orange-700 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-200 text-sm font-medium transition-colors">
              <FiExternalLink size={14} /> {label}
            </a>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <Link to="/chatbot" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
          🤖 Start Your Voter Journey <FiArrowRight />
        </Link>
      </div>
    </div>
  )
}
