import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Mic2, Send, User, Bot, Loader2, Sparkles } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SAMPLE_QUESTIONS = [
  'Tell me about yourself and your background in software development.',
  'Describe a challenging project you worked on and how you overcame obstacles.',
  'How do you stay updated with the latest technologies in your field?',
  'Explain the difference between REST and GraphQL APIs.',
  'What is your approach to debugging a complex issue in production?',
]

export default function Interview() {
  const { profile } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your AI Interview Coach. I will ask you questions tailored for the ' + (profile?.target_job_role || 'your target') + ' role. Let us begin! First question: ' + SAMPLE_QUESTIONS[0] }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)

  const handleSend = async () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    const nextIdx = questionIndex + 1
    let response = ''
    if (nextIdx < SAMPLE_QUESTIONS.length) {
      response = 'Good answer! Here is some feedback: Try to be more specific with examples and quantify your impact when possible. Next question: ' + SAMPLE_QUESTIONS[nextIdx]
      setQuestionIndex(nextIdx)
    } else {
      response = 'Great job completing the mock interview! Your responses show solid technical knowledge. Areas to improve: provide more quantifiable results and structure answers using the STAR method (Situation, Task, Action, Result).'
    }
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
    setLoading(false)
  }

  return (
    <div className="space-y-6 h-[calc(100vh-120px)] flex flex-col">
      <div>
        <h1 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
          <Mic2 size={24} /> AI Mock Interview
        </h1>
        <p className="text-primary/60">Practice interview questions for {profile?.target_job_role || 'your target role'}</p>
      </div>
      <div className="card flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto space-y-4 p-2">
          {messages.map((msg, idx) => (
            <div key={idx} className={"flex gap-3 " + (msg.role === 'user' ? 'flex-row-reverse' : '')}>
              <div className={"w-8 h-8 rounded-full flex items-center justify-center shrink-0 " + (msg.role === 'user' ? 'bg-primary' : 'bg-accent')}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={"max-w-[80%] p-3 rounded-xl text-sm " + (msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-secondary text-primary rounded-tl-none')}>
                {msg.content.split('\n').map((line, i) => <p key={i} className={i > 0 ? 'mt-1' : ''}>{line}</p>)}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shrink-0"><Bot size={16} className="text-white" /></div>
              <div className="bg-secondary p-3 rounded-xl rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-sm text-primary/60">Analyzing your response...</span>
              </div>
            </div>
          )}
        </div>
        <div className="border-t border-secondary pt-4 mt-4">
          <div className="flex gap-2 items-end">
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)" 
              className="input-field flex-1 resize-y min-h-[80px] max-h-[200px]" />
            <button onClick={handleSend} disabled={loading || !input.trim()} className="btn-primary px-4 mb-1 h-[80px]">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <h3 className="font-semibold text-primary mb-2 flex items-center gap-2"><Sparkles size={16} className="text-accent" /> Interview Tips</h3>
        <ul className="text-sm text-primary/70 space-y-1">
          <li>• Use the STAR method: Situation, Task, Action, Result</li>
          <li>• Be specific with examples and quantify your impact</li>
          <li>• Research the company and role before the interview</li>
          <li>• Prepare questions to ask the interviewer</li>
        </ul>
      </div>
    </div>
  )
}