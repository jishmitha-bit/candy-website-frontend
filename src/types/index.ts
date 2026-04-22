export type CallStatus =
  | 'completed'
  | 'declined'
  | 'noanswer'
  | 'rescheduled'
  | 'inprogress'
  | 'followup'

export interface Call {
  id: number
  name: string
  role: string
  phone: string
  status: CallStatus
  statusTxt: string
  outcome: string
  duration: string
  avatarColor: string
  initials: string
}

export interface ChatMessage {
  id: string
  role: 'ai' | 'user' | 'typing'
  text: string
  time: string
  file?: { name: string; size: string }
}

export type AgentTint = 'purple' | 'blue' | 'teal' | 'green' | 'amber' | 'pink'

export interface VoiceAgent {
  id: string
  title: string
  tint: AgentTint
  iconName: string
  desc: string
  campaigns: number
  agents: number
  featured?: boolean
}

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'info' | 'error'
}
