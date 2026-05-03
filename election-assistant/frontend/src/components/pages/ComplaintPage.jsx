import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi'
import api from '../../utils/api'
import useThemeStore from '../../context/themeStore'
import toast from 'react-hot-toast'

const STATUS_CONFIG = {
  pending: { label: 'Pending Review', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300', icon: <FiClock size={12} /> },
  in_review: { label: 'In Review', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: '🔍' },
  resolved: { label: 'Resolved', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: <FiCheckCircle size={12} /> },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300', icon: '❌' },
}

export default function ComplaintPage() {
  const [categories, setCategories] = useState([])
  const [myComplaints, setMyComplaints] = useState([])
  const [trackRef, setTrackRef] = useState('')
  const [trackedComplaint, setTrackedComplaint] = useState(null)
  const [tab, setTab] = useState('submit')
  const [form, setForm] = useState({ subject: '', description: '', category: '', state: '', district: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const { language } = useThemeStore()

  useEffect(() => {
    api.get('/complaint/categories').then(r => setCategories(r.data.categories))
    api.get('/complaint/my').then(r => setMyComplaints(r.data)).catch(() => {})
  }, [])

  const submit = async () => {
    if (!form.subject || !form.description || !form.category) {
      toast.error('Please fill all required fields'); return
    }
    setLoading(true)
    try {
      const res = await api.post('/complaint/', form)
      setSubmitted(res.data)
      setMyComplaints(prev => [res.data, ...prev])
      setForm({ subject: '', description: '', category: '', state: '', district: '' })
      toast.success('Complaint submitted successfully!')
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Error submitting complaint')
    } finally { setLoading(false) }
  }

  const trackComplaint = async () => {
    if (!trackRef.trim()) return
    try {
      const res = await api.get(`/complaint/track/${trackRef.trim()}`)
      setTrackedComplaint(res.data)
    } catch { toast.error('Complaint not found') }
  }

  const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
    return (
      <span className={`badge ${cfg.color} flex items-center gap-1`}>
        {cfg.icon} {cfg.label}
      </span>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="section-heading mb-3">📣 {language === 'hi' ? 'शिकायत पोर्टल' : 'Complaint Portal'}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'hi' ? 'चुनाव से संबंधित शिकायत दर्ज करें या अपनी शिकायत ट्रैक करें' : 'Submit election-related complaints or track existing ones'}
        </p>
      </motion.div>

      {/* Emergency banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-2xl p-4 mb-8 flex items-center gap-3">
        <FiAlertCircle className="text-red-500 shrink-0" size={20} />
        <div className="text-sm">
          <span className="font-semibold text-red-800 dark:text-red-300">Emergency? </span>
          <span className="text-red-700 dark:text-red-400">Call <strong>1950</strong> (24/7 Helpline) or use the <strong>cVIGIL App</strong> for live MCC violation reporting (resolved within 100 mins)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
        {[
          { id: 'submit', label: 'Submit Complaint', icon: '📝' },
          { id: 'track', label: 'Track Complaint', icon: '🔍' },
          { id: 'my', label: `My Complaints (${myComplaints.length})`, icon: '📋' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Submit tab */}
        {tab === 'submit' && (
          <motion.div key="submit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card text-center py-12">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✅</div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Complaint Submitted!</h2>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Your complaint has been registered successfully.</p>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl px-6 py-4 inline-block mb-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Reference Number</div>
                  <div className="text-2xl font-bold font-mono text-orange-600">{submitted.reference_number}</div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Save this reference number to track your complaint status</p>
                <button onClick={() => setSubmitted(null)} className="btn-primary">Submit Another</button>
              </motion.div>
            ) : (
              <div className="card">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Subject *</label>
                    <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Brief description of the issue" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Category *</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">State</label>
                    <input value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="e.g. Delhi" className="input-field" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Description *</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      placeholder="Provide detailed information about the issue, including date, time, location and any witnesses..."
                      className="input-field h-36 resize-none"
                    />
                  </div>
                </div>
                <button onClick={submit} disabled={loading} className="btn-primary mt-6 flex items-center gap-2">
                  {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '📤'}
                  Submit Complaint
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Track tab */}
        {tab === 'track' && (
          <motion.div key="track" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="card mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Enter Reference Number</label>
              <div className="flex gap-3">
                <input value={trackRef} onChange={e => setTrackRef(e.target.value)} placeholder="e.g. COMP202401230001" className="input-field flex-1 font-mono" />
                <button onClick={trackComplaint} className="btn-primary flex items-center gap-2 shrink-0">
                  <FiSearch size={16} /> Track
                </button>
              </div>
            </div>
            {trackedComplaint && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{trackedComplaint.subject}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mt-1">{trackedComplaint.reference_number}</p>
                  </div>
                  <StatusBadge status={trackedComplaint.status} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{trackedComplaint.description}</p>
                {trackedComplaint.admin_response && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-700">
                    <div className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">Admin Response:</div>
                    <p className="text-sm text-gray-700 dark:text-gray-200">{trackedComplaint.admin_response}</p>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {/* My complaints tab */}
        {tab === 'my' && (
          <motion.div key="my" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {myComplaints.length === 0 ? (
              <div className="text-center py-14 text-gray-400">
                <div className="text-5xl mb-4">📋</div>
                <p>No complaints submitted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {myComplaints.map((c, i) => (
                  <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{c.subject}</h3>
                        <p className="text-xs font-mono text-gray-400 mt-1">{c.reference_number}</p>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{c.description}</p>
                    {c.admin_response && (
                      <div className="mt-3 bg-green-50 dark:bg-green-900/20 rounded-xl p-3 text-sm text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
                        <strong>Response:</strong> {c.admin_response}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
