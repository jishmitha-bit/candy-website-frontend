import type { VoiceAgent, Call, CallStatus, ChatMessage } from '../types'

export const voiceAgents: VoiceAgent[] = [
  {
    id: 'sales',
    title: 'Sales Outreach',
    tint: 'pink',
    iconName: 'Phone',
    desc: 'Automate cold calls, follow-ups, and pipeline nurturing at scale with human-like voice.',
    campaigns: 12,
    agents: 4,
  },
  {
    id: 'support',
    title: 'Customer Support',
    tint: 'blue',
    iconName: 'Headphones',
    desc: 'Handle inbound queries, escalations, and satisfaction surveys around the clock.',
    campaigns: 8,
    agents: 3,
  },
  {
    id: 'hr',
    title: 'HR Screener',
    tint: 'purple',
    iconName: 'Users',
    desc: 'Screen candidates, schedule interviews, and run employee check-ins automatically.',
    campaigns: 6,
    agents: 2,
    featured: true,
  },
  {
    id: 'appointments',
    title: 'Appointment Booking',
    tint: 'teal',
    iconName: 'CalendarDays',
    desc: 'Schedule, confirm, and reschedule appointments across time zones with zero friction.',
    campaigns: 9,
    agents: 5,
  },
  {
    id: 'leads',
    title: 'Lead Qualifier',
    tint: 'green',
    iconName: 'Target',
    desc: 'Qualify inbound leads, score prospects, and route to the right sales rep instantly.',
    campaigns: 15,
    agents: 6,
  },
  {
    id: 'survey',
    title: 'Survey & Feedback',
    tint: 'amber',
    iconName: 'ClipboardList',
    desc: 'Run NPS surveys, collect post-call feedback, and measure customer satisfaction.',
    campaigns: 11,
    agents: 4,
  },
]

const firstNames = ['Aarav','Priya','Rohan','Ananya','Vikram','Meera','Kabir','Diya','Arjun','Riya','Ishaan','Sara','Dev','Anika','Neel']
const lastNames = ['Sharma','Patel','Iyer','Reddy','Gupta','Menon','Nair','Singh','Das','Verma','Kapoor','Shah','Rao','Jain']
const roles = ['Senior Engineer','Product Designer','Data Analyst','Marketing Lead','Full-stack Dev','DevOps Engineer','UX Researcher','PM Associate','iOS Engineer','Backend Lead']
const avatarColors = ['#755BE3','#18DAFC','#4FD1C5','#4CAF50','#FFB547','#E65AFF','#FF5C7A','#9B82FF']

export const statusPool: { key: CallStatus; txt: string; outcomes: string[] }[] = [
  { key: 'completed', txt: 'Completed', outcomes: ['Qualified for next round','Strong technical fit','Interview recorded','Shortlisted'] },
  { key: 'declined', txt: 'Declined', outcomes: ['Not looking currently','Salary mismatch','Relocation constraint'] },
  { key: 'noanswer', txt: 'No Answer', outcomes: ['No voicemail','Ringing no response','Callback after 6 PM'] },
  { key: 'rescheduled', txt: 'Rescheduled', outcomes: ['Prefers next Tuesday','Asked for weekend slot','Busy this week'] },
  { key: 'inprogress', txt: 'In Progress', outcomes: ['Speaking now…','Answering questions','Follow-up needed','AI screening'] },
  { key: 'followup', txt: 'Follow-up', outcomes: ['Needs tech round','Send JD by email','Manager will decide'] },
]

function rand(n: number) { return Math.floor(Math.random() * n) }
function pick<T>(arr: T[]): T { return arr[rand(arr.length)] }

export function generateCalls(count = 14): Call[] {
  return Array.from({ length: count }, (_, i) => {
    const first = pick(firstNames)
    const last = pick(lastNames)
    const statusObj = pick(statusPool)
    return {
      id: i + 1,
      name: `${first} ${last}`,
      role: pick(roles),
      phone: `+91 ${90000 + rand(9999)} ${10000 + rand(89999)}`,
      status: statusObj.key,
      statusTxt: statusObj.txt,
      outcome: pick(statusObj.outcomes),
      duration: statusObj.key === 'inprogress' ? 'live' : `${rand(8) + 1}m ${rand(59)}s`,
      avatarColor: pick(avatarColors),
      initials: first[0] + last[0],
    }
  })
}

export function generateCall(id: number): Call {
  const first = pick(firstNames)
  const last = pick(lastNames)
  const statusObj = pick(statusPool)
  return {
    id,
    name: `${first} ${last}`,
    role: pick(roles),
    phone: `+91 ${90000 + rand(9999)} ${10000 + rand(89999)}`,
    status: statusObj.key,
    statusTxt: statusObj.txt,
    outcome: pick(statusObj.outcomes),
    duration: statusObj.key === 'inprogress' ? 'live' : `${rand(8) + 1}m ${rand(59)}s`,
    avatarColor: pick(avatarColors),
    initials: first[0] + last[0],
  }
}

export const initialChatMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    text: "Hey Hello! I'm your voice agent assistant. Ready to deploy a new campaign? You can upload a CSV/Excel with contacts, or describe what you'd like to automate.",
    time: '10:42 AM',
  },
  {
    id: '2',
    role: 'user',
    text: 'Uploaded senior_frontend_candidates.xlsx — please call everyone and screen for React 18, TypeScript, and 5+ years experience.',
    time: '10:43 AM',
    file: { name: 'senior_frontend_candidates.xlsx', size: '142 KB · 248 rows' },
  },
  {
    id: '3',
    role: 'ai',
    text: "Got it. I'll run a 6-question screening script covering React 18, TypeScript, system design, and salary expectations. Starting campaign now — you'll see live progress on the right. Expected completion: ~42 minutes.",
    time: '10:43 AM',
  },
]

export const weeklyCallData = [
  { day: 'Mon', calls: 1840, success: 1520 },
  { day: 'Tue', calls: 2210, success: 1890 },
  { day: 'Wed', calls: 1980, success: 1720 },
  { day: 'Thu', calls: 2640, success: 2280 },
  { day: 'Fri', calls: 2920, success: 2530 },
  { day: 'Sat', calls: 1580, success: 1380 },
  { day: 'Sun', calls: 1660, success: 1420 },
]

export const callStatusData = [
  { label: 'Completed', value: 8421, color: '#4CAF50' },
  { label: 'No Answer', value: 1847, color: '#B4B4C8' },
  { label: 'Declined', value: 1264, color: '#FF5C7A' },
  { label: 'Rescheduled', value: 920, color: '#FFB547' },
  { label: 'Follow-up', value: 1377, color: '#9B82FF' },
]

export const agentUsageData = [
  { name: 'HR Screener', value: 4280, color: '#755BE3' },
  { name: 'Sales Outreach', value: 3620, color: '#E65AFF' },
  { name: 'Lead Qualifier', value: 2940, color: '#FFB547' },
  { name: 'Customer Support', value: 2180, color: '#4CAF50' },
  { name: 'Appointments', value: 1830, color: '#4FD1C5' },
]

export const aiReplies = [
  "Understood. I'll apply that to the active campaign and summarize results once the next batch completes. You can track progress in the panel on the right →",
  "On it! I've updated the screening criteria and notified the active agents. Expect updated metrics within the next 2–3 minutes.",
  "Great suggestion. I've queued that for the next batch of calls. The voice script has been adjusted accordingly.",
  "Done. I've paused 3 low-performing agents and redistributed their queue to the top performers. Efficiency should improve by ~15%.",
  "Noted. I'll reschedule those contacts for tomorrow between 10 AM–12 PM when response rates are historically highest.",
]
