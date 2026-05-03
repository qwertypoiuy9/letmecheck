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

const LOCAL_COURSES: Course[] = [
  { id: 'local-1', title: 'Advanced React Patterns', provider: 'Frontend Masters', category: 'Frontend Developer', duration: '5h', difficulty: 'Advanced', skills_covered: ['React', 'Hooks', 'Context'], url: '#' },
  { id: 'local-2', title: 'Node.js Microservices', provider: 'Udemy', category: 'Backend Developer', duration: '8h', difficulty: 'Intermediate', skills_covered: ['Node.js', 'Docker', 'Microservices'], url: '#' },
  { id: 'local-3', title: 'Python for Data Science', provider: 'Coursera', category: 'Data Scientist', duration: '20h', difficulty: 'Beginner', skills_covered: ['Python', 'Pandas', 'NumPy'], url: '#' },
  { id: 'local-4', title: 'UI/UX Design Bootcamp', provider: 'Google', category: 'UI/UX Designer', duration: '40h', difficulty: 'Intermediate', skills_covered: ['Figma', 'User Research', 'Prototyping'], url: '#' },
  { id: 'local-5', title: 'AWS Cloud Architect', provider: 'A Cloud Guru', category: 'Cloud Architect', duration: '30h', difficulty: 'Advanced', skills_covered: ['AWS', 'EC2', 'S3', 'Architecture'], url: '#' },
  { id: 'local-6', title: 'Full-Stack Web Development', provider: 'freeCodeCamp', category: 'Full-Stack Developer', duration: '300h', difficulty: 'Beginner', skills_covered: ['HTML', 'CSS', 'JavaScript', 'Node'], url: '#' },
  { id: 'local-7', title: 'Machine Learning A-Z', provider: 'Udemy', category: 'Machine Learning Engineer', duration: '44h', difficulty: 'Intermediate', skills_covered: ['Python', 'Scikit-Learn', 'TensorFlow'], url: '#' },
  { id: 'local-8', title: 'Cybersecurity Fundamentals', provider: 'IBM', category: 'Cybersecurity Analyst', duration: '15h', difficulty: 'Beginner', skills_covered: ['Security', 'Networking', 'Threats'], url: '#' },
  { id: 'local-9', title: 'DevOps Engineering on AWS', provider: 'AWS', category: 'DevOps Engineer', duration: '25h', difficulty: 'Intermediate', skills_covered: ['AWS', 'CI/CD', 'Jenkins'], url: '#' },
  { id: 'local-10', title: 'iOS App Development with Swift', provider: 'Apple', category: 'Mobile App Developer (iOS/Android)', duration: '35h', difficulty: 'Beginner', skills_covered: ['Swift', 'Xcode', 'iOS'], url: '#' },
  { id: 'local-11', title: 'Data Structures and Algorithms', provider: 'Coursera', category: 'Software Engineer / Developer', duration: '60h', difficulty: 'Intermediate', skills_covered: ['DSA', 'Java', 'C++'], url: '#' },
  { id: 'local-12', title: 'Complete SQL Bootcamp', provider: 'Udemy', category: 'Database Administrator', duration: '10h', difficulty: 'Beginner', skills_covered: ['SQL', 'PostgreSQL', 'Database Design'], url: '#' },
]

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
  const [selectedRole, setSelectedRole] = useState<string>('All Roles')
  const [sortBy, setSortBy] = useState<'difficulty' | 'duration'>('difficulty')

  useEffect(() => {
    if (!user) return
    fetchCourses()
  }, [user])

  async function fetchCourses() {
    const { data: allCourses } = await supabase.from('courses').select('*')
    const { data: myCourses } = await supabase.from('user_courses').select('*').eq('user_id', user!.id)
    const ucMap: Record<string, UserCourse> = {}
    myCourses?.forEach((uc: any) => { ucMap[uc.course_id] = uc })
    
    const combinedCourses = [...(allCourses || []), ...LOCAL_COURSES]
    setCourses(combinedCourses)
    setUserCourses(ucMap)
    setLoading(false)
  }

  const allRoles = ['All Roles', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))]
  
  const filteredCourses = courses
    .filter(c => selectedRole === 'All Roles' || c.category === selectedRole)
    .sort((a, b) => {
      if (sortBy === 'difficulty') {
        const order: Record<string, number> = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 }
        return (order[a.difficulty || 'Beginner'] || 1) - (order[b.difficulty || 'Beginner'] || 1)
      } else {
        return a.duration.localeCompare(b.duration)
      }
    })

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">Recommended Courses</h1>
          <p className="text-primary/60">Based on your skill gaps and target role</p>
        </div>
        <div className="flex gap-3">
          <select value={selectedRole} onChange={e => setSelectedRole(e.target.value)} className="input-field py-2 text-sm max-w-[200px]">
            {allRoles.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as 'difficulty' | 'duration')} className="input-field py-2 text-sm">
            <option value="difficulty">Sort by Difficulty</option>
            <option value="duration">Sort by Duration</option>
          </select>
        </div>
      </div>
      {accessedMsg && (
        <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl text-accent flex items-start gap-3">
          <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm">{accessedMsg}</p>
        </div>
      )}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCourses.map((course) => {
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
                <span className="flex items-center gap-1 truncate"><BarChart3 size={12} /> {course.category}</span>
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