/**
 * LiveCallsPage — recordings + agent overview, wired to the real backend.
 *
 *   Tabs:
 *     • Demo recordings — captured from the in-app Test panel via
 *       Start Test / Stop Test. Persisted as `demo_session` rows.
 *     • Live call recordings — telephony-side captures (placeholder
 *       until the Twilio bridge writes `live_call` rows).
 *     • Agents — quick overview of every agent on the company.
 */
import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import LiveStats from './LiveStats';
import Icon from '../../assets/icons';
import { listAgents, type Agent } from '../../api/agents';
import { listAllRecordings, deleteRecording, type RecordingRow } from '../../api/recordings';
import { ApiError, getToken } from '../../api/client';

type Tab = 'demo' | 'live' | 'agents';

const SLUG_LABEL: Record<string, string> = {
  ecom: 'E-commerce', fin: 'Financial', log: 'Logistics',
  health: 'Healthcare', hr: 'HR & Hiring', mkt: 'Marketing',
};

function formatDuration(ms: number | null | undefined): string {
  if (!ms || ms < 0) return '—';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}m ${String(sec).padStart(2, '0')}s`;
}

function formatSize(bytes: number | null | undefined): string {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}

export default function LiveCallsPage() {
  const { addToast } = useApp();
  const [tab, setTab]                = useState<Tab>('demo');
  const [demoRecs,  setDemoRecs]     = useState<RecordingRow[]>([]);
  const [liveRecs,  setLiveRecs]     = useState<RecordingRow[]>([]);
  const [agents,    setAgents]       = useState<Agent[]>([]);
  const [loading,   setLoading]      = useState(true);
  const [error,     setError]        = useState<string | null>(null);
  const [playingId, setPlayingId]    = useState<string | null>(null);
  const [deletingId, setDeletingId]  = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const initRef  = useRef(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const [demo, live, ags] = await Promise.all([
        listAllRecordings({ recording_type: 'demo_session', limit: 200 }).catch(() => []),
        listAllRecordings({ recording_type: 'live_call',    limit: 200 }).catch(() => []),
        listAgents().catch(() => []),
      ]);
      setDemoRecs(demo);
      setLiveRecs(live);
      setAgents(ags);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : (e as Error).message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    if (!getToken()) {
      setError('Not signed in');
      setLoading(false);
      return;
    }
    refresh();
    return () => { try { audioRef.current?.pause(); } catch {} };
  }, []);

  function play(rec: RecordingRow) {
    if (!rec.signed_url) {
      addToast('No playback URL — recording stored locally on the backend.', 'info');
      return;
    }
    if (!audioRef.current) audioRef.current = new Audio();
    if (playingId === rec.recording_id) {
      try { audioRef.current.pause(); } catch {}
      setPlayingId(null);
      return;
    }
    audioRef.current.src = rec.signed_url;
    audioRef.current.play().then(() => setPlayingId(rec.recording_id))
      .catch(err => {
        console.warn('[live] play failed', err);
        addToast('Could not play this recording.', 'error');
      });
    audioRef.current.onended = () => setPlayingId(null);
  }

  async function remove(rec: RecordingRow) {
    if (deletingId) return;
    if (!window.confirm(
      `Delete this recording permanently?\n\nAgent: ${rec.agent_name || '—'}\nCaptured: ${rec.created_at}\nDuration: ${formatDuration(rec.duration_ms)}`,
    )) return;
    setDeletingId(rec.recording_id);
    // If the row is currently playing, stop playback first.
    if (playingId === rec.recording_id) {
      try { audioRef.current?.pause(); } catch {}
      setPlayingId(null);
    }
    try {
      await deleteRecording(rec.recording_id);
      // Optimistically remove from whichever bucket the row lives in.
      setDemoRecs(prev => prev.filter(r => r.recording_id !== rec.recording_id));
      setLiveRecs(prev => prev.filter(r => r.recording_id !== rec.recording_id));
      addToast('Recording deleted', 'success');
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : (e as Error).message;
      addToast(`Could not delete recording: ${msg}`, 'error');
    } finally {
      setDeletingId(null);
    }
  }

  const list = tab === 'demo' ? demoRecs : tab === 'live' ? liveRecs : [];
  const counts = {
    demo:   demoRecs.length,
    live:   liveRecs.length,
    agents: agents.length,
  };
  const totalDuration = list.reduce((acc, r) => acc + (r.duration_ms || 0), 0);

  return (
    <div className="fade-up">
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--blue)', marginBottom: 10 }}>
          Voice Bots · Recordings
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text-1)' }}>
          Live Call Logs
        </h1>
        <p style={{ color: 'var(--text-3)', fontSize: 15, marginTop: 8 }}>
          {loading
            ? 'Loading…'
            : `${counts.demo} demo · ${counts.live} live · ${counts.agents} agents`}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            background: 'rgba(255,90,120,0.1)',
            border: '1px solid rgba(255,90,120,0.4)',
            color: '#ff8194',
            padding: '12px 14px', borderRadius: 10,
            fontSize: 13, marginBottom: 16,
          }}
        >
          {error}
        </div>
      )}

      {/* Tab strip */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        {[
          { key: 'demo',   label: 'Demo recordings',  cnt: counts.demo,   hint: 'From in-app Test panel' },
          { key: 'live',   label: 'Live calls',       cnt: counts.live,   hint: 'From real telephony' },
          { key: 'agents', label: 'Agents',           cnt: counts.agents, hint: 'All agents on this account' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as Tab)}
            title={t.hint}
            style={{
              padding: '7px 14px', borderRadius: 99,
              background: tab === t.key ? 'var(--tint-4)' : 'var(--tint-2)',
              border: tab === t.key ? '1px solid var(--border-strong)' : '1px solid var(--border)',
              color: tab === t.key ? 'var(--text-1)' : 'var(--text-2)',
              cursor: 'pointer', fontSize: 12.5,
              display: 'inline-flex', alignItems: 'center', gap: 7,
              transition: 'all 0.15s',
            }}
          >
            {t.label}
            <span
              style={{
                fontSize: 10.5, padding: '1px 7px', borderRadius: 99,
                background: tab === t.key ? 'var(--purple)' : 'var(--tint-4)',
                color: tab === t.key ? '#fff' : 'var(--text-3)',
              }}
            >
              {t.cnt}
            </span>
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => { refresh().then(() => addToast('Refreshed', 'success')); }}
          style={{
            padding: '7px 12px', borderRadius: 99,
            background: 'var(--tint-2)',
            border: '1px solid var(--border)',
            color: 'var(--text-2)', cursor: 'pointer', fontSize: 12.5,
            display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'all 0.15s',
          }}
        >
          <Icon name="refresh" size={12} /> Refresh
        </button>
      </div>

      <LiveStats counts={{
        total:      list.length,
        completed:  list.filter(r => (r.duration_ms || 0) > 0).length,
        inprogress: 0,
        declined:   0,
        pending:    list.filter(r => !r.signed_url).length,
      }} />

      {tab !== 'agents' ? (
        <RecordingsTable
          rows={list}
          loading={loading}
          emptyHint={
            tab === 'demo'
              ? 'No demo recordings yet — open any agent and click Start test, talk for a bit, then Stop test.'
              : 'No live call recordings yet — these appear once the telephony bridge starts writing live_call rows.'
          }
          playingId={playingId}
          deletingId={deletingId}
          onPlay={play}
          onDelete={remove}
        />
      ) : (
        <AgentsTable agents={agents} loading={loading} />
      )}
    </div>
  );
}

// ── Recordings table ──────────────────────────────────────────────────────────
function RecordingsTable({
  rows, loading, emptyHint, playingId, deletingId, onPlay, onDelete,
}: {
  rows: RecordingRow[];
  loading: boolean;
  emptyHint: string;
  playingId: string | null;
  deletingId: string | null;
  onPlay: (r: RecordingRow) => void;
  onDelete: (r: RecordingRow) => void;
}) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 22px', borderBottom: '1px solid var(--border)',
        }}
      >
        <h3 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)', margin: 0 }}>
          {rows.length} recording{rows.length === 1 ? '' : 's'}
        </h3>
      </div>

      {loading && rows.length === 0 ? (
        <div style={{ padding: 24, color: 'var(--text-3)', fontSize: 13 }}>Loading…</div>
      ) : rows.length === 0 ? (
        <div style={{ padding: 24, color: 'var(--text-3)', fontSize: 13 }}>{emptyHint}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Agent', 'Captured', 'Duration', 'Size', 'Language', 'Transcript', ''].map((h, i) => (
                <th
                  key={h || `c${i}`}
                  style={{
                    textAlign: i === 6 ? 'right' : 'left',
                    padding: '12px 22px',
                    color: 'var(--text-3)',
                    fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
                    fontWeight: 500,
                    background: 'var(--surface-soft)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const isPlaying = playingId === r.recording_id;
              return (
                <tr key={r.recording_id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px 22px' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-1)' }}>{r.agent_name || '—'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
                      {(r.use_case_slug && SLUG_LABEL[r.use_case_slug]) || r.use_case_slug || ''}
                    </div>
                  </td>
                  <td style={{ padding: '14px 22px', color: 'var(--text-2)', fontSize: 12.5 }}>
                    {formatTime(r.created_at)}
                  </td>
                  <td style={{ padding: '14px 22px', color: 'var(--text-2)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5 }}>
                    {formatDuration(r.duration_ms)}
                  </td>
                  <td style={{ padding: '14px 22px', color: 'var(--text-2)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5 }}>
                    {formatSize(r.size_bytes)}
                  </td>
                  <td style={{ padding: '14px 22px' }}>
                    <span
                      style={{
                        fontSize: 10.5, padding: '2px 8px', borderRadius: 99,
                        background: 'var(--tint-2)', color: 'var(--text-2)',
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                      }}
                    >
                      {(r.language_code || 'en').toUpperCase()}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '14px 22px', color: 'var(--text-3)',
                      fontSize: 12, maxWidth: 320,
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}
                    title={r.transcript || ''}
                  >
                    {r.transcript || <em>(no transcript)</em>}
                  </td>
                  <td style={{ padding: '14px 22px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      <button
                        onClick={() => onPlay(r)}
                        disabled={!r.signed_url}
                        title={r.signed_url ? (isPlaying ? 'Pause' : 'Play recording') : 'Stored locally on backend (no signed URL)'}
                        style={{
                          width: 30, height: 30, borderRadius: 8,
                          background: isPlaying ? 'rgba(76,175,80,0.18)' : 'transparent',
                          border: `1px solid ${isPlaying ? 'var(--green)' : 'var(--border)'}`,
                          color: isPlaying ? 'var(--green)' : 'var(--text-2)',
                          cursor: r.signed_url ? 'pointer' : 'not-allowed',
                          opacity: r.signed_url ? 1 : 0.4,
                          display: 'inline-grid', placeItems: 'center',
                        }}
                      >
                        <Icon name={isPlaying ? 'pause' : 'play'} size={12} />
                      </button>
                      <button
                        onClick={() => onDelete(r)}
                        disabled={deletingId === r.recording_id}
                        title="Delete recording"
                        aria-label="Delete recording"
                        style={{
                          width: 30, height: 30, borderRadius: 8,
                          background: deletingId === r.recording_id ? 'rgba(255,90,120,0.15)' : 'transparent',
                          border: '1px solid var(--border)',
                          color: deletingId === r.recording_id ? 'var(--red)' : 'var(--text-2)',
                          cursor: deletingId === r.recording_id ? 'wait' : 'pointer',
                          display: 'inline-grid', placeItems: 'center',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          if (deletingId !== r.recording_id) {
                            e.currentTarget.style.background = 'rgba(255,90,120,0.1)';
                            e.currentTarget.style.borderColor = 'rgba(255,90,120,0.4)';
                            e.currentTarget.style.color = 'var(--red)';
                          }
                        }}
                        onMouseLeave={e => {
                          if (deletingId !== r.recording_id) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.borderColor = 'var(--border)';
                            e.currentTarget.style.color = 'var(--text-2)';
                          }
                        }}
                      >
                        <Icon name={deletingId === r.recording_id ? 'refresh' : 'x'} size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ── Agents overview ───────────────────────────────────────────────────────────
function AgentsTable({ agents, loading }: { agents: Agent[]; loading: boolean }) {
  if (loading && agents.length === 0) {
    return <div style={{ padding: 24, color: 'var(--text-3)', fontSize: 13 }}>Loading…</div>;
  }
  if (agents.length === 0) {
    return <div style={{ padding: 24, color: 'var(--text-3)', fontSize: 13 }}>No agents on this account yet.</div>;
  }
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    >
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {['Name', 'Use case', 'Status', 'Direction', 'Created'].map(h => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '12px 22px',
                  color: 'var(--text-3)',
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em',
                  fontWeight: 500,
                  background: 'var(--surface-soft)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {agents.map(a => (
            <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '14px 22px', fontWeight: 500, color: 'var(--text-1)' }}>{a.name}</td>
              <td style={{ padding: '14px 22px', color: 'var(--text-2)' }}>
                {SLUG_LABEL[a.use_case_slug] || a.use_case_slug}
              </td>
              <td style={{ padding: '14px 22px' }}>
                <span
                  style={{
                    fontSize: 10.5, padding: '2px 8px', borderRadius: 99,
                    background: 'var(--tint-2)', color: 'var(--text-2)',
                    fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em',
                  }}
                >
                  {a.agent_flow_status.replace(/_/g, ' ')}
                </span>
              </td>
              <td style={{ padding: '14px 22px', color: 'var(--text-2)' }}>{a.call_direction}</td>
              <td style={{ padding: '14px 22px', color: 'var(--text-3)' }}>
                {a.created_at ? new Date(a.created_at).toLocaleDateString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
