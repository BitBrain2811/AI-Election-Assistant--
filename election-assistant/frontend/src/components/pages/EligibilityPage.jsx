import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi'
import api from '../../utils/api'
import useThemeStore from '../../context/themeStore'
import toast from 'react-hot-toast'

const STATES = ['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal']

export default function EligibilityPage() {
  const [form, setForm] = useState({ age: '', is_citizen: true, has_id: true, state: '', is_mentally_competent: true, has_criminal_conviction: false })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const { language } = useThemeStore()

  const handleSubmit = async () => {
    if (!form.age || !form.state) { toast.error('Please fill all required fields'); return }
    setLoading(true)
    try {
      const res = await api.post('/election/check-eligibility', { ...form, age: parseInt(form.age) })
      setResult(res.data)
    } catch { toast.error('Error checking eligibility') }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="section-heading mb-3">✅ {language === 'hi' ? 'पात्रता जांचकर्ता' : 'Eligibility Checker'}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'hi' ? 'जानें कि क्या आप भारतीय चुनावों में मतदान करने के पात्र हैं' : 'Find out if you are eligible to vote in Indian elections'}
        </p>
      </motion.div>

      <div className="card mb-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Age */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {language === 'hi' ? 'आपकी आयु *' : 'Your Age *'}
            </label>
            <input
              type="number"
              value={form.age}
              onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
              placeholder="e.g. 22"
              className="input-field"
              min="1"
              max="120"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {language === 'hi' ? 'राज्य *' : 'State *'}
            </label>
            <select value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} className="input-field">
              <option value="">Select state...</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {[
            { key: 'is_citizen', labelEn: 'I am an Indian citizen', labelHi: 'मैं भारतीय नागरिक हूं' },
            { key: 'has_id', labelEn: 'I have a valid photo ID (Aadhaar / PAN / Passport)', labelHi: 'मेरे पास वैध फोटो ID है' },
            { key: 'is_mentally_competent', labelEn: 'I am of sound mind', labelHi: 'मैं मानसिक रूप से स्वस्थ हूं' },
            { key: 'has_criminal_conviction', labelEn: 'I have a criminal conviction', labelHi: 'मेरे खिलाफ आपराधिक दोषसिद्धि है', danger: true },
          ].map(({ key, labelEn, labelHi, danger }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                  form[key]
                    ? danger ? 'border-red-500 bg-red-500' : 'border-orange-500 bg-orange-500'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {form[key] && <span className="text-white text-xs">✓</span>}
              </div>
              <span className={`text-sm font-medium ${danger ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-200'}`}>
                {language === 'hi' ? labelHi : labelEn}
              </span>
            </label>
          ))}
        </div>

        <button onClick={handleSubmit} disabled={loading} className="btn-primary mt-8 w-full flex items-center justify-center gap-2">
          {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '✅'}
          {language === 'hi' ? 'पात्रता जांचें' : 'Check My Eligibility'}
        </button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className={`rounded-3xl p-8 border-2 mb-6 ${result.is_eligible ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-red-400 bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${result.is_eligible ? 'bg-green-500' : 'bg-red-500'} shadow-lg`}>
                  {result.is_eligible ? '✅' : '❌'}
                </div>
                <div>
                  <h2 className={`text-2xl font-display font-bold ${result.is_eligible ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                    {result.is_eligible ? (language === 'hi' ? 'आप पात्र हैं!' : 'You are Eligible!') : (language === 'hi' ? 'आप अभी पात्र नहीं हैं' : 'Not Eligible Yet')}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {result.is_eligible ? 'You can register to vote in Indian elections' : 'Please review the requirements below'}
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {result.reasons.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
                    <span className="mt-0.5">{r.startsWith('✓') ? '✅' : r.startsWith('⚠') ? '⚠️' : '❌'}</span>
                    <span>{r.replace(/^[✓⚠]/, '').trim()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next steps */}
            {result.next_steps.length > 0 && (
              <div className="card mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">
                  {language === 'hi' ? '🚀 अगले कदम' : '🚀 Next Steps'}
                </h3>
                <ol className="space-y-3">
                  {result.next_steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-200">
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{i+1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Documents */}
            {result.documents_needed.length > 0 && (
              <div className="card">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg">
                  📄 {language === 'hi' ? 'आवश्यक दस्तावेज़' : 'Documents Needed'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.documents_needed.map((doc, i) => (
                    <span key={i} className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">{doc}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
