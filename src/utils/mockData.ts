// ── Categories ──────────────────────────────────────────────────────────────
export const categories = [
  {
    id: 'ecom', title: 'E-commerce', tint: 'pink', icon: 'cart',
    desc: 'Automate order confirmations, abandoned carts, and customer support calls.',
    flows: 12, agents: 4,
  },
  {
    id: 'fin', title: 'Financial', tint: 'green', icon: 'money',
    desc: 'Payment reminders, KYC verification, and loan screening workflows.',
    flows: 8, agents: 3,
  },
  {
    id: 'log', title: 'Logistics', tint: 'amber', icon: 'truck',
    desc: 'Delivery coordination, status updates, and route optimization calls.',
    flows: 15, agents: 6,
  },
  {
    id: 'health', title: 'Healthcare', tint: 'teal', icon: 'health',
    desc: 'Appointment reminders, prescription refills, and patient follow-ups.',
    flows: 9, agents: 5,
  },
  {
    id: 'hr', title: 'HR & Hiring', tint: 'purple', icon: 'hr', featured: true,
    desc: 'Candidate screening, interview scheduling, and employee check-ins.',
    flows: 6, agents: 2,
  },
  {
    id: 'mkt', title: 'Marketing', tint: 'blue', icon: 'broadcast',
    desc: 'Campaign outreach, survey collection, and lead qualification calls.',
    flows: 11, agents: 4,
  },
];

// ── Mock call data seed ──────────────────────────────────────────────────────
const firstNames = ['Aarav','Priya','Rohan','Ananya','Vikram','Meera','Kabir','Diya','Arjun','Riya','Ishaan','Sara','Dev','Anika','Neel'];
const lastNames  = ['Sharma','Patel','Iyer','Reddy','Gupta','Menon','Nair','Singh','Das','Verma','Kapoor','Shah','Rao','Jain'];
const roles      = ['Senior Engineer','Product Designer','Data Analyst','Marketing Lead','Full-stack Dev','DevOps Engineer','UX Researcher','PM Associate','iOS Engineer','Backend Lead'];

export const statusPool = [
  { key: 'completed',  txt: 'Completed',  outcomes: ['Qualified for next round','Strong technical fit','Interview recorded','Shortlisted'] },
  { key: 'declined',   txt: 'Declined',   outcomes: ['Not looking currently','Salary mismatch','Relocation constraint'] },
  { key: 'noanswer',   txt: 'No Answer',  outcomes: ['No voicemail','Ringing no response','Callback after 6 PM'] },
  { key: 'rescheduled',txt: 'Rescheduled',outcomes: ['Prefers next Tuesday','Asked for weekend slot','Busy this week'] },
  { key: 'inprogress', txt: 'In Progress',outcomes: ['Speaking now…','Answering questions','Follow-up needed','AI screening'] },
  { key: 'followup',   txt: 'Follow-up',  outcomes: ['Needs tech round','Send JD by email','Manager will decide'] },
];

export const avatarColors = ['#755BE3','#18DAFC','#4FD1C5','#4CAF50','#FFB547','#E65AFF','#FF5C7A','#9B82FF'];

export function rand(n) { return Math.floor(Math.random() * n); }
export function pick(arr) { return arr[rand(arr.length)]; }

export function generateCall(idOffset = 0) {
  const first     = pick(firstNames);
  const last      = pick(lastNames);
  const statusObj = pick(statusPool);
  return {
    id:          Date.now() + idOffset + rand(1000),
    name:        `${first} ${last}`,
    initials:    `${first[0]}${last[0]}`,
    role:        pick(roles),
    phone:       `+91 ${90000 + rand(9999)} ${10000 + rand(89999)}`,
    status:      statusObj.key,
    statusTxt:   statusObj.txt,
    outcome:     pick(statusObj.outcomes),
    duration:    statusObj.key === 'inprogress' ? 'live' : `${rand(8)+1}m ${rand(59)}s`,
    avatarColor: pick(avatarColors),
  };
}

export function seedCalls(count = 14) {
  return Array.from({ length: count }, (_, i) => generateCall(i));
}

// ── Quick actions ─────────────────────────────────────────────────────────────
export const quickActions = [
  { icon: 'upload', title: 'Upload contact list',  sub: 'Excel, CSV, or Google Sheets', key: 'U' },
  { icon: 'mic',    title: 'Start voice campaign', sub: 'Launch calls in minutes',       key: 'V' },
  { icon: 'flow',   title: 'New workflow',         sub: 'Drag-and-drop automation',      key: 'N' },
  { icon: 'chart',  title: 'View analytics',       sub: 'Performance & insights',        key: 'A' },
];

// ── Recent activity ───────────────────────────────────────────────────────────
export const recentActivity = [
  { icon: 'mic',    tint: '',      text: '<strong>Voice campaign</strong> "Q2 Candidate Screening" completed with 142 contacts reached.', time: '2 minutes ago' },
  { icon: 'chat',   tint: 'blue',  text: '<strong>AI Chat</strong> generated a follow-up email template for declined candidates.',           time: '18 minutes ago' },
  { icon: 'flow',   tint: 'green', text: '<strong>Workflow</strong> "Payment Reminder" deployed to production successfully.',                 time: '1 hour ago' },
  { icon: 'upload', tint: 'amber', text: '<strong>Data import</strong> — candidates_q2.xlsx (248 rows) processed.',                          time: '3 hours ago' },
];

// ── HR Chat seed messages ─────────────────────────────────────────────────────
export const seedChatMessages = [
  {
    role: 'ai',
    text: "Hey Hello! I'm your HR automation assistant. Ready to screen candidates? You can upload a CSV/Excel with contacts, or describe what you'd like to automate.",
    time: '10:42 AM',
  },
  {
    role: 'user',
    text: "Uploaded senior_frontend_candidates.xlsx — please call everyone and screen for React 18, TypeScript, and 5+ years experience.",
    time: '10:43 AM',
    file: { name: 'senior_frontend_candidates.xlsx', size: '142 KB · 248 rows' },
  },
  {
    role: 'ai',
    text: "Got it. I'll run a 6-question screening script covering React 18, TypeScript, system design, and salary expectations. Starting campaign now — you'll see live progress on the right. Expected completion: ~42 minutes.",
    time: '10:43 AM',
  },
];

// ── Stats strip ───────────────────────────────────────────────────────────────
export const statsStrip = [
  { icon: 'phone', label: 'Calls this week',  value: '14,829', delta: '↑ 12.4%', up: true  },
  { icon: 'check', label: 'Success rate',     value: '87.2%',  delta: '↑ 3.1%',  up: true  },
  { icon: 'flow',  label: 'Active workflows', value: '24',     delta: '↑ 4',      up: true  },
  { icon: 'zap',   label: 'Tasks automated',  value: '3,421',  delta: '↓ 2.0%',  up: false },
];
