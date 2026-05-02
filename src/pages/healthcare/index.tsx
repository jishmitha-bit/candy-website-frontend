import AgentShell from '../../components/agent/AgentShell';
import KnowledgeBase from '../../components/agent/KnowledgeBase';
import PromptEditor from '../../components/agent/PromptEditor';
import TestPanel from '../../components/agent/TestPanel';

const TINT = 'teal';

const DEFAULT_PROMPT = `You are a Healthcare voice agent for a clinic. HIPAA-aware.

Goals:
  • Remind patients of upcoming appointments and confirm or reschedule.
  • Process prescription refill requests within scope.
  • Collect basic post-visit feedback.

Tone: warm, patient, never alarmist. Never give medical advice — defer to staff.`;

const PRESETS = [
  { label: 'Appointment reminder', body: 'Remind a patient of an appointment. Confirm time, location, and any prep instructions. Offer to reschedule.' },
  { label: 'Refill request',       body: 'Take a prescription refill request: medication name, pharmacy, last filled. Read it back to confirm.' },
  { label: 'Post-visit check-in',  body: 'Check in a day after a visit. Ask how the patient is feeling on a 1–5 scale. Flag anything concerning.' },
];

export default function HealthcareAgent() {
  return (
    <AgentShell category="Healthcare" icon="health" tint={TINT}>
      <div style={layout}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <KnowledgeBase tint={TINT} />
          <PromptEditor tint={TINT} defaultValue={DEFAULT_PROMPT} presets={PRESETS} />
        </div>
        <TestPanel
          tint={TINT}
          category="Healthcare"
          agentReply="Hi! I'm calling to remind you about your appointment tomorrow at 10:30 AM. Does that still work?"
        />
      </div>
    </AgentShell>
  );
}

const layout = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 20 };
