import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, isPast, isFuture, differenceInDays } from 'date-fns'
import { FiCalendar, FiClock, FiMapPin, FiFilter } from 'react-icons/fi'
import api from '../../utils/api'
import useThemeStore from '../../context/themeStore'

const EVENT_COLORS = {
  registration: 'bg-blue-500',
  deadline: 'bg-red-500',
  announcement: 'bg-purple-500',
  assembly_election: 'bg-orange-500',
  local_election: 'bg-green-500',
  nomination: 'bg-yellow-500',
  polling_day: 'bg-orange-600',
  results: 'bg-emerald-500',
}

const EVENT_ICONS = {
  registration: '📋', deadline: '⏰', announcement: '📢',
  assembly_election: '🏛️', local_election: '🏘️', nomination: '📝',
  polling_day: '🗳️', results: '📊'
}

export default function TimelinePage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { language } = useThemeStore()

  useEffect(() => {
    api.get('/election/events').then(r => { setEvents(r.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? events : events.filter(e => e.event_type === filter)

  const upcoming = filtered.filter(e => isFuture(new Date(e.event_date)))
  const past = filtered.filter(e => isPast(new Date(e.event_date)))

  const EventCard = ({ event, index }) => {
    const date = new Date(event.event_date)
    const daysLeft = differenceInDays(date, new Date())
    const isPastEvent = isPast(date)

    return (
      <motion.div
        initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.08 }}
        className={`relative flex gap-6 pb-8 ${isPastEvent ? 'opacity-60' : ''}`}
      >
        {/* Timeline dot */}
        <div className="relative flex flex-col items-center">
          <div className={`w-12 h-12 ${EVENT_COLORS[event.event_type] || 'bg-gray-400'} rounded-2xl flex items-center justify-center text-xl shadow-lg z-10 shrink-0`}>
            {EVENT_ICONS[event.event_type] || '📅'}
          </div>
          <div className="absolute top-12 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 card mb-0 hover:border-orange-200 dark:hover:border-orange-700">
          <div className="flex items-start justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                {language === 'hi' && event.title_hi ? event.title_hi : event.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {language === 'hi' && event.description_hi ? event.description_hi : event.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className={`badge ${isPastEvent ? 'bg-gray-100 dark:bg-gray-700 text-gray-500' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'}`}>
                {isPastEvent ? 'Completed' : daysLeft === 0 ? 'TODAY' : `${daysLeft} days`}
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><FiCalendar size={13} />{format(date, 'dd MMM yyyy')}</span>
            <span className="flex items-center gap-1"><FiClock size={13} />{format(date, 'hh:mm a')}</span>
            {event.state && <span className="flex items-center gap-1"><FiMapPin size={13} />{event.state}</span>}
            {event.is_national && <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">National</span>}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <h1 className="section-heading mb-3">
          📅 {language === 'hi' ? 'चुनाव समयरेखा' : 'Election Timeline'}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {language === 'hi' ? 'सभी महत्वपूर्ण चुनाव तिथियां और घटनाएं' : 'All important election dates and events at a glance'}
        </p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {['all', 'registration', 'polling_day', 'deadline', 'results', 'announcement'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-orange-500 text-white shadow-lg' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-300'}`}
          >
            {EVENT_ICONS[f] || '🔍'} {f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 shimmer rounded-2xl" />)}
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section className="mb-12">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                Upcoming Events
              </h2>
              <div className="pl-2">
                {upcoming.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2">
                Past Events
              </h2>
              <div className="pl-2">
                {past.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
              </div>
            </section>
          )}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <div className="text-5xl mb-4">📅</div>
              <p>No events found for this filter</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
