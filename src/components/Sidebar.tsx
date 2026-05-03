import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import {
  Home, FileText, ScanSearch, BarChart3, BookOpen,
  GraduationCap, User, Mic2, Settings, LogOut, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/resume-format', label: 'Resume Format', icon: FileText },
  { path: '/resume-analyzer', label: 'Resume Analyze', icon: ScanSearch },
  { path: '/skill-gaps', label: 'Skill Gaps', icon: BarChart3 },
  { path: '/my-learning', label: 'My Learning', icon: BookOpen },
  { path: '/courses', label: 'Courses', icon: GraduationCap },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/interview', label: 'Interview', icon: Mic2 },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <button onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg">
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-30" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={"fixed lg:static inset-y-0 left-0 z-40 w-64 bg-secondary/50 border-r border-secondary transform transition-transform duration-300 lg:transform-none " + (mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0') + " flex flex-col h-screen"}>
        <div className="p-6 border-b border-secondary">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            <ScanSearch className="w-6 h-6 text-accent" />
            LetMeCheck
          </h1>
          <p className="text-xs text-primary/60 mt-1">AI Career Guidance</p>
        </div>
        {profile && (
          <div className="px-4 py-3 border-b border-secondary">
            <p className="text-sm font-medium text-primary truncate">{profile.full_name}</p>
            <p className="text-xs text-primary/50 truncate">{profile.target_job_role}</p>
          </div>
        )}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button key={item.path} onClick={() => { navigate(item.path); setMobileOpen(false) }}
                className={"sidebar-link w-full " + (isActive ? 'active' : '')}>
                <Icon size={18} />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>
        <div className="p-3 border-t border-secondary space-y-1">
          <button onClick={() => navigate('/settings')} className="sidebar-link w-full">
            <Settings size={18} /><span className="text-sm">Settings</span>
          </button>
          <button onClick={handleLogout} className="sidebar-link w-full text-red-600 hover:bg-red-50">
            <LogOut size={18} /><span className="text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}