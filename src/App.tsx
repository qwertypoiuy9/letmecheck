import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import ResumeFormat from '@/pages/ResumeFormat'
import ResumeAnalyzer from '@/pages/ResumeAnalyzer'
import SkillGaps from '@/pages/SkillGaps'
import MyLearning from '@/pages/MyLearning'
import Courses from '@/pages/Courses'
import Profile from '@/pages/Profile'
import Interview from '@/pages/Interview'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/resume-format" element={<Layout><ResumeFormat /></Layout>} />
        <Route path="/resume-analyzer" element={<Layout><ResumeAnalyzer /></Layout>} />
        <Route path="/skill-gaps" element={<Layout><SkillGaps /></Layout>} />
        <Route path="/my-learning" element={<Layout><MyLearning /></Layout>} />
        <Route path="/courses" element={<Layout><Courses /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/interview" element={<Layout><Interview /></Layout>} />
      </Routes>
    </AuthProvider>
  )
}

export default App