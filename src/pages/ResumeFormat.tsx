import { FileText, Check, X, Download } from 'lucide-react'

const dos = [
  'Use a clean, professional font (Inter, Arial, Calibri)',
  'Keep your resume to 1 page (students) or max 2 pages',
  'Include quantifiable achievements (%, numbers, metrics)',
  'Tailor your resume for each job application',
  'Use bullet points for readability',
  'Include relevant keywords from the job description',
  'Proofread multiple times for grammar and spelling',
  'Save and send as PDF to preserve formatting',
]

const donts = [
  'Use unprofessional email addresses',
  'Include personal details like age, marital status, or photo (unless required)',
  'Use generic objective statements',
  'List every job you have ever had — focus on relevance',
  'Use tables, headers/footers, or complex formatting (ATS unfriendly)',
  'Lie or exaggerate your skills or experience',
  'Use pronouns like "I", "me", "my"',
  'Make it cluttered with too many colors or graphics',
]

const sections = [
  { title: 'Contact Information', desc: 'Name, phone, email, LinkedIn, GitHub/Portfolio. Make sure email is professional.' },
  { title: 'Professional Summary', desc: '2-3 sentences highlighting your expertise, key skills, and career goals. Tailor to the role.' },
  { title: 'Technical Skills', desc: 'Categorized list: Languages, Frameworks, Tools, Core Competencies. Match job requirements.' },
  { title: 'Projects', desc: '3-4 strong projects with tech stack, your contributions, and quantified impact. Use STAR method.' },
  { title: 'Experience', desc: 'Internships, part-time jobs, leadership roles. Focus on achievements, not just responsibilities.' },
  { title: 'Education', desc: 'Degree, institution, expected graduation, relevant coursework, GPA (if > 3.5).' },
  { title: 'Achievements', desc: 'Hackathons, certifications, awards, publications. Anything that sets you apart.' },
]

export default function ResumeFormat() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2">Resume Format Guide</h1>
        <p className="text-primary/60">Learn how to craft a professional, ATS-friendly resume</p>
      </div>
      <div className="grid gap-4">
        {sections.map((section, idx) => (
          <div key={idx} className="card flex gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-primary">{section.title}</h3>
              <p className="text-sm text-primary/70 mt-1">{section.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card border-l-4 border-accent">
          <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
            <Check className="w-5 h-5 text-accent" /> Do's
          </h3>
          <ul className="space-y-2">
            {dos.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-primary/80">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />{item}
              </li>
            ))}
          </ul>
        </div>
        <div className="card border-l-4 border-red-500">
          <h3 className="font-semibold text-primary mb-4 flex items-center gap-2">
            <X className="w-5 h-5 text-red-500" /> Don'ts
          </h3>
          <ul className="space-y-2">
            {donts.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-primary/80">
                <X className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />{item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="card bg-primary text-white">
        <h3 className="font-semibold text-lg mb-3">ATS Compatibility Tips</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-white/90">
          <ul className="space-y-2">
            <li>• Use standard section headings: "Experience", "Education", "Skills"</li>
            <li>• Avoid headers, footers, and text boxes</li>
            <li>• Use standard bullet points</li>
          </ul>
          <ul className="space-y-2">
            <li>• Include keywords from the job description naturally</li>
            <li>• Use simple formatting — no tables or columns</li>
            <li>• Submit as PDF or DOCX based on employer preference</li>
          </ul>
        </div>
      </div>
      <div className="card text-center">
        <Download className="w-8 h-8 text-primary mx-auto mb-3" />
        <h3 className="font-semibold text-primary">Download Resume Template</h3>
        <p className="text-sm text-primary/60 mt-1 mb-4">Get a clean, ATS-friendly template to get started</p>
        <button className="btn-primary inline-flex items-center gap-2">
          <Download size={16} /> Download Template
        </button>
      </div>
    </div>
  )
}