import AgentShell from '../../components/agent/AgentShell';
import KnowledgeBase from '../../components/agent/KnowledgeBase';
import PromptEditor from '../../components/agent/PromptEditor';
import TestPanel from '../../components/agent/TestPanel';

const TINT = 'blue';

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
    <AgentShell category="Marketing" icon="broadcast" tint={TINT}>
      <div style={layout}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <KnowledgeBase tint={TINT} />
          <PromptEditor tint={TINT} defaultValue={DEFAULT_PROMPT} presets={PRESETS} />
        </div>
        <TestPanel
          tint={TINT}
          category="Marketing"
          agentReply="Hey! Quick question — on a scale of 0 to 10, how likely are you to recommend us to a friend?"
        />
      </div>
    </AgentShell>
  );
}

const layout = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 20 };
