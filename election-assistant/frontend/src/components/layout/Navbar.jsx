import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiLogOut, FiSettings } from 'react-icons/fi'
import { GiVote } from 'react-icons/gi'
import useThemeStore from '../../context/themeStore'
import useAuthStore from '../../context/authStore'

const navLinks = [
  { path: '/', label: 'Home', labelHi: 'होम' },
  { path: '/about', label: 'About', labelHi: 'जानकारी' },
  { path: '/registration', label: 'Register', labelHi: 'पंजीकरण' },
  { path: '/timeline', label: 'Timeline', labelHi: 'समयरेखा' },
  { path: '/chatbot', label: 'AI Guide', labelHi: 'AI गाइड' },
  { path: '/faq', label: 'FAQ', labelHi: 'FAQ' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { isDark, toggleDark, language, setLanguage } = useThemeStore()
  const { isAuthenticated, user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <GiVote className="text-white text-lg" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-gray-900 dark:text-white">Voter</span>
              <span className="font-display font-bold text-lg gradient-text">Mitra</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link px-3 py-2 rounded-lg text-sm ${
                  location.pathname === link.path
                    ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 font-semibold'
                    : ''
                }`}
              >
                {language === 'hi' ? link.labelHi : link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-orange-400 transition-colors text-gray-600 dark:text-gray-300"
            >
              {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
            </button>

            {/* Dark mode */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 hover:border-orange-400 transition-all"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">{user?.name?.split(' ')[0]}</span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 glass rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-orange-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 transition-colors">
                        <FiUser size={14} /> Profile
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-orange-50 dark:hover:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 transition-colors">
                          <FiSettings size={14} /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 transition-colors">
                        <FiLogOut size={14} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm py-2">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link key={link.path} to={link.path} className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.path ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
                  {language === 'hi' ? link.labelHi : link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-2 flex gap-2">
                  <Link to="/login" className="flex-1 btn-secondary text-sm text-center py-2">Login</Link>
                  <Link to="/register" className="flex-1 btn-primary text-sm text-center py-2">Register</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
