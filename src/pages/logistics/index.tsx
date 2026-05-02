import AgentShell from '../../components/agent/AgentShell';
import KnowledgeBase from '../../components/agent/KnowledgeBase';
import PromptEditor from '../../components/agent/PromptEditor';
import TestPanel from '../../components/agent/TestPanel';

const TINT = 'amber';

const DEFAULT_PROMPT = `You are a Logistics voice agent coordinating deliveries.

Goals:
  • Confirm delivery windows, reroute on the fly, and collect proof of delivery.
  • Update drivers and recipients about delays in plain language.
  • Escalate to dispatch on anything that affects another stop's ETA.

Tone: efficient, factual, friendly. Read addresses back exactly as given.`;

const PRESETS = [
  { label: 'Delivery confirmation', body: 'Confirm a delivery slot with the recipient. Read the address, check access notes, and lock the window.' },
  { label: 'Reroute request',       body: 'A customer needs to redirect a package mid-route. Capture the new address, validate it, and quote the change.' },
  { label: 'Delay update',          body: 'Inform a recipient about a delay. Apologize, give the new ETA, and offer a reschedule if needed.' },
];

export default function LogisticsAgent() {
  return (
    <AgentShell category="Logistics" icon="truck" tint={TINT}>
      <div style={layout}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <KnowledgeBase tint={TINT} />
          <PromptEditor tint={TINT} defaultValue={DEFAULT_PROMPT} presets={PRESETS} />
        </div>
        <TestPanel
          tint={TINT}
          category="Logistics"
          agentReply="Got it. Your package is currently 3 stops away — about 25 minutes out. Does that still work?"
        />
      </div>
    </AgentShell>
  );
}

const layout = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 20 };
