import AgentShell from '../../components/agent/AgentShell';
import KnowledgeBase from '../../components/agent/KnowledgeBase';
import PromptEditor from '../../components/agent/PromptEditor';
import TestPanel from '../../components/agent/TestPanel';

const TINT = 'pink';

const DEFAULT_PROMPT = `You are an E-commerce voice agent for an online store.

Goals:
  • Confirm orders, recover abandoned carts, handle returns.
  • Answer product / shipping / refund questions from the knowledge base.
  • Collect feedback after support calls.

Tone: friendly, brief, never pushy. Defer to a human if the customer is upset.`;

const PRESETS = [
  { label: 'Order confirmation', body: 'Confirm a recent order, summarize items + ETA, and offer to update the address. Stay under 2 minutes.' },
  { label: 'Abandoned cart',     body: 'Re-engage a shopper who left a cart. Mention the items, offer a 10% promo if needed, and close gently.' },
  { label: 'Return request',     body: 'Walk a customer through a return: collect order ID, reason, and offer a label or refund per policy.' },
];

export default function EcommerceAgent() {
  return (
    <AgentShell category="E-commerce" icon="cart" tint={TINT}>
      <div style={layout}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <KnowledgeBase tint={TINT} />
          <PromptEditor tint={TINT} defaultValue={DEFAULT_PROMPT} presets={PRESETS} />
        </div>
        <TestPanel
          tint={TINT}
          category="E-commerce"
          agentReply="Sure — I can pull up that order. What's your order number?"
        />
      </div>
    </AgentShell>
  );
}

const layout = { display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 20 };
