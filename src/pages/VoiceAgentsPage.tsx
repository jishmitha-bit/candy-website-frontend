import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Paperclip, Brain, Zap, Mic, SendHorizonal, Settings, Maximize2,
  FileText, Radio, ArrowRight, Edit3,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { aiReplies } from '../data/mockData'
import type { ChatMessage } from '../types'

const screeningScript = [
  'Introduction + confirm interest',
  'Years of voice/AI experience',
  'TypeScript & React proficiency',
  'System design scenario',
  'Salary & notice period',
  'Q&A and next steps',
]

let msgIdCounter = 100

export default function VoiceAgentsPage() {
  const navigate = useNavigate()
  const addToast = useAppStore((s) => s.addToast)
  const chatMessages = useAppStore((s) => s.chatMessages)
  const addChatMessage = useAppStore((s) => s.addChatMessage)
  const removeTyping = useAppStore((s) => s.removeTyping)

  const [inputVal, setInputVal] = useState('')
  const [progress, setProgress] = useState(57)
  const chatBodyRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const completed = Math.floor((progress / 100) * 248 * 0.66)
  const inProgress = Math.floor((progress / 100) * 248 * 0.08)
  const declined = Math.floor((progress / 100) * 248 * 0.10)
  const callsInitiated = Math.floor((progress / 100) * 248)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.random() * 1.8 : p))
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (chatBodyRef.current) chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight
  }, [chatMessages])

  const sendMessage = () => {
    const text = inputVal.trim()
    if (!text) return
    const now = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    addChatMessage({ id: `msg-${++msgIdCounter}`, role: 'user', text, time: now })
    setInputVal('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    addChatMessage({ id: `typing-${++msgIdCounter}`, role: 'typing', text: '', time: now })
    setTimeout(() => {
      removeTyping()
      addChatMessage({ id: `msg-${++msgIdCounter}`, role: 'ai', text: aiReplies[Math.floor(Math.random() * aiReplies.length)], time: now })
    }, 1400)
  }

  const autoGrow = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 120) + 'px'
  }

  return (
    <div className="animate-fadeUp">
      <div className="mb-5">
        <p className="text-[11px] text-purple-hi uppercase tracking-[0.2em] mb-2">Voice Agents · AI Agent Chat</p>
        <h1 className="text-[28px] font-bold tracking-[-0.025em]">AI Recruiting Assistant</h1>
      </div>

      <div className="grid gap-5 min-h-[calc(100vh-180px)]" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {/* Chat panel */}
        <div className="rounded-lg border border-border flex flex-col overflow-hidden" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
          <div className="flex items-center gap-3 px-[22px] py-[18px] border-b border-border" style={{ background: 'linear-gradient(180deg, rgba(124,58,237,0.08), transparent)' }}>
            <div className="relative w-10 h-10 rounded-[12px] grid place-items-center shadow-glow-purple shrink-0" style={{ background: 'linear-gradient(135deg, #7C3AED, #22D3EE)' }}>
              <Brain className="w-[18px] h-[18px] text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-neon-green border-2 border-bg-1" />
            </div>
            <div className="flex-1">
              <h4 className="text-[14.5px] font-semibold">Atlas · Voice Agent Assistant</h4>
              <p className="text-[11.5px] text-text-3 mt-0.5">Powered by Metaspace AI · Online</p>
            </div>
            <div className="flex gap-1.5">
              {[Settings, Maximize2].map((Icon, i) => (
                <button key={i} className="w-[30px] h-[30px] rounded-[8px] grid place-items-center border border-border text-text-2 hover:text-text-1 hover:border-border-strong hover:bg-white/[0.04] transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          <div ref={chatBodyRef} className="flex-1 overflow-y-auto p-[22px] flex flex-col gap-5">
            {chatMessages.map((m) => {
              if (m.role === 'typing') {
                return (
                  <div key={m.id} className="flex gap-3 max-w-[88%]">
                    <div className="w-7 h-7 rounded-[8px] shrink-0 grid place-items-center text-[11px] font-bold text-white" style={{ background: 'linear-gradient(135deg, #7C3AED, #22D3EE)' }}>AI</div>
                    <div className="flex items-center gap-1.5 px-4 py-3.5 rounded-[14px] rounded-tl-[4px] border border-border" style={{ background: 'rgba(124,58,237,0.04)' }}>
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-text-3" style={{ animation: `typing 1.4s ${i * 0.2}s infinite ease-in-out` }} />
                      ))}
                    </div>
                  </div>
                )
              }
              const isAI = m.role === 'ai'
              return (
                <div key={m.id} className={`flex gap-3 max-w-[88%] ${isAI ? '' : 'ml-auto flex-row-reverse'}`}>
                  <div className="w-7 h-7 rounded-[8px] shrink-0 grid place-items-center text-[11px] font-bold text-white" style={{ background: isAI ? 'linear-gradient(135deg, #7C3AED, #22D3EE)' : 'linear-gradient(135deg, #C084FC, #7C3AED)' }}>
                    {isAI ? 'AI' : 'HS'}
                  </div>
                  <div>
                    <div
                      className={`px-4 py-3 rounded-[14px] text-[14px] leading-relaxed border ${isAI ? 'rounded-tl-[4px] border-border' : 'rounded-tr-[4px] border-border-accent'}`}
                      style={isAI ? { background: 'rgba(124,58,237,0.05)' } : { background: 'linear-gradient(135deg, rgba(124,58,237,0.16), rgba(34,211,238,0.08))' }}
                    >
                      {m.text}
                      {m.file && (
                        <div className="flex items-center gap-3 mt-2.5 px-3.5 py-2.5 rounded-[10px] border border-border-strong" style={{ background: 'rgba(0,0,0,0.3)' }}>
                          <div className="w-9 h-9 rounded-[8px] grid place-items-center" style={{ background: 'rgba(167,139,250,0.12)', color: '#A78BFA' }}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <div className="text-[13px] font-medium">{m.file.name}</div>
                            <div className="text-[11px] text-text-3 mt-0.5">{m.file.size}</div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={`text-[10.5px] text-text-4 mt-1.5 ${isAI ? '' : 'text-right'}`}>{m.time}</div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-4 pb-5 border-t border-border" style={{ background: 'rgba(0,0,0,0.15)' }}>
            <div className="flex gap-1.5 mb-2.5">
              {[{ icon: Paperclip, label: 'Attach' }, { icon: Brain, label: 'Templates' }, { icon: Zap, label: 'Slash commands' }].map((b) => {
                const Icon = b.icon
                return (
                  <button key={b.label} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[7px] border border-border text-text-2 text-[11.5px] hover:bg-white/[0.06] hover:text-text-1 transition-all" style={{ background: 'rgba(124,58,237,0.04)' }}>
                    <Icon className="w-3 h-3" />{b.label}
                  </button>
                )
              })}
            </div>
            <div className="flex items-end gap-2.5 rounded-[14px] border border-border-strong px-3.5 py-3 transition-all focus-within:border-purple focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.12)]" style={{ background: 'rgba(0,0,0,0.35)' }}>
              <textarea
                ref={textareaRef}
                value={inputVal}
                onChange={(e) => { setInputVal(e.target.value); autoGrow() }}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                placeholder="Ask or assign a task…"
                rows={1}
                className="flex-1 bg-transparent border-none outline-none text-text-1 text-[14px] resize-none max-h-[120px] leading-[1.4] placeholder:text-text-3"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <button className="w-8 h-8 rounded-[8px] grid place-items-center text-text-3 hover:text-text-1 transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
                <button onClick={sendMessage} className="w-9 h-9 rounded-[10px] grid place-items-center shadow-[0_6px_16px_-4px_rgba(124,58,237,0.5)] hover:scale-105 transition-transform" style={{ background: 'linear-gradient(135deg, #7C3AED, #22D3EE)' }}>
                  <SendHorizonal className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Workflow panel */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border p-[22px]" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
            <div className="flex justify-between items-center mb-3.5">
              <h4 className="text-[14.5px] font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-purple-hi" /> Uploaded file</h4>
              <span className="text-[10.5px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider" style={{ background: 'rgba(167,139,250,0.12)', color: '#A78BFA' }}>Parsed</span>
            </div>
            <div className="rounded-[14px] border border-dashed border-border-strong p-3.5" style={{ background: 'rgba(0,0,0,0.2)' }}>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-[8px] grid place-items-center" style={{ background: 'rgba(167,139,250,0.12)', color: '#A78BFA' }}><FileText className="w-4 h-4" /></div>
                <div>
                  <div className="text-[13px] font-semibold">senior_frontend_candidates.xlsx</div>
                  <div className="text-[11px] text-text-3">248 rows · 6 columns · 142 KB</div>
                </div>
              </div>
              <table className="w-full text-[11.5px] border-collapse">
                <thead><tr>{['Name', 'Role', 'Phone'].map((h) => <th key={h} className="text-left px-2 py-1.5 bg-white/[0.03] text-text-3 font-medium border-b border-border">{h}</th>)}</tr></thead>
                <tbody>
                  {[['Aarav Sharma', 'Senior Frontend', '+91 98210 …'], ['Priya Iyer', 'Full-stack Dev', '+91 99845 …'], ['Rohan Menon', 'Senior Frontend', '+91 90452 …']].map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => <td key={j} className="px-2 py-1.5 border-b border-border text-text-2">{cell}</td>)}</tr>
                  ))}
                  <tr><td colSpan={3} className="px-2 py-1.5 text-text-4">+ 245 more rows</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-lg border border-border p-[22px]" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
            <div className="flex justify-between items-center mb-3.5">
              <h4 className="text-[14.5px] font-semibold flex items-center gap-2"><Radio className="w-4 h-4 text-purple-hi" /> Live campaign</h4>
              <span className="flex items-center gap-1.5 text-[10.5px] px-2 py-1 rounded-full font-semibold uppercase tracking-wider" style={{ background: 'rgba(34,211,238,0.12)', color: '#22D3EE' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse-slow" />Running
              </span>
            </div>
            <div className="flex justify-between text-[12.5px] mb-2">
              <span className="text-text-3">Calls initiated</span>
              <span className="font-semibold">{callsInitiated} / 248</span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden relative" style={{ background: 'rgba(124,58,237,0.1)' }}>
              <div className="progress-shimmer h-full rounded-full relative transition-all duration-1000" style={{ width: `${progress}%`, background: 'linear-gradient(135deg, #7C3AED, #22D3EE)' }} />
            </div>
            <div className="grid grid-cols-3 gap-2.5 mt-3.5">
              {[{ val: completed, label: 'Completed', color: '#A78BFA' }, { val: inProgress, label: 'In Progress', color: '#7C3AED' }, { val: declined, label: 'Declined', color: '#FF4560' }].map((c) => (
                <div key={c.label} className="text-center rounded-[10px] border border-border py-3" style={{ background: 'rgba(0,0,0,0.2)' }}>
                  <div className="text-[20px] font-bold tracking-[-0.02em]" style={{ color: c.color }}>{c.val}</div>
                  <div className="text-[10.5px] text-text-3 mt-1 uppercase tracking-[0.08em]">{c.label}</div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/app/live')} className="w-full mt-4 py-3 rounded-[10px] border border-border-accent text-text-1 text-[13px] font-semibold flex items-center justify-center gap-2 transition-all hover:border-purple" style={{ background: 'rgba(124,58,237,0.1)' }}>
              Open live dashboard <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="rounded-lg border border-border p-[22px]" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
            <div className="flex justify-between items-center mb-3.5">
              <h4 className="text-[14.5px] font-semibold flex items-center gap-2"><Brain className="w-4 h-4 text-purple-hi" /> Screening script</h4>
              <button onClick={() => addToast('Script editor — coming soon', 'info')} className="flex items-center gap-1 text-[11.5px] text-text-2 px-2.5 py-1 rounded-[7px] border border-border hover:bg-white/[0.06] hover:text-text-1 transition-all" style={{ background: 'rgba(124,58,237,0.04)' }}>
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {screeningScript.map((q, i) => (
                <div key={i} className="flex items-center gap-2.5 text-[12.5px] text-text-2">
                  <div className="w-[22px] h-[22px] rounded-full grid place-items-center text-[11px] font-semibold shrink-0" style={{ background: 'rgba(124,58,237,0.14)', color: '#A78BFA' }}>{i + 1}</div>
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
