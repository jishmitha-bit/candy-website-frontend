import AgentWorkspace from '../../components/agent/AgentWorkspace';

const TINT = 'amber' as const;

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
    <AgentWorkspace
      slug="log"
      category="Logistics"
      icon="truck"
      tint={TINT}
      defaultPrompt={DEFAULT_PROMPT}
      presets={PRESETS}
    />
  );
}
