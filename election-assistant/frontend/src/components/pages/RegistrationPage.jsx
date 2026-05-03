import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiCircle, FiArrowRight, FiExternalLink, FiDownload } from 'react-icons/fi'
import api from '../../utils/api'
import useThemeStore from '../../context/themeStore'

export default function RegistrationPage() {
  const [steps, setSteps] = useState([])
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const { language } = useThemeStore()

  useEffect(() => {
    api.get(`/election/registration-steps?language=${language}`)
      .then(r => { setSteps(r.data.steps); setLoading(false) })
      .catch(() => setLoading(false))
  }, [language])

  const docs = [
    { title: 'Aadhaar Card', titleHi: 'आधार कार्ड', type: 'Identity + Age + Address', icon: '🆔', required: true },
    { title: 'PAN Card', titleHi: 'पैन कार्ड', type: 'Identity', icon: '💳', required: false },
    { title: 'Passport', titleHi: 'पासपोर्ट', type: 'Identity + Age + Address', icon: '📘', required: false },
    { title: 'Driving License', titleHi: 'ड्राइविंग लाइसेंस', type: 'Identity + Age', icon: '🚗', required: false },
    { title: 'Birth Certificate', titleHi: 'जन्म प्रमाण पत्र', type: 'Age Proof', icon: '📜', required: false },
    { title: 'Class 10 Marksheet', titleHi: '10वीं अंकपत्र', type: 'Age Proof', icon: '📋', required: false },
    { title: 'Utility Bills', titleHi: 'उपयोगिता बिल', type: 'Address Proof', icon: '📄', required: false },
    { title: 'Passport Photo', titleHi: 'पासपोर्ट फोटो', type: 'Photograph (2 copies)', icon: '🖼️', required: true },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="section-heading mb-3">
          📋 {language === 'hi' ? 'मतदाता पंजीकरण गाइड' : 'Voter Registration Guide'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          {language === 'hi'
            ? 'मतदाता के रूप में पंजीकरण करने के लिए इन आसान चरणों का पालन करें'
            : 'Follow these simple steps to register as a voter in India'}
        </p>
      </motion.div>

      {/* Online/Offline tabs */}
      <div className="flex gap-4 mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
        {['Online', 'Offline'].map(mode => (
          <button key={mode} className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white">
            {mode === 'Online' ? '💻' : '🏢'} {mode}
          </button>
        ))}
      </div>

      {/* Steps */}
      <div className="grid lg:grid-cols-3 gap-8 mb-14">
        {/* Step list */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            [1,2,3,4,5,6].map(i => <div key={i} className="h-16 shimmer rounded-xl" />)
          ) : steps.map((step, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveStep(i)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all ${
                activeStep === i
                  ? 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'
                  : i < activeStep
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300'
              }`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                i < activeStep ? 'bg-green-500 text-white' :
                activeStep === i ? 'bg-orange-500 text-white' :
                'bg-gray-100 dark:bg-gray-700 text-gray-500'
              }`}>
                {i < activeStep ? '✓' : step.step}
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-900 dark:text-white">{step.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{step.duration}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Step detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {steps[activeStep] && (
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="card h-full"
              >
                <div className="text-5xl mb-4">{['✅', '📄', '📝', '📤', '🔍', '🪪'][activeStep] || '📌'}</div>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-3">{steps[activeStep].title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{steps[activeStep].description}</p>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700 mb-6">
                  <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300 font-semibold text-sm mb-2">⏱ Estimated Time</div>
                  <div className="text-2xl font-bold text-orange-600">{steps[activeStep].duration}</div>
                </div>

                <div className="flex gap-3">
                  {activeStep < steps.length - 1 && (
                    <button onClick={() => setActiveStep(activeStep + 1)} className="btn-primary flex items-center gap-2">
                      Next Step <FiArrowRight />
                    </button>
                  )}
                  {activeStep === 0 && (
                    <a href="https://nvsp.in" target="_blank" rel="noreferrer" className="btn-secondary flex items-center gap-2">
                      Go to NVSP <FiExternalLink size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Documents */}
      <section>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
          📄 {language === 'hi' ? 'आवश्यक दस्तावेज़' : 'Required Documents'}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {docs.map((doc, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`card hover:border-orange-200 dark:hover:border-orange-700 ${doc.required ? 'border-orange-300 dark:border-orange-700' : ''}`}
            >
              <div className="text-3xl mb-2">{doc.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                {language === 'hi' ? doc.titleHi : doc.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{doc.type}</p>
              {doc.required && (
                <span className="mt-2 badge bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">Required</span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Links */}
      <div className="mt-10 grid md:grid-cols-3 gap-4">
        {[
          { icon: '🌐', title: 'NVSP Portal', url: 'https://nvsp.in', desc: 'Official voter registration portal' },
          { icon: '📱', title: 'Voter Helpline App', url: '#', desc: 'Download from Play Store / App Store' },
          { icon: '📞', title: 'Helpline 1950', url: 'tel:1950', desc: '24/7 election helpline' },
        ].map((link, i) => (
          <a key={i} href={link.url} target="_blank" rel="noreferrer" className="card flex items-center gap-4 hover:border-orange-200 dark:hover:border-orange-700">
            <div className="text-3xl">{link.icon}</div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{link.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{link.desc}</div>
            </div>
            <FiExternalLink className="ml-auto text-gray-400" size={16} />
          </a>
        ))}
      </div>
    </div>
  )
}
