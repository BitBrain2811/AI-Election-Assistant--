import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiAlertTriangle } from 'react-icons/fi'
import api from '../../utils/api'
import useThemeStore from '../../context/themeStore'

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([])
  const [filters, setFilters] = useState({ state: '', constituency: '' })
  const [loading, setLoading] = useState(true)
  const [compare, setCompare] = useState([])
  const { language } = useThemeStore()

  useEffect(() => {
    const params = new URLSearchParams()
    if (filters.state) params.append('state', filters.state)
    if (filters.constituency) params.append('constituency', filters.constituency)
    setLoading(true)
    api.get(`/election/candidates?${params}`)
      .then(r => { setCandidates(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [filters])

  const toggleCompare = (id) => {
    setCompare(prev => prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 2 ? [...prev, id] : prev)
  }

  const compareData = candidates.filter(c => compare.includes(c.id))

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="section-heading mb-3">🏛️ {language === 'hi' ? 'उम्मीदवार जानकारी' : 'Candidate Information'}</h1>
        <p className="text-gray-500 dark:text-gray-400">Compare candidates based on education, assets, criminal cases and manifesto</p>
      </motion.div>

      {/* Filters */}
      <div className="card mb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">State</label>
            <input value={filters.state} onChange={e => setFilters(f => ({ ...f, state: e.target.value }))} placeholder="e.g. Delhi" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Constituency</label>
            <input value={filters.constituency} onChange={e => setFilters(f => ({ ...f, constituency: e.target.value }))} placeholder="e.g. New Delhi" className="input-field" />
          </div>
        </div>
      </div>

      {/* Compare banner */}
      {compare.length > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-orange-50 dark:bg-orange-900/20 border border-orange-300 dark:border-orange-700 rounded-2xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm font-medium text-orange-800 dark:text-orange-300">
            {compare.length === 1 ? 'Select 1 more candidate to compare' : 'Comparing 2 candidates'}
          </span>
          {compare.length === 2 && (
            <button onClick={() => {}} className="btn-primary text-sm py-2">View Comparison</button>
          )}
        </motion.div>
      )}

      {/* Comparison table */}
      {compareData.length === 2 && (
        <div className="card mb-8 overflow-x-auto">
          <h2 className="font-bold text-gray-900 dark:text-white text-xl mb-6">⚖️ Side-by-Side Comparison</h2>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Attribute</th>
                {compareData.map(c => (
                  <th key={c.id} className="text-left py-2 px-4">
                    <div className="font-bold text-gray-900 dark:text-white">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.party}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Education', 'education'],
                ['Age', 'age'],
                ['Assets', 'assets'],
                ['Criminal Cases', 'criminal_cases'],
                ['Constituency', 'constituency'],
              ].map(([label, key]) => (
                <tr key={key} className="border-t border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-gray-500 dark:text-gray-400 font-medium">{label}</td>
                  {compareData.map(c => (
                    <td key={c.id} className={`py-3 px-4 font-medium ${key === 'criminal_cases' && c[key] > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                      {key === 'criminal_cases' ? (
                        <span className="flex items-center gap-1">
                          {c[key] > 0 ? <FiAlertTriangle size={14} /> : '✅'} {c[key]} {c[key] > 0 ? 'case(s)' : 'clean'}
                        </span>
                      ) : c[key] || '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Candidate grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-56 shimmer rounded-2xl" />)}
        </div>
      ) : candidates.length === 0 ? (
        <div className="text-center py-14 text-gray-400">
          <div className="text-5xl mb-4">🏛️</div>
          <p>No candidates found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={`card hover:border-orange-200 dark:hover:border-orange-700 relative ${compare.includes(c.id) ? 'border-orange-400 ring-2 ring-orange-400/30' : ''}`}
            >
              {compare.includes(c.id) && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {compare.indexOf(c.id) + 1}
                </div>
              )}
              <div className="flex items-center gap-4 mb-4">
                {c.image_url ? (
                  <img src={c.image_url} alt={c.name} className="w-14 h-14 rounded-2xl object-cover" />
                ) : (
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-200 to-orange-400 dark:from-orange-800 dark:to-orange-600 rounded-2xl flex items-center justify-center">
                    <FiUser className="text-orange-700 dark:text-orange-200" size={24} />
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{c.name}</h3>
                  <div className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs mt-1">{c.party}</div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Constituency</span><span className="font-medium text-gray-800 dark:text-gray-200">{c.constituency}</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Age</span><span className="font-medium text-gray-800 dark:text-gray-200">{c.age || '—'} yrs</span></div>
                <div className="flex justify-between"><span className="text-gray-500 dark:text-gray-400">Assets</span><span className="font-medium text-gray-800 dark:text-gray-200">{c.assets || '—'}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Criminal Cases</span>
                  <span className={`font-medium flex items-center gap-1 ${c.criminal_cases > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {c.criminal_cases > 0 ? <FiAlertTriangle size={12} /> : '✅'} {c.criminal_cases}
                  </span>
                </div>
              </div>
              {c.manifesto_summary && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 line-clamp-2">{c.manifesto_summary}</p>
              )}
              <button
                onClick={() => toggleCompare(c.id)}
                className={`w-full mt-4 py-2 rounded-xl text-sm font-medium transition-all ${compare.includes(c.id) ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20'}`}
              >
                {compare.includes(c.id) ? '✓ Selected for Compare' : '+ Compare'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
