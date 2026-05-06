import AgentWorkspace from '../../components/agent/AgentWorkspace';

const TINT = 'blue' as const;

const DEFAULT_PROMPT = `You are a Marketing voice agent running outbound campaigns.

Goals:
  • Run survey calls and qualify warm leads.
  • Capture campaign feedback and route hot prospects to a closer.
  • Be very short — one question per turn — and never over-promise.

Tone: upbeat, curious, brief. Start by confirming this is a good time.`;

const PRESETS = [
  { label: 'Lead qualification', body: 'Qualify an inbound lead: company size, role, current tools, and timeline. Score on a 1–10 scale and route hot leads.' },
  { label: 'NPS survey',         body: 'Run a 2-question NPS survey: ask the score, then a follow-up "what would make it a 10?". Keep it under 90 seconds.' },
  { label: 'Campaign outreach',  body: 'Open with a one-line value prop, ask if they\'d like a 5-minute walkthrough, and book a slot if yes.' },
];

export default function MarketingAgent() {
  return (
    <AgentWorkspace
      slug="mkt"
      category="Marketing"
      icon="broadcast"
      tint={TINT}
      defaultPrompt={DEFAULT_PROMPT}
      presets={PRESETS}
    />
  );
}
