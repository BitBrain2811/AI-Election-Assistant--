import { Link } from 'react-router-dom'
import { GiVote } from 'react-icons/gi'
import { FiPhone, FiMail, FiGlobe } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 mt-20">
      <div className="flag-stripe" />
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-green-600 rounded-xl flex items-center justify-center">
                <GiVote className="text-white text-xl" />
              </div>
              <span className="text-xl font-display font-bold text-white">VoterMitra</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
              AI-powered election guide for Indian citizens. Empowering democracy through accessible information.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center gap-2"><FiPhone size={14} className="text-orange-400" /><span>1950 - National Voter Helpline</span></div>
              <div className="flex items-center gap-2"><FiMail size={14} className="text-orange-400" /><span>support@electionassistant.in</span></div>
              <div className="flex items-center gap-2"><FiGlobe size={14} className="text-orange-400" /><a href="https://eci.gov.in" className="hover:text-orange-400 transition-colors" target="_blank" rel="noreferrer">eci.gov.in</a></div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[['Home', '/'], ['Registration', '/registration'], ['Eligibility', '/eligibility'], ['Timeline', '/timeline'], ['Polling Booth', '/polling-booth']].map(([label, path]) => (
                <li key={path}><Link to={path} className="hover:text-orange-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              {[['AI Chatbot', '/chatbot'], ['FAQ', '/faq'], ['Complaints', '/complaint'], ['Quiz', '/quiz'], ['Candidates', '/candidates']].map(([label, path]) => (
                <li key={path}><Link to={path} className="hover:text-orange-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2025 VoterMitra. Built for India's democratic empowerment.</p>
          <p>Powered by Election Commission of India data • Not an official ECI product</p>
        </div>
      </div>
    </footer>
  )
}
