import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiEdit2, FiSave, FiX, FiAward } from 'react-icons/fi'
import api from '../../utils/api'
import useAuthStore from '../../context/authStore'
import useThemeStore from '../../context/themeStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const { language } = useThemeStore()
  const [readiness, setReadiness] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', state: '', district: '', voter_id: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', state: user.state || '', district: user.district || '', voter_id: user.voter_id || '' })
    api.get('/user/readiness-score').then(r => setReadiness(r.data)).catch(() => {})
  }, [user])

  const save = async () => {
    setSaving(true)
    try {
      const res = await api.put('/user/profile', form)
      updateUser(res.data)
      setEditing(false)
      toast.success('Profile updated!')
    } catch { toast.error('Error updating profile') }
    finally { setSaving(false) }
  }

  const scoreColor = readiness?.score >= 80 ? 'text-green-600' : readiness?.score >= 50 ? 'text-orange-500' : 'text-red-500'
  const scoreGradient = readiness?.score >= 80 ? 'from-green-400 to-emerald-600' : readiness?.score >= 50 ? 'from-orange-400 to-orange-600' : 'from-red-400 to-red-600'

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="section-heading mb-2">👤 {language === 'hi' ? 'मेरी प्रोफ़ाइल' : 'My Profile'}</h1>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Profile card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || '👤'}
            </div>
            <h2 className="font-bold text-xl text-gray-900 dark:text-white">{user?.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <div className={`mt-2 badge ${user?.role === 'admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'}`}>
              {user?.role === 'admin' ? '⚙️ Admin' : '🗳️ Citizen'}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-orange-500 font-bold text-lg">
              <FiAward /> {user?.civic_score || 0} Civic Points
            </div>
          </div>

          {/* Readiness Score */}
          {readiness && (
            <div className="card text-center">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Election Readiness Score</h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - readiness.score / 100) }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${scoreColor}`}>{readiness.score}%</span>
                </div>
              </div>
              <div className="space-y-2">
                {readiness.breakdown?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                      {item.completed ? '✅' : '⬜'} {item.item}
                    </span>
                    <span className={`font-semibold ${item.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>+{item.points}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Edit form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Personal Information</h3>
              {!editing ? (
                <button onClick={() => setEditing(true)} className="btn-ghost flex items-center gap-1 text-sm">
                  <FiEdit2 size={14} /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditing(false)} className="btn-ghost text-sm flex items-center gap-1"><FiX size={14} /> Cancel</button>
                  <button onClick={save} disabled={saving} className="btn-primary text-sm py-2 flex items-center gap-1">
                    {saving ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSave size={14} />} Save
                  </button>
                </div>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Your full name' },
                { key: 'phone', label: 'Phone Number', placeholder: '+91 XXXXX XXXXX' },
                { key: 'state', label: 'State', placeholder: 'e.g. Delhi' },
                { key: 'district', label: 'District', placeholder: 'e.g. South Delhi' },
                { key: 'voter_id', label: 'Voter ID (EPIC)', placeholder: 'e.g. ABC1234567' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">{label}</label>
                  {editing ? (
                    <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={placeholder} className="input-field" />
                  ) : (
                    <div className="input-field bg-gray-50 dark:bg-gray-800 cursor-default text-gray-700 dark:text-gray-200">
                      {user?.[key] || <span className="text-gray-400">Not set</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="card">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Quick Actions</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: '🎮', label: 'Take Election Quiz', href: '/quiz' },
                { icon: '🤖', label: 'Ask AI Guide', href: '/chatbot' },
                { icon: '📋', label: 'Register to Vote', href: '/registration' },
                { icon: '📣', label: 'File Complaint', href: '/complaint' },
              ].map((item, i) => (
                <a key={i} href={item.href} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-700">
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
