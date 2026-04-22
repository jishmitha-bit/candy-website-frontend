import { useState } from 'react'
import { User, Building2, Gauge, Mic2, Code2, Shield, Eye, EyeOff, Copy, Lock, Waves } from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import Toggle from '../components/ui/Toggle'

const navItems = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'usage', label: 'Usage & Limits', icon: Gauge },
  { id: 'voice', label: 'Voice Config', icon: Mic2 },
  { id: 'api', label: 'API & Webhooks', icon: Code2 },
  { id: 'security', label: 'Security', icon: Shield },
]

const apiKey = 'sk-ms-4d8f2a1b9c7e3f5a6b2d8e4f1a9c7b3d5e2f8a4b6c1d9e3f'
const maskedKey = 'sk-ms-' + '•'.repeat(36)

const usageLimits = [
  { label: 'Voice credits', used: 62840, total: 100000, color: '#7C3AED', grad: '#A78BFA', sub: '37,160 credits remaining · ~12 days at current rate' },
  { label: 'Concurrent calls', used: 38, total: 50, color: '#22D3EE', grad: '#C084FC', sub: '⚠ Approaching limit · Peak usage observed today at 2:14 PM', warn: true },
  { label: 'AI chat tokens', used: 1.2, total: 2, color: '#A78BFA', grad: '#7C3AED', sub: '800K tokens remaining this billing period', unit: 'M' },
  { label: 'Active voice agents', used: 8, total: 15, color: '#F59E0B', grad: '#FCD34D', sub: '7 agent slots available on your Pro plan' },
]

export default function SettingsPage() {
  const addToast = useAppStore((s) => s.addToast)
  const [activeSection, setActiveSection] = useState('profile')
  const [apiRevealed, setApiRevealed] = useState(false)
  const [twoFA, setTwoFA] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [voiceType, setVoiceType] = useState<'female' | 'male'>('female')
  const save = (section: string) => addToast(`${section} settings saved`, 'success')

  return (
    <div className="animate-fadeUp">
      <div className="mb-8">
        <p className="text-[11px] text-text-3 uppercase tracking-[0.2em] mb-2.5">Account Settings</p>
        <h1 className="text-[36px] font-bold tracking-[-0.025em] leading-[1.1] mb-3"><em className="not-italic grad-text">Settings</em></h1>
        <p className="text-text-3 text-[15px]">Manage your profile, workspace, voice agents, and integrations.</p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '200px 1fr' }}>
        <div className="sticky top-[84px] self-start flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id
            return (
              <button key={item.id} onClick={() => setActiveSection(item.id)} className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-[10px] text-[13.5px] font-medium transition-all ${isActive ? 'settings-nav-active' : 'text-text-3 hover:text-text-2 hover:bg-white/[0.03]'}`}>
                <Icon className="w-4 h-4 shrink-0" strokeWidth={1.75} />{item.label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-6">
          {activeSection === 'profile' && (
            <Section title="Profile" icon={<User className="w-4 h-4" />} sub="Manage your personal information.">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-[14px] grid place-items-center font-bold text-[22px] shrink-0" style={{ background: 'linear-gradient(135deg, #7C3AED, #22D3EE)', color: '#EDE9FE' }}>HS</div>
                <div>
                  <div className="text-[15px] font-semibold">Hello</div>
                  <div className="text-[13px] text-text-3 mt-0.5">hello@spacemarvel.ai</div>
                  <button onClick={() => addToast('Avatar upload — coming soon', 'info')} className="text-[12px] text-neon-teal mt-1.5 hover:underline">Change avatar</button>
                </div>
              </div>
              <FormGrid>
                <FormField label="First name"><FormInput defaultValue="Hello" /></FormField>
                <FormField label="Last name"><FormInput defaultValue="SpaceMarvel" /></FormField>
                <FormField label="Email" span2><FormInput defaultValue="hello@spacemarvel.ai" type="email" /></FormField>
                <FormField label="Role"><FormInput defaultValue="Founder & CEO" /></FormField>
                <FormField label="Timezone">
                  <select className="form-input-style w-full">
                    <option>Asia/Kolkata (IST, UTC+5:30)</option>
                    <option>America/New_York (EST, UTC-5)</option>
                    <option>Europe/London (GMT, UTC+0)</option>
                  </select>
                </FormField>
              </FormGrid>
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <div className="text-[13.5px] font-medium">Email notifications</div>
                  <div className="text-[12px] text-text-3 mt-0.5">Campaign reports, alerts, and weekly summaries</div>
                </div>
                <Toggle on={notifications} onChange={setNotifications} />
              </div>
              <SectionFooter onSave={() => save('Profile')} />
            </Section>
          )}

          {activeSection === 'workspace' && (
            <Section title="Workspace" icon={<Building2 className="w-4 h-4" />} sub="Configure your team workspace.">
              <FormGrid>
                <FormField label="Workspace name"><FormInput defaultValue="SpaceMarvel AI" /></FormField>
                <FormField label="Industry (primary use case)">
                  <select className="form-input-style w-full">
                    <option>Voice Agents</option><option>HR &amp; Hiring</option><option>E-commerce</option><option>Financial</option><option>Healthcare</option>
                  </select>
                </FormField>
                <FormField label="Workspace URL"><FormInput defaultValue="spacemarvel.metaspace.ai" readOnly /></FormField>
                <FormField label="Team size">
                  <select className="form-input-style w-full">
                    <option>1–5 members</option><option>6–20 members</option><option>21–50 members</option><option>50+ members</option>
                  </select>
                </FormField>
              </FormGrid>
              <SectionFooter onSave={() => save('Workspace')} />
            </Section>
          )}

          {activeSection === 'usage' && (
            <Section title="Usage & Limits" icon={<Gauge className="w-4 h-4" />} sub="Track consumption against your plan allowance. Resets on May 1.">
              {usageLimits.map((u) => (
                <div key={u.label} className="py-4 border-b border-border last:border-0">
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-2 text-[13.5px] font-medium">
                      <span className="w-2 h-2 rounded-full" style={{ background: u.color }} />{u.label}
                    </div>
                    <span className="font-mono text-[12.5px]">
                      <span className="text-text-1 font-semibold">{u.used}{u.unit ?? ''}</span>
                      <span className="text-text-3"> / {u.total}{u.unit ?? ''}</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden relative" style={{ background: 'rgba(124,58,237,0.1)' }}>
                    <div className="h-full rounded-full relative usage-shimmer" style={{ width: `${(u.used / u.total) * 100}%`, background: `linear-gradient(90deg, ${u.color}, ${u.grad})` }} />
                  </div>
                  <div className={`text-[11.5px] mt-2 ${u.warn ? 'text-neon-amber' : 'text-text-3'}`}>{u.sub}</div>
                </div>
              ))}
            </Section>
          )}

          {activeSection === 'voice' && (
            <Section title="Voice Configuration" icon={<Waves className="w-4 h-4" />} sub="Default voice settings applied to new agents and campaigns.">
              <FormGrid>
                <FormField label="Primary language">
                  <select className="form-input-style w-full"><option>English (US)</option><option>English (India)</option><option>Hindi</option><option>Tamil</option><option>Spanish</option></select>
                </FormField>
                <FormField label="Call retry attempts">
                  <select className="form-input-style w-full"><option>No retry</option><option>1 attempt</option><option>2 attempts</option><option>3 attempts</option></select>
                </FormField>
                <FormField label="Voice type" span2>
                  <div className="grid grid-cols-2 gap-2.5">
                    {(['female', 'male'] as const).map((v) => (
                      <button key={v} type="button" onClick={() => setVoiceType(v)}
                        className={`flex items-center gap-2.5 p-3 rounded-[10px] border transition-all ${voiceType === v ? 'border-purple/40' : 'border-border-strong hover:bg-white/[0.04]'}`}
                        style={{ background: voiceType === v ? 'rgba(124,58,237,0.1)' : 'rgba(124,58,237,0.03)' }}
                      >
                        <div className="w-8 h-8 rounded-[8px] grid place-items-center shrink-0" style={{ background: voiceType === v ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)', color: voiceType === v ? '#A78BFA' : '#8B5CF6' }}>
                          <Mic2 className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-[13px] font-medium">{v === 'female' ? 'Female' : 'Male'}</div>
                          <div className="text-[11px] text-text-3">{v === 'female' ? 'Aria · Warm, professional' : 'Atlas · Confident, clear'}</div>
                        </div>
                        <div className="ml-auto w-[18px] h-[18px] rounded-full border border-border-strong grid place-items-center transition-all" style={voiceType === v ? { borderColor: '#7C3AED', background: '#7C3AED' } : {}}>
                          {voiceType === v && <span className="w-2 h-2 rounded-full bg-bg-0" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </FormField>
              </FormGrid>
              <SectionFooter onSave={() => save('Voice')} />
            </Section>
          )}

          {activeSection === 'api' && (
            <Section title="API & Webhooks" icon={<Code2 className="w-4 h-4" />} sub="Integrate Metaspace with your own applications.">
              <FormField label="API key" helpText="Keep this secret — do not share">
                <div className="relative">
                  <input readOnly value={apiRevealed ? apiKey : maskedKey} className="form-input-style w-full font-mono text-[12.5px] pr-28" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1.5">
                    <button onClick={() => setApiRevealed(!apiRevealed)} className="flex items-center gap-1 text-[11.5px] text-text-2 px-2 py-1.5 rounded-[7px] border border-border hover:bg-white/[0.06] transition-all" style={{ background: 'rgba(124,58,237,0.04)' }}>
                      {apiRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                    <button onClick={() => { navigator.clipboard.writeText(apiKey); addToast('API key copied', 'success') }} className="flex items-center gap-1 text-[11.5px] text-text-2 px-2 py-1.5 rounded-[7px] border border-border hover:bg-white/[0.06] transition-all" style={{ background: 'rgba(124,58,237,0.04)' }}>
                      <Copy className="w-3 h-3" /> Copy
                    </button>
                  </div>
                </div>
              </FormField>
              <div className="mt-4">
                <FormField label="Webhook URL" helpText="Receive event callbacks">
                  <input defaultValue="https://api.spacemarvel.ai/hooks/metaspace" className="form-input-style w-full font-mono text-[12.5px]" />
                </FormField>
              </div>
              <div className="flex justify-end gap-2.5 mt-5 pt-[18px] border-t border-border">
                <button onClick={() => addToast('API key regenerated — update your integrations', 'info')} className="px-4 py-2 rounded-[9px] border border-border-strong text-text-2 text-[13px] font-medium hover:text-text-1 hover:bg-white/[0.04] transition-all" style={{ background: 'transparent' }}>Regenerate key</button>
                <button onClick={() => save('API')} className="btn-brand px-[18px] py-2 rounded-[9px] text-[13px] font-semibold">Save changes</button>
              </div>
            </Section>
          )}

          {activeSection === 'security' && (
            <Section title="Security" icon={<Shield className="w-4 h-4" />} sub="Protect your account with strong authentication.">
              <RowControl title="Password" sub="Last changed 42 days ago · Use 12+ characters with numbers and symbols"
                action={<button onClick={() => addToast('Password change — coming soon', 'info')} className="flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] border border-border-strong text-text-2 text-[13px] font-medium hover:text-text-1 hover:bg-white/[0.04] transition-all" style={{ background: 'transparent' }}><Lock className="w-3 h-3" /> Change password</button>}
              />
              <RowControl title="Two-factor authentication (2FA)" sub="Add an extra layer of security using an authenticator app"
                action={<Toggle on={twoFA} onChange={(v) => { setTwoFA(v); addToast(v ? '2FA enabled' : '2FA disabled', 'success') }} />}
              />
              <RowControl title="Active sessions" sub="2 devices signed in · Chrome on Mac (current), Safari on iPhone"
                action={<button onClick={() => addToast('All other sessions signed out', 'success')} className="px-3.5 py-2 rounded-[9px] border text-[13px] font-medium transition-all" style={{ background: 'rgba(255,69,96,0.1)', borderColor: 'rgba(255,69,96,0.3)', color: '#FF4560' }}>Sign out all</button>}
              />
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, icon, sub, children }: { title: string; icon: React.ReactNode; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border p-6" style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}>
      <div className="mb-5 pb-4 border-b border-border">
        <h2 className="text-[18px] font-semibold flex items-center gap-2">
          <span className="w-8 h-8 rounded-[8px] grid place-items-center text-purple-hi" style={{ background: 'rgba(124,58,237,0.14)' }}>{icon}</span>{title}
        </h2>
        <p className="text-[13px] text-text-3 mt-1.5">{sub}</p>
      </div>
      {children}
    </div>
  )
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4 mb-2">{children}</div>
}

function FormField({ label, helpText, span2, children }: { label: string; helpText?: string; span2?: boolean; children: React.ReactNode }) {
  return (
    <div className={span2 ? 'col-span-2' : ''}>
      <label className="block text-[12px] text-text-2 mb-2 tracking-[0.02em]">
        {label}{helpText && <span className="ml-2 text-[11px] text-text-4">({helpText})</span>}
      </label>
      {children}
    </div>
  )
}

function FormInput({ defaultValue, type = 'text', readOnly }: { defaultValue?: string; type?: string; readOnly?: boolean }) {
  return <input type={type} defaultValue={defaultValue} readOnly={readOnly} className="form-input-style w-full" />
}

function RowControl({ title, sub, action }: { title: string; sub: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-border last:border-0">
      <div className="flex-1">
        <div className="text-[13.5px] font-medium">{title}</div>
        <div className="text-[12px] text-text-3 mt-0.5 leading-[1.45]">{sub}</div>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  )
}

function SectionFooter({ onSave }: { onSave: () => void }) {
  return (
    <div className="flex justify-end gap-2.5 mt-5 pt-[18px] border-t border-border">
      <button className="px-4 py-2 rounded-[9px] border border-border-strong text-text-2 text-[13px] font-medium hover:text-text-1 hover:bg-white/[0.04] transition-all" style={{ background: 'transparent' }}>Cancel</button>
      <button onClick={onSave} className="btn-brand px-[18px] py-2 rounded-[9px] text-[13px] font-semibold">Save changes</button>
    </div>
  )
}
