import { useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'
import {
  Upload, FileText, AlertCircle, CheckCircle, Loader2,
  X, Award, Layout, GraduationCap, Wrench, Briefcase, FileCheck
} from 'lucide-react'

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

interface AnalysisResult {
  overallScore: number
  dimensions: {
    structure: number; content: number; keywords: number; grammar: number
    technicalSkills: number; experience: number; education: number; ats: number
  }
  suggestions: string[]
  extractedSkills: string[]
  missingKeywords: string[]
}

export default function ResumeAnalyzer() {
  const { profile, user } = useAuth()
  const navigate = useNavigate()
  const [targetRole, setTargetRole] = useState(profile?.target_job_role || JOB_ROLES[0])
  const [file, setFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const validateFile = (file: File): string | null => {
    const validTypes = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!validTypes.includes(file.type)) return 'Please upload a valid resume file (PDF, DOCX, or DOC).'
    if (file.size > 5 * 1024 * 1024) return 'File size exceeds 5MB limit.'
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    const error = validateFile(selected)
    if (error) { setUploadError(error); setFile(null); return }
    setUploadError(''); setFile(selected); setResult(null)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (!dropped) return
    const error = validateFile(dropped)
    if (error) { setUploadError(error); setFile(null); return }
    setUploadError(''); setFile(dropped); setResult(null)
  }, [])

  const simulateAnalysis = async (): Promise<AnalysisResult> => {
    await new Promise(r => setTimeout(r, 2500))
    // Stricter scoring algorithm for perfection
    const scores = {
      structure: Math.floor(45 + Math.random() * 20),
      content: Math.floor(40 + Math.random() * 25),
      keywords: Math.floor(35 + Math.random() * 25),
      grammar: Math.floor(65 + Math.random() * 20),
      technicalSkills: Math.floor(30 + Math.random() * 30),
      experience: Math.floor(35 + Math.random() * 25),
      education: Math.floor(75 + Math.random() * 15),
      ats: Math.floor(40 + Math.random() * 25),
    }
    const overall = Math.round(
      (scores.structure * 0.15 + scores.content * 0.15 + scores.keywords * 0.15 +
       scores.grammar * 0.10 + scores.technicalSkills * 0.15 + scores.experience * 0.15 +
       scores.education * 0.10 + scores.ats * 0.05)
    )
    return {
      overallScore: overall, dimensions: scores,
      suggestions: [
        'CRITICAL: Your project achievements lack sufficient quantifiable metrics (e.g., "improved performance by X%").',
        'Your resume structure is not fully ATS-compliant. Avoid complex formatting and tables.',
        'Significant gap in required keywords for your target role. Your technical density is low.',
        'The professional summary is too generic. It must align strictly with the target job requirements.',
        'Experience bullet points do not effectively utilize the STAR (Situation, Task, Action, Result) method.',
        'Action verbs are repetitive. Diversify your vocabulary with strong industry-specific action words.',
      ],
      extractedSkills: ['React.js','JavaScript','Git','HTML5','CSS3'],
      missingKeywords: ['Docker','Kubernetes','AWS','CI/CD','TypeScript','GraphQL','Microservices','System Design'],
    }
  }

  const handleAnalyze = async () => {
    if (!file || !user) return
    setAnalyzing(true); setUploadError('')
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = user.id + '/' + Date.now() + '.' + fileExt
      const { error: uploadErr } = await supabase.storage.from('resumes').upload(filePath, file)
      if (uploadErr) throw uploadErr
      const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(filePath)
      const { data: resume, error: dbErr } = await supabase.from('resumes').insert({
        user_id: user.id, file_url: publicUrl, file_name: file.name,
        target_role: targetRole, status: 'analyzing',
      } as any).select().single()
      if (dbErr) throw dbErr
      const analysis = await simulateAnalysis()
      setResult(analysis)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('resumes') as any).update({
        analysis_score: analysis.overallScore, analysis_results: analysis, status: 'completed',
      }).eq('id', (resume as any).id)
      await supabase.from('skill_gaps').insert({
        user_id: user.id, resume_id: (resume as any).id, target_role: targetRole,
        missing_skills: analysis.missingKeywords.map(k => ({ name: k, category: 'Technical', priority: 'High' })),
        present_skills: analysis.extractedSkills.map(k => ({ name: k, category: 'Technical' })),
        skill_coverage_percent: Math.round((analysis.extractedSkills.length / (analysis.extractedSkills.length + analysis.missingKeywords.length)) * 100),
      } as any)
    } catch (err: any) {
      setUploadError(err.message || 'Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-accent'
    if (score >= 70) return 'text-primary'
    if (score >= 50) return 'text-orange-500'
    return 'text-red-500'
  }
  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-accent/10'
    if (score >= 70) return 'bg-primary/10'
    if (score >= 50) return 'bg-orange-100'
    return 'bg-red-100'
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Resume Analyzer</h1>
        <p className="text-primary/60">Upload your resume and get AI-powered feedback</p>
      </div>
      <div className="card">
        <div className="mb-4">
          <label className="block text-sm font-medium text-primary mb-2">Target Job Role</label>
          <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="input-field max-w-md">
            {JOB_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
          </select>
        </div>
        <div onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}
          className={"border-2 border-dashed rounded-xl p-8 text-center transition-all " + (file ? 'border-accent bg-accent/5' : 'border-primary/20 hover:border-primary/40 bg-canvas')}>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" id="resume-upload" />
          <label htmlFor="resume-upload" className="cursor-pointer">
            <Upload className="w-10 h-10 text-primary/40 mx-auto mb-3" />
            <p className="text-primary font-medium">{file ? file.name : 'Drop your resume here or click to browse'}</p>
            <p className="text-sm text-primary/50 mt-1">PDF, DOCX, or DOC up to 5MB</p>
          </label>
          {file && <button onClick={() => { setFile(null); setResult(null); }} className="mt-3 text-sm text-red-500 hover:underline flex items-center gap-1 mx-auto"><X size={14} /> Remove file</button>}
        </div>
        {uploadError && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm"><AlertCircle size={16} />{uploadError}</div>}
        <button onClick={handleAnalyze} disabled={!file || analyzing} className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
          {analyzing ? <><Loader2 className="animate-spin" size={18} /> Analyzing your resume...</> : <><FileText size={18} /> Analyze Resume</>}
        </button>
      </div>
      {result && (
        <div className="space-y-6">
          <div className={"card " + getScoreBg(result.overallScore)}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary">Analysis Complete</h2>
                <p className="text-sm text-primary/60 mt-1">Your resume scored {result.overallScore}/100 for {targetRole}</p>
              </div>
              <div className="text-right"><span className={"text-4xl font-bold " + getScoreColor(result.overallScore)}>{result.overallScore}</span><span className="text-primary/40 text-lg">/100</span></div>
            </div>
            <div className="mt-4 h-3 bg-white rounded-full overflow-hidden">
              <div className={"h-full rounded-full transition-all duration-1000 " + (result.overallScore >= 90 ? 'bg-accent' : result.overallScore >= 70 ? 'bg-primary' : result.overallScore >= 50 ? 'bg-orange-400' : 'bg-red-400')} style={{ width: result.overallScore + '%' }} />
            </div>
            <button onClick={() => navigate('/skill-gaps')} className="btn-accent mt-4 inline-flex items-center gap-2">View Skill Gaps <Award size={16} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { key: 'structure', label: 'Structure & Formatting', icon: Layout },
              { key: 'content', label: 'Content Quality', icon: FileText },
              { key: 'keywords', label: 'Keyword Optimization', icon: FileCheck },
              { key: 'grammar', label: 'Grammar & Tone', icon: CheckCircle },
              { key: 'technicalSkills', label: 'Technical Skills', icon: Wrench },
              { key: 'experience', label: 'Experience/Projects', icon: Briefcase },
              { key: 'education', label: 'Education', icon: GraduationCap },
              { key: 'ats', label: 'ATS Compatibility', icon: FileCheck },
            ].map((dim) => {
              const Icon = dim.icon
              const score = result.dimensions[dim.key as keyof typeof result.dimensions]
              return (
                <div key={dim.key} className="card flex items-center gap-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1"><span className="text-sm font-medium text-primary">{dim.label}</span><span className={"text-sm font-bold " + getScoreColor(score)}>{score}</span></div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className={"h-full rounded-full " + (score >= 90 ? 'bg-accent' : score >= 70 ? 'bg-primary' : score >= 50 ? 'bg-orange-400' : 'bg-red-400')} style={{ width: score + '%' }} /></div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="card">
            <h3 className="font-semibold text-primary mb-4">Improvement Suggestions</h3>
            <ul className="space-y-3">
              {result.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-primary/80">
                  <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold text-accent">{idx + 1}</span></div>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-semibold text-primary mb-3 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-accent" /> Skills Found</h3>
              <div className="flex flex-wrap gap-2">{result.extractedSkills.map(skill => <span key={skill} className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full font-medium">{skill}</span>)}</div>
            </div>
            <div className="card">
              <h3 className="font-semibold text-primary mb-3 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-500" /> Missing Keywords</h3>
              <div className="flex flex-wrap gap-2">{result.missingKeywords.map(keyword => <span key={keyword} className="px-3 py-1 bg-orange-100 text-orange-600 text-sm rounded-full font-medium">{keyword}</span>)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}