import AgentWorkspace from '../../components/agent/AgentWorkspace';

const TINT = 'pink' as const;

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
    <AgentWorkspace
      slug="ecom"
      category="E-commerce"
      icon="cart"
      tint={TINT}
      defaultPrompt={DEFAULT_PROMPT}
      presets={PRESETS}
    />
  );
}
