import AgentWorkspace from '../../components/agent/AgentWorkspace';

const TINT = 'teal' as const;

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
    <AgentWorkspace
      slug="health"
      category="Healthcare"
      icon="health"
      tint={TINT}
      defaultPrompt={DEFAULT_PROMPT}
      presets={PRESETS}
    />
  );
}
