import AgentWorkspace from '../../components/agent/AgentWorkspace';

const TINT = 'green' as const;

// Plain-English business requirement. Just describe what the agent
// should do — the backend's compile_agent_prompt step turns this
// into a polished, structured system prompt before runtime.
const DEFAULT_PROMPT = `Handle incoming customer calls for our loan team.
Answer questions about home loans, EMI calculations, and moratoriums
using the knowledge base.

If the customer asks something outside that scope, or anything you
cannot answer confidently, tell them: "I'm the AI assistant — a human
agent from our team will call you back shortly." Don't make up answers.

Speak warmly and professionally. Keep replies short (1-2 sentences).
Use the customer's language if they switch to Hindi or Tamil.`;

const PRESETS = [
  { label: 'Payment reminder', body: 'Politely remind a customer of an overdue payment. Confirm identity, summarize amount + due date, offer to pay over the call or schedule a callback.' },
  { label: 'KYC capture',      body: 'Walk the caller through KYC: full name, DOB, address, and the last 4 of their ID. Confirm each value before moving on.' },
  { label: 'Loan pre-screen',  body: 'Pre-qualify a loan applicant: income range, employment status, requested amount, and purpose. End with next steps.' },
];

export default function FinancialAgent() {
  return (
    <AgentWorkspace
      slug="fin"
      category="Financial"
      icon="money"
      tint={TINT}
      defaultPrompt={DEFAULT_PROMPT}
      presets={PRESETS}
    />
  );
}
