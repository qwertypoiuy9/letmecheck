import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Sparkles, Target, BookOpen, Award, MessageSquare, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const features = [
  { icon: Target, text: 'Analyze your resume with AI precision' },
  { icon: BookOpen, text: 'Identify skill gaps for your dream role' },
  { icon: Sparkles, text: 'Get personalized course recommendations' },
  { icon: Award, text: 'Earn verified badges for your achievements' },
  { icon: MessageSquare, text: 'Prepare for interviews with AI mock sessions' },
]

export default function Home() {
  useAuth()
  const navigate = useNavigate()
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
          LetMeCheck — Your Career Guidance Platform
        </h1>
        <div className="h-8 flex items-center justify-center">
          <p className="text-lg text-primary/70 flex items-center gap-2">
            {(() => {
              const Icon = features[currentFeature].icon
              return <Icon className="w-5 h-5 text-accent" />
            })()}
            {features[currentFeature].text}
          </p>
        </div>
        <button onClick={() => navigate('/resume-analyzer')}
          className="btn-primary mt-6 inline-flex items-center gap-2">
          Analyze Your Resume <ArrowRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-2xl font-bold text-primary">30+</h3>
          <p className="text-sm text-primary/60">Job Roles Covered</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-primary">50+</h3>
          <p className="text-sm text-primary/60">Curated Courses</p>
        </div>
        <div className="card text-center">
          <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-2xl font-bold text-primary">100%</h3>
          <p className="text-sm text-primary/60">Verified Badges</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">What is LetMeCheck?</h2>
          <p className="text-primary/80 leading-relaxed mb-4">
            LetMeCheck is your personal AI-powered career coach. Our mission is to bridge the gap between your current skills and your dream job. By analyzing your resume against industry standards for specific roles, we provide actionable feedback and customized learning paths.
          </p>
          <p className="text-primary/80 leading-relaxed">
            Whether you are a student preparing for your first internship or a professional looking to pivot, LetMeCheck equips you with the tools you need: resume parsing, strict skill gap analysis, personalized course recommendations, and mock AI interviews.
          </p>
        </div>
        <div className="card bg-primary text-white">
          <h3 className="font-semibold text-lg mb-4">How It Works</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">1</div>
              <div>
                <h4 className="font-medium">Upload Your Resume</h4>
                <p className="text-sm text-white/80 mt-1">Our AI strictly analyzes your resume against your target role.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">2</div>
              <div>
                <h4 className="font-medium">Identify Skill Gaps</h4>
                <p className="text-sm text-white/80 mt-1">See exactly which technical and soft skills you are missing.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">3</div>
              <div>
                <h4 className="font-medium">Upskill & Practice</h4>
                <p className="text-sm text-white/80 mt-1">Take curated courses, earn badges, and practice with our AI Interviewer.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}