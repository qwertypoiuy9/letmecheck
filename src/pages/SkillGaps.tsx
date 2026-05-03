import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'
import { AlertCircle, CheckCircle, BookOpen, TrendingUp } from 'lucide-react'

interface SkillGap {
  id: string
  target_role: string
  missing_skills: any[]
  present_skills: any[]
  skill_coverage_percent: number
  analyzed_at: string
}

const RADAR_DATA = [
  { skill: 'Technical', present: 65, required: 100 },
  { skill: 'Soft Skills', present: 80, required: 100 },
  { skill: 'Tools', present: 55, required: 100 },
  { skill: 'Frameworks', present: 70, required: 100 },
  { skill: 'Domain', present: 60, required: 100 },
]

const BAR_DATA = [
  { name: 'Docker', required: 100, have: 0 },
  { name: 'Kubernetes', required: 100, have: 0 },
  { name: 'AWS', required: 100, have: 0 },
  { name: 'TypeScript', required: 100, have: 30 },
  { name: 'GraphQL', required: 100, have: 0 },
  { name: 'Jest', required: 100, have: 20 },
  { name: 'Redis', required: 100, have: 0 },
  { name: 'MongoDB', required: 100, have: 40 },
]

export default function SkillGaps() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [skillGap, setSkillGap] = useState<SkillGap | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchLatestSkillGap()
  }, [user])

  async function fetchLatestSkillGap() {
    const { data } = await supabase
      .from('skill_gaps')
      .select('*')
      .eq('user_id', user!.id)
      .order('analyzed_at', { ascending: false })
      .limit(1)
      .single()
    setSkillGap(data)
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
  }

  if (!skillGap) {
    return (
      <div className="card text-center py-12">
        <AlertCircle className="w-12 h-12 text-primary/30 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-primary mb-2">No Analysis Found</h2>
        <p className="text-primary/60 mb-6">Analyze your resume first to see your skill gaps</p>
        <button onClick={() => navigate('/resume-analyzer')} className="btn-primary">Analyze Resume</button>
      </div>
    )
  }

  const missing = skillGap.missing_skills || []
  const present = skillGap.present_skills || []
  const total = missing.length + present.length
  const coverage = total > 0 ? Math.round((present.length / total) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Skill Gaps</h1>
        <p className="text-primary/60">Target Role: <span className="font-medium">{skillGap.target_role}</span></p>
      </div>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">Skill Coverage</h2>
            <p className="text-sm text-primary/60">You have {present.length} out of {total} required skills</p>
          </div>
          <div className="text-right"><span className="text-3xl font-bold text-accent">{coverage}%</span></div>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-1000" style={{ width: coverage + '%' }} />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><TrendingUp size={18} /> Skill Radar</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#DBEAFE" />
              <PolarAngleAxis dataKey="skill" tick={{ fill: '#1E3A8A', fontSize: 12 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#1E3A8A', fontSize: 10 }} />
              <Radar name="Required" dataKey="required" stroke="#1E3A8A" fill="#1E3A8A" fillOpacity={0.1} strokeWidth={2} />
              <Radar name="Your Skills" dataKey="present" stroke="#10B981" fill="#10B981" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><AlertCircle size={18} /> Missing Skills</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={BAR_DATA} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#DBEAFE" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: '#1E3A8A', fontSize: 11 }} />
              <YAxis dataKey="name" type="category" tick={{ fill: '#1E3A8A', fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="required" fill="#1E3A8A" radius={[0, 4, 4, 0]} name="Required" />
              <Bar dataKey="have" fill="#10B981" radius={[0, 4, 4, 0]} name="You Have" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold text-primary mb-4">Skills You Need to Learn</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {missing.map((skill: any, idx: number) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-canvas rounded-lg border border-secondary">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">{skill.name || skill}</p>
                  <p className="text-xs text-primary/50">{skill.category || 'Technical'} • {skill.priority || 'High'} Priority</p>
                </div>
              </div>
              <button onClick={() => navigate('/courses')}
                className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-1">
                <BookOpen size={12} /> Learn
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold text-primary mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent" /> Your Strengths</h3>
        <div className="flex flex-wrap gap-2">
          {present.map((skill: any, idx: number) => (
            <span key={idx} className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium flex items-center gap-2">
              <CheckCircle size={14} /> {skill.name || skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}