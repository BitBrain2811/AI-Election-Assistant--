import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FiUsers, FiAlertCircle, FiCheckCircle, FiBell, FiList } from 'react-icons/fi'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [complaints, setComplaints] = useState([])
  const [notices, setNotices] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('overview')
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', priority: 'normal', notice_type: 'general' })
  const [selectedStatus, setSelectedStatus] = useState('')

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {})
    api.get('/admin/complaints').then(r => setComplaints(r.data)).catch(() => {})
    api.get('/admin/notices').then(r => setNotices(r.data)).catch(() => {})
    api.get('/admin/users').then(r => setUsers(r.data)).catch(() => {})
  }, [])

  const updateComplaint = async (id, status, response = '') => {
    try {
      await api.put(`/admin/complaints/${id}`, { status, admin_response: response || null })
      setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c))
      toast.success('Complaint updated')
    } catch { toast.error('Error updating complaint') }
  }

  const createNotice = async () => {
    if (!noticeForm.title || !noticeForm.content) { toast.error('Fill all fields'); return }
    try {
      const res = await api.post('/admin/notices', noticeForm)
      setNotices(prev => [res.data, ...prev])
      setNoticeForm({ title: '', content: '', priority: 'normal', notice_type: 'general' })
      toast.success('Notice published!')
    } catch { toast.error('Error creating notice') }
  }

  const statCards = stats ? [
    { icon: FiUsers, label: 'Total Users', value: stats.total_users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { icon: FiAlertCircle, label: 'Pending Complaints', value: stats.pending_complaints, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20' },
    { icon: FiList, label: 'Total FAQs', value: stats.total_faqs, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { icon: FiBell, label: 'Active Notices', value: stats.active_notices, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  ] : []

  const complaintByStatus = ['pending','in_review','resolved','rejected'].map(s => ({
    name: s, value: complaints.filter(c => c.status === s).length
  }))
  const COLORS = ['#f97316','#3b82f6','#22c55e','#ef4444']

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">⚙️ Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage complaints, notices, and users</p>
        </div>
        <div className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Admin Panel</div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`card ${s.bg}`}>
              <s.icon className={`${s.color} mb-2`} size={24} />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide">
        {['overview','complaints','notices','users'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${tab === t ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Complaints by Status</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={complaintByStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {complaintByStatus.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-3 mt-2">
              {complaintByStatus.map((s, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs">
                  <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                  <span className="text-gray-600 dark:text-gray-300 capitalize">{s.name}: {s.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {complaints.slice(0, 5).map(c => (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300 truncate max-w-xs">{c.subject}</span>
                  <span className={`badge text-xs ml-2 shrink-0 ${c.status === 'resolved' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{c.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Complaints */}
      {tab === 'complaints' && (
        <div className="space-y-4">
          <div className="flex gap-2 mb-4 flex-wrap">
            {['', 'pending', 'in_review', 'resolved', 'rejected'].map(s => (
              <button key={s} onClick={() => setSelectedStatus(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedStatus === s ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {s || 'All'}
              </button>
            ))}
          </div>
          {complaints.filter(c => !selectedStatus || c.status === selectedStatus).map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="card">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{c.subject}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{c.reference_number}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{c.description}</p>
                </div>
                <div className="flex gap-2 flex-wrap shrink-0">
                  {['in_review', 'resolved', 'rejected'].map(s => (
                    <button key={s} onClick={() => updateComplaint(c.id, s)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${c.status === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-orange-400'}`}>
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Notices */}
      {tab === 'notices' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Post New Notice</h3>
            <div className="card space-y-4">
              <input value={noticeForm.title} onChange={e => setNoticeForm(f => ({ ...f, title: e.target.value }))} placeholder="Notice title" className="input-field" />
              <textarea value={noticeForm.content} onChange={e => setNoticeForm(f => ({ ...f, content: e.target.value }))} placeholder="Notice content..." className="input-field h-28 resize-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={noticeForm.priority} onChange={e => setNoticeForm(f => ({ ...f, priority: e.target.value }))} className="input-field text-sm">
                  <option value="normal">Normal</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
                <select value={noticeForm.notice_type} onChange={e => setNoticeForm(f => ({ ...f, notice_type: e.target.value }))} className="input-field text-sm">
                  <option value="general">General</option>
                  <option value="important">Important</option>
                  <option value="campaign">Campaign</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
              <button onClick={createNotice} className="btn-primary w-full">📢 Publish Notice</button>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Published Notices ({notices.length})</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
              {notices.map((n, i) => (
                <div key={n.id} className={`card py-4 ${n.priority === 'high' ? 'border-orange-300 dark:border-orange-700' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{n.title}</h4>
                    <span className={`badge text-xs shrink-0 ${n.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>{n.priority}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{n.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                {['Name', 'Email', 'State', 'Role', 'Civic Score', 'Joined'].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-gray-500 dark:text-gray-400 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-gray-100 dark:border-gray-800 hover:bg-orange-50/50 dark:hover:bg-orange-900/10 transition-colors">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{u.name}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{u.email}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400">{u.state || '—'}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{u.role}</span>
                  </td>
                  <td className="py-3 px-4 text-orange-500 font-semibold">{u.civic_score}</td>
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
