import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { User, Mail, GraduationCap, Target, Award, FileText, TrendingUp } from 'lucide-react'

interface Resume {
  id: string
  file_name: string
  target_role: string
  analysis_score: number
  uploaded_at: string
}

interface Badge {
  id: string
  badge_name: string
  course_name: string
  verification_id: string
  issued_at: string
}

export default function Profile() {
  const { profile, user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user])

  async function fetchData() {
    const [{ data: resumeData }, { data: badgeData }] = await Promise.all([
      supabase.from('resumes').select('id, file_name, target_role, analysis_score, uploaded_at').eq('user_id', user!.id).order('uploaded_at', { ascending: false }),
      supabase.from('badges').select('*').eq('user_id', user!.id).order('issued_at', { ascending: false }),
    ])
    setResumes(resumeData || [])
    setBadges(badgeData || [])
    setLoading(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
  }

  const latestResume = resumes[0]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">My Profile</h1>
        <p className="text-primary/60">Your career dashboard and achievements</p>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><User size={20} /> Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-canvas rounded-lg">
            <User className="w-5 h-5 text-primary/40" />
            <div><p className="text-xs text-primary/50">Full Name</p><p className="text-sm font-medium text-primary">{profile?.full_name}</p></div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-canvas rounded-lg">
            <Mail className="w-5 h-5 text-primary/40" />
            <div><p className="text-xs text-primary/50">Email</p><p className="text-sm font-medium text-primary">{profile?.email}</p></div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-canvas rounded-lg">
            <GraduationCap className="w-5 h-5 text-primary/40" />
            <div><p className="text-xs text-primary/50">Graduation</p><p className="text-sm font-medium text-primary">{profile?.graduation_level} • {profile?.year_of_study}</p></div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-canvas rounded-lg">
            <Target className="w-5 h-5 text-primary/40" />
            <div><p className="text-xs text-primary/50">Target Role</p><p className="text-sm font-medium text-primary">{profile?.target_job_role}</p></div>
          </div>
        </div>
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><FileText size={20} /> Latest Resume Analysis</h2>
        {latestResume ? (
          <div className="flex items-center justify-between p-4 bg-canvas rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-medium text-primary">{latestResume.file_name}</p>
                <p className="text-sm text-primary/50">{latestResume.target_role}</p>
                <p className="text-xs text-primary/40">{new Date(latestResume.uploaded_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={"text-3xl font-bold " + (latestResume.analysis_score >= 70 ? 'text-accent' : 'text-orange-500')}>
                {latestResume.analysis_score}
              </span>
              <span className="text-primary/40 text-sm">/100</span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-primary/50 text-center py-4">No resume analyzed yet</p>
        )}
      </div>
      <div className="card">
        <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><Award size={20} /> Achievements & Badges</h2>
        {badges.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.map((badge) => (
              <div key={badge.id} className="p-4 bg-gradient-to-br from-accent/10 to-secondary rounded-xl border border-accent/20">
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-primary text-sm">{badge.badge_name}</h3>
                <p className="text-xs text-primary/60 mt-1">{badge.course_name}</p>
                <p className="text-xs text-accent mt-2 font-mono">ID: {badge.verification_id.slice(0, 12)}...</p>
                <p className="text-xs text-primary/40 mt-1">{new Date(badge.issued_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Award className="w-12 h-12 text-primary/20 mx-auto mb-3" />
            <p className="text-sm text-primary/50">No badges earned yet. Complete courses to earn verified badges!</p>
          </div>
        )}
      </div>
    </div>
  )
}