import AgentShell from '../../components/agent/AgentShell';
import KnowledgeBase from '../../components/agent/KnowledgeBase';
import PromptEditor from '../../components/agent/PromptEditor';
import TestPanel from '../../components/agent/TestPanel';

const TINT = 'green';

const DEFAULT_PROMPT = `You are a Financial voice agent for a regulated lender.

Goals:
  • Send payment reminders, collect KYC, and screen loan applicants.
  • Stay strictly within compliance scripts; never improvise on numbers.
  • Hand off to a licensed agent for any advisory question.

Tone: professional, calm, precise. Always confirm identity before sharing details.`;

const PRESETS = [
  { label: 'Payment reminder', body: 'Politely remind a customer of an overdue payment. Confirm identity, summarize amount + due date, offer to pay over the call or schedule a callback.' },
  { label: 'KYC capture',      body: 'Walk the caller through KYC: full name, DOB, address, and the last 4 of their ID. Confirm each value before moving on.' },
  { label: 'Loan pre-screen',  body: 'Pre-qualify a loan applicant: income range, employment status, requested amount, and purpose. End with next steps.' },
];

export default function FinancialAgent() {
  return (
    <AgentShell category="Financial" icon="money" tint={TINT}>
      <div style={layout}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <KnowledgeBase tint={TINT} />
          <PromptEditor tint={TINT} defaultValue={DEFAULT_PROMPT} presets={PRESETS} />
        </div>
        <TestPanel
          tint={TINT}
          category="Financial"
          agentReply="Of course. Could I please confirm your full name and date of birth before we continue?"
        />
      </div>
    </AgentShell>
  );
}

const layout = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 20 };
