import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { ExternalLink, BookOpen, Clock, BarChart3, CheckCircle } from 'lucide-react'

interface Course {
  id: string
  title: string
  provider: string
  skills_covered: string[]
  duration: string
  difficulty: string
  url: string
  category: string
}

interface UserCourse {
  id: string
  course_id: string
  status: string
}

export default function Courses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [userCourses, setUserCourses] = useState<Record<string, UserCourse>>({})
  const [loading, setLoading] = useState(true)
  const [accessedMsg, setAccessedMsg] = useState('')

  useEffect(() => {
    if (!user) return
    fetchCourses()
  }, [user])

  async function fetchCourses() {
    const { data: allCourses } = await supabase.from('courses').select('*')
    const { data: myCourses } = await supabase.from('user_courses').select('*').eq('user_id', user!.id)
    const ucMap: Record<string, UserCourse> = {}
    myCourses?.forEach((uc: any) => { ucMap[uc.course_id] = uc })
    setCourses(allCourses || [])
    setUserCourses(ucMap)
    setLoading(false)
  }

  async function handleAccessCourse(course: Course) {
    if (!user) return
    const existing = userCourses[course.id]
    if (existing) { window.open(course.url, '_blank'); return }
    const { data, error } = await supabase.from('user_courses').insert({
      user_id: user.id, course_id: course.id, status: 'accessed',
      accessed_at: new Date().toISOString(),
    } as any).select().single()
    if (!error && data) {
      setUserCourses(prev => ({ ...prev, [course.id]: data }))
      setAccessedMsg('You have accessed "' + course.title + '". Complete the course and return to upload your certificate for a verified badge!')
      setTimeout(() => setAccessedMsg(''), 6000)
    }
    window.open(course.url, '_blank')
  }

  const getDifficultyColor = (d: string) => {
    if (d === 'Beginner') return 'bg-accent/10 text-accent'
    if (d === 'Intermediate') return 'bg-primary/10 text-primary'
    return 'bg-orange-100 text-orange-600'
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div></div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Recommended Courses</h1>
        <p className="text-primary/60">Based on your skill gaps and target role</p>
      </div>
      {accessedMsg && (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl text-accent flex items-start gap-3">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{accessedMsg}</p>
        </div>
      )}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {courses.map((course) => {
          const userCourse = userCourses[course.id]
          const isAccessed = !!userCourse
          return (
            <div key={course.id} className="card hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <span className={"px-2 py-1 rounded-full text-xs font-medium " + getDifficultyColor(course.difficulty || 'Beginner')}>
                  {course.difficulty}
                </span>
              </div>
              <h3 className="font-semibold text-primary mb-1">{course.title}</h3>
              <p className="text-sm text-primary/50 mb-3">{course.provider}</p>
              <div className="flex items-center gap-4 text-xs text-primary/60 mb-3">
                <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                <span className="flex items-center gap-1"><BarChart3 size={12} /> {course.category}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-4">
                {(course.skills_covered || []).slice(0, 3).map((skill: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 bg-secondary text-primary text-xs rounded-full">{skill}</span>
                ))}
              </div>
              <div className="mt-auto pt-3 border-t border-secondary">
                <button onClick={() => handleAccessCourse(course)}
                  className={"w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 " + (isAccessed ? 'bg-accent/10 text-accent' : 'bg-primary text-white hover:bg-blue-900')}>
                  {isAccessed ? <><CheckCircle size={14} /> Accessed</> : <><ExternalLink size={14} /> Access Course</>}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}