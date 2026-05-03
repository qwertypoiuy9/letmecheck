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

      <div className="mt-12">
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