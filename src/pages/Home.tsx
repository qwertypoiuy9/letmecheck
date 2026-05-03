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
  const { profile } = useAuth()
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

      <div>
        <h2 className="text-xl font-bold text-primary mb-4">Example of an Ideal Resume</h2>
        <div className="card border-2 border-primary/10">
          <div className="text-center border-b border-gray-200 pb-4 mb-4">
            <h3 className="text-2xl font-bold text-primary m-0">RAKESH PULIDINDI</h3>
            <p className="text-sm text-primary/70 mt-1">
              Hyderabad, Telangana | +91 XXXXX XXXXX | LinkedIn | GitHub/Portfolio | email@example.com
            </p>
          </div>
          <div className="mb-4">
            <h4 className="text-primary font-bold text-sm uppercase tracking-wide border-b border-primary/20 pb-1 mb-2">Professional Summary</h4>
            <p className="text-sm text-primary/80 leading-relaxed">
              Aspiring Software Engineer and Engineering Student with a robust foundation in Full-Stack Development, 
              Data Structures, and UI/UX Design. Proven track record of leading technical teams (Team Alpha Trio) 
              to deliver high-impact solutions, including a QR-based assessment system and an AI-driven resume analyzer. 
              Expert in optimizing code efficiency and building user-centric digital products.
            </p>
          </div>
          <div className="mb-4">
            <h4 className="text-primary font-bold text-sm uppercase tracking-wide border-b border-primary/20 pb-1 mb-2">Technical Skills</h4>
            <div className="text-sm text-primary/80 space-y-1">
              <p><span className="font-medium">Languages:</span> Java, Python, C, SQL (MySQL), JavaScript, HTML5, CSS3</p>
              <p><span className="font-medium">Frameworks & Libraries:</span> React.js, Node.js, Express, Firebase</p>
              <p><span className="font-medium">Tools & Platforms:</span> Git/GitHub, Figma (Design Systems), Docker, Postman</p>
              <p><span className="font-medium">Core Competencies:</span> Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP), Database Management (DBMS), Agile Methodology</p>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-primary font-bold text-sm uppercase tracking-wide border-b border-primary/20 pb-1 mb-2">Technical Projects</h4>
            <div className="space-y-3 text-sm text-primary/80">
              <div>
                <p className="font-medium text-primary">LetMeCheck | Full-Stack Web Application</p>
                <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
                  <li>Engineered an intelligence system for job seekers to analyze resumes and conduct mock interviews using React.js and Firebase.</li>
                  <li>Developed an automated feedback loop that improved mock interview response quality by 30% based on user testing.</li>
                  <li>Designed a high-fidelity design system in Figma, ensuring a 95% user satisfaction rate during the prototype phase.</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-primary">RealCheck | Digital Trust & Verification Utility</p>
                <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
                  <li>Architected a digital trust platform to verify business integrity using a hybrid of sensor data and human audits.</li>
                  <li>Led Team Alpha Trio through the full Software Development Life Cycle (SDLC), from initial abstract to technical roadmap.</li>
                  <li>Implemented a secure data-handling protocol to ensure 100% integrity of verified user reviews.</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-primary">Student Record Management System | C & Data Management</p>
                <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
                  <li>Developed a persistent storage system using C file handling to manage academic records for 500+ students.</li>
                  <li>Optimized search algorithms within the system, reducing data retrieval time by 25% compared to standard linear search methods.</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-primary">LocalLens | Hybrid QR Assessment System</p>
                <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
                  <li>Designed a QR-based assessment tool to bridge the digital divide in rural classrooms, successfully facilitating offline-to-online data sync.</li>
                  <li>Recognized for "Technical Innovation" at EduThon 2025 for solving low-connectivity educational challenges.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-primary font-bold text-sm uppercase tracking-wide border-b border-primary/20 pb-1 mb-2">Experience & Leadership</h4>
            <div className="space-y-2 text-sm text-primary/80">
              <div>
                <p className="font-medium text-primary">Team Lead | Team Alpha Trio | 2025 – Present</p>
                <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
                  <li>Managing a 3-person development team for national hackathons, ensuring on-time delivery of technical project milestones.</li>
                  <li>Streamlined the team's version control workflow using Git, reducing merge conflicts by 40%.</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-primary">Participant | PromptCraft AI Challenge | Feb 2026</p>
                <ul className="list-disc list-inside text-xs mt-1 space-y-0.5">
                  <li>Developed the "AI Mind Mirror," utilizing advanced prompt engineering to enhance human-AI collaborative workflows.</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-primary font-bold text-sm uppercase tracking-wide border-b border-primary/20 pb-1 mb-2">Education</h4>
            <div className="text-sm text-primary/80 space-y-1">
              <p><span className="font-medium">B.Tech in Computer Science & Engineering | Expected 2025</span><br/>Sphoorthy Engineering College (JNTU), Hyderabad</p>
              <p className="text-xs">Relevant Coursework: Design & Analysis of Algorithms, Operating Systems, Web Technologies.</p>
              <p><span className="font-medium">Intermediate Studies (MPC)</span><br/>RGUKT, IIIT-Basara</p>
            </div>
          </div>
          <div>
            <h4 className="text-primary font-bold text-sm uppercase tracking-wide border-b border-primary/20 pb-1 mb-2">Honors & Achievements</h4>
            <ul className="list-disc list-inside text-sm text-primary/80 space-y-1">
              <li>National Finalist: EduThon 2025 (Organized by UBA MNIT Jaipur).</li>
              <li>Technical Proficiency: Ranked in the top tier of the college for DSA implementation (Stacks, Queues, Linked Lists).</li>
              <li>Certifications: Python for Data Science, Google UX Design.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}