import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSearch, FiMapPin, FiUsers, FiCheckCircle } from 'react-icons/fi'
import api from '../../utils/api'
import useThemeStore from '../../context/themeStore'

const STATES = ['Delhi','Bihar','Uttar Pradesh','Maharashtra','Karnataka','Tamil Nadu','West Bengal','Gujarat','Rajasthan','Madhya Pradesh']

export default function PollingBoothPage() {
  const [booths, setBooths] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState({ state: '', district: '', constituency: '' })
  const [searched, setSearched] = useState(false)
  const { language } = useThemeStore()

  const search = async () => {
    if (!filters.state) return
    setLoading(true); setSearched(true)
    try {
      const params = new URLSearchParams()
      if (filters.state) params.append('state', filters.state)
      if (filters.district) params.append('district', filters.district)
      if (filters.constituency) params.append('constituency', filters.constituency)
      const res = await api.get(`/election/polling-booths?${params}`)
      setBooths(res.data)
    } catch { setBooths([]) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="section-heading mb-3">🗺️ {language === 'hi' ? 'मतदान केंद्र खोजें' : 'Find Polling Booth'}</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'hi' ? 'अपने निकटतम मतदान केंद्र का पता लगाएं' : 'Locate your nearest polling booth for the upcoming election'}
        </p>
      </motion.div>

      {/* Search Card */}
      <div className="card mb-8">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {language === 'hi' ? 'राज्य *' : 'State *'}
            </label>
            <select
              value={filters.state}
              onChange={e => setFilters(f => ({ ...f, state: e.target.value }))}
              className="input-field"
            >
              <option value="">Select State</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {language === 'hi' ? 'जिला' : 'District'}
            </label>
            <input
              value={filters.district}
              onChange={e => setFilters(f => ({ ...f, district: e.target.value }))}
              placeholder="e.g. South Delhi"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              {language === 'hi' ? 'निर्वाचन क्षेत्र' : 'Constituency'}
            </label>
            <input
              value={filters.constituency}
              onChange={e => setFilters(f => ({ ...f, constituency: e.target.value }))}
              placeholder="e.g. New Delhi"
              className="input-field"
            />
          </div>
        </div>
        <button onClick={search} disabled={!filters.state || loading} className="btn-primary flex items-center gap-2">
          {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FiSearch size={16} />}
          {language === 'hi' ? 'केंद्र खोजें' : 'Search Booths'}
        </button>
      </div>

      {/* Info boxes */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { icon: '🕖', title: 'Polling Hours', desc: '7:00 AM to 6:00 PM on election day' },
          { icon: '🪪', title: 'ID Required', desc: 'Any valid photo ID (Aadhaar, PAN, EPIC, etc.)' },
          { icon: '🚫', title: 'Not Allowed', desc: 'Phones, cameras inside voting compartment' },
        ].map((info, i) => (
          <div key={i} className="card text-center py-5 hover:border-orange-200 dark:hover:border-orange-700">
            <div className="text-3xl mb-2">{info.icon}</div>
            <div className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{info.title}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{info.desc}</div>
          </div>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence>
        {searched && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-28 shimmer rounded-2xl" />)}
              </div>
            ) : booths.length === 0 ? (
              <div className="text-center py-14 text-gray-400">
                <div className="text-5xl mb-4">🗺️</div>
                <p className="font-medium">No booths found. Try different filters.</p>
                <p className="text-sm mt-2">You can also check on <a href="https://electoralsearch.eci.gov.in" target="_blank" rel="noreferrer" className="text-orange-500 underline">electoralsearch.eci.gov.in</a></p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 dark:text-white">{booths.length} Booths Found</h2>
                  <span className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">✓ {filters.state}</span>
                </div>
                <div className="space-y-4">
                  {booths.map((booth, i) => (
                    <motion.div
                      key={booth.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                      className="card hover:border-orange-200 dark:hover:border-orange-700"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex gap-4 items-start">
                          <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-xl shrink-0">🏫</div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">{booth.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                              <FiMapPin size={12} /> {booth.address}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">Booth #{booth.booth_number}</span>
                              <span className="badge bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">{booth.constituency}</span>
                              {booth.is_accessible && (
                                <span className="badge bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                  <FiCheckCircle size={10} /> Accessible
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {booth.capacity && (
                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                              <FiUsers size={13} /> Capacity: {booth.capacity.toLocaleString()}
                            </div>
                          )}
                          {booth.latitude && (
                            <a
                              href={`https://maps.google.com/?q=${booth.latitude},${booth.longitude}`}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium"
                            >
                              📍 View on Maps →
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alternate resources */}
      <div className="mt-12 card bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-bold text-gray-900 dark:text-white mb-3">🔗 Official Resources</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            ['Electoral Search (ECI)', 'https://electoralsearch.eci.gov.in'],
            ['NVSP Voter Services', 'https://nvsp.in'],
            ['Voter Helpline App', '#'],
            ['1950 Voter Helpline', 'tel:1950'],
          ].map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-200 transition-colors">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
