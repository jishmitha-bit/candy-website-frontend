import ChatPanel    from './ChatPanel';
import WorkflowPanel from './WorkflowPanel';

export default function HRFlowPage() {
  return (
    <div className="fade-up">
      {/* Page header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--purple-hi)', marginBottom: 10 }}>
          HR &amp; Hiring · Candidate Screening
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-1)' }}>
          AI Recruiting Assistant
        </h1>
      </div>

      {/* Split view */}
      <div
        style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        <ChatPanel />
        <WorkflowPanel />
      </div>
    </div>
  );
}
