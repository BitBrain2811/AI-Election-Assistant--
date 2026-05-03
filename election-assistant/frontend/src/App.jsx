import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useThemeStore from './context/themeStore'
import useAuthStore from './context/authStore'

import Layout from './components/layout/Layout'
import LandingPage from './components/pages/LandingPage'
import AboutPage from './components/pages/AboutPage'
import RegistrationPage from './components/pages/RegistrationPage'
import EligibilityPage from './components/pages/EligibilityPage'
import TimelinePage from './components/pages/TimelinePage'
import PollingBoothPage from './components/pages/PollingBoothPage'
import ChatbotPage from './components/pages/ChatbotPage'
import FAQPage from './components/pages/FAQPage'
import ComplaintPage from './components/pages/ComplaintPage'
import AdminDashboard from './components/pages/AdminDashboard'
import LoginPage from './components/pages/LoginPage'
import RegisterPage from './components/pages/RegisterPage'
import ProfilePage from './components/pages/ProfilePage'
import QuizPage from './components/pages/QuizPage'
import CandidatesPage from './components/pages/CandidatesPage'

function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { initTheme } = useThemeStore()
  const { initAuth } = useAuthStore()

  useEffect(() => {
    initTheme()
    initAuth()
  }, [])

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { fontFamily: 'DM Sans, sans-serif', borderRadius: '12px', fontSize: '14px' },
          success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
          error: { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="registration" element={<RegistrationPage />} />
          <Route path="eligibility" element={<EligibilityPage />} />
          <Route path="timeline" element={<TimelinePage />} />
          <Route path="polling-booth" element={<PollingBoothPage />} />
          <Route path="chatbot" element={<ChatbotPage />} />
          <Route path="faq" element={<FAQPage />} />
          <Route path="candidates" element={<CandidatesPage />} />
          <Route path="quiz" element={<QuizPage />} />
          <Route path="complaint" element={
            <ProtectedRoute><ComplaintPage /></ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />
          <Route path="admin" element={
            <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
          } />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}
