import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { BookOpen, Clock, CheckCircle, Loader2, Upload } from 'lucide-react'

interface UserCourseDetail {
  id: string
  status: string
  accessed_at: string
  course: {
    title: string
    provider: string
    duration: string
    skills_covered: string[]
  }
}

export default function MyLearning() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<UserCourseDetail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    fetchUserCourses()
  }, [user])

  async function fetchUserCourses() {
    const { data } = await supabase
      .from('user_courses')
      .select('id, status, accessed_at, course:courses(title, provider, duration, skills_covered)')
      .eq('user_id', user!.id)
      .order('accessed_at', { ascending: false })
    setCourses(data || [])
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-accent" />
    if (status === 'in_progress') return <Loader2 className="w-5 h-5 text-primary animate-spin" />
    return <BookOpen className="w-5 h-5 text-primary/40" />
  }
  const getStatusLabel = (status: string) => {
    if (status === 'completed') return 'Completed'
    if (status === 'in_progress') return 'In Progress'
    if (status === 'accessed') return 'Accessed'
    return 'Not Started'
  }
  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-accent/10 text-accent'
    if (status === 'in_progress') return 'bg-primary/10 text-primary'
    if (status === 'accessed') return 'bg-secondary text-primary'
    return 'bg-gray-100 text-gray-500'
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">My Learning</h1>
        <p className="text-primary/60">Track your courses and progress</p>
      </div>
      {courses.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="w-12 h-12 text-primary/20 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-primary mb-2">No Courses Yet</h2>
          <p className="text-sm text-primary/50">Visit the Courses page to start learning</p>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((uc) => (
            <div key={uc.id} className="card flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center shrink-0">
                {getStatusIcon(uc.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-primary">{uc.course.title}</h3>
                    <p className="text-sm text-primary/50">{uc.course.provider}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-xs text-primary/40"><Clock size={12} /> {uc.course.duration}</span>
                      <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + getStatusColor(uc.status)}>
                        {getStatusLabel(uc.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(uc.course.skills_covered || []).slice(0, 3).map((s: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-secondary text-primary text-xs rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  {uc.status !== 'completed' && (
                    <button className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-1 shrink-0">
                      <Upload size={12} /> Upload Certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}