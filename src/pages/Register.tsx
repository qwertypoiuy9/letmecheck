import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ScanSearch, Eye, EyeOff } from 'lucide-react'

const JOB_ROLES = [
  'Software Engineer / Developer','Full-Stack Developer','Frontend Developer',
  'Backend Developer','Mobile App Developer (iOS/Android)','DevOps Engineer',
  'Cloud Architect','Data Scientist','Data Analyst','Machine Learning Engineer',
  'AI Engineer','Cybersecurity Analyst','Network Engineer','Database Administrator',
  'UI/UX Designer','Product Manager','Project Manager','Business Analyst',
  'Quality Assurance Engineer','Site Reliability Engineer (SRE)','Blockchain Developer',
  'Game Developer','Embedded Systems Engineer','IoT Developer','Technical Writer',
  'Systems Analyst','IT Support Specialist','Data Engineer','NLP Engineer',
  'Computer Vision Engineer',
]

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '',
    graduationLevel: 'Undergraduate', yearOfStudy: '1st Year', targetJobRole: JOB_ROLES[0],
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        graduation_level: formData.graduationLevel,
        year_of_study: formData.yearOfStudy,
        target_job_role: formData.targetJobRole,
      })
      // Auto-login succeeded — go straight to app
      navigate('/')
    } catch (err: any) {
      const msg: string = err.message || 'Registration failed'
      if (msg.startsWith('Account created!')) {
        // Signup worked but email confirmation is still required
        setSuccess(true)
      } else if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('over_email_send_rate_limit')) {
        setError('Too many signups attempted. Please wait a few minutes and try again, or use a different email address.')
      } else if (msg.toLowerCase().includes('already registered') || msg.toLowerCase().includes('user already registered')) {
        setError('This email is already registered. Please sign in instead.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <ScanSearch className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">LetMeCheck</h1>
          </div>
          <div className="card text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-primary mb-2">Account Created!</h2>
            <p className="text-primary/60 text-sm mb-2">
              A confirmation email has been sent to <strong>{formData.email}</strong>.
            </p>
            <p className="text-primary/60 text-sm mb-6">
              If email confirmation is disabled in Supabase, you can log in directly now.
            </p>
            <button onClick={() => navigate('/login')} className="btn-primary w-full">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <ScanSearch className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary">LetMeCheck</h1>
          <p className="text-primary/60 mt-1">Create your account</p>
        </div>
        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Full Name</label>
              <input name="fullName" type="text" value={formData.fullName} onChange={handleChange}
                className="input-field" placeholder="John Doe" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Graduation Level</label>
                <select name="graduationLevel" value={formData.graduationLevel} onChange={handleChange} className="input-field">
                  <option>Undergraduate</option><option>Graduate</option><option>Postgraduate</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Year</label>
                <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} className="input-field">
                  <option>1st Year</option><option>2nd Year</option><option>3rd Year</option>
                  <option>4th Year</option><option>Final Year</option><option>Completed</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Target Job Role</label>
              <select name="targetJobRole" value={formData.targetJobRole} onChange={handleChange} className="input-field">
                {JOB_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange}
                className="input-field" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary mb-1">Password</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'}
                  value={formData.password} onChange={handleChange}
                  className="input-field pr-10" placeholder="Min 8 characters" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary/40">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-primary/60 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}