/**
 * KnowledgeBase — drag-and-drop or click-to-upload widget.
 *
 * The "parse" step is simulated locally — files added to React state with
 * a fake KB / 248-row count. Wire this to your real ingestion pipeline by
 * replacing the addFiles() body.
 */
import { useState, useRef } from 'react';
import Icon from '../../assets/icons';

const tintColor = {
  purple: 'var(--purple-hi)', blue: 'var(--blue)', teal: 'var(--teal)',
  green: 'var(--green)', amber: 'var(--amber)', pink: 'var(--pink)',
};

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function KnowledgeBase({ tint = 'purple' }) {
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  function addFiles(list) {
    if (!list || list.length === 0) return;
    const next = Array.from(list).map(f => ({
      id: `${Date.now()}-${f.name}`,
      name: f.name,
      size: f.size,
      status: 'parsing',
    }));
    setFiles(prev => [...prev, ...next]);

    // Simulate parse → indexed transition
    next.forEach((f, i) => {
      setTimeout(() => {
        setFiles(prev =>
          prev.map(x =>
            x.id === f.id ? { ...x, status: 'indexed' } : x
          )
        );
      }, 700 + i * 250);
    });
  }

  function removeFile(id) {
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  return (
    <section style={section}>
      <header style={sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon name="layers" size={16} style={{ color: tintColor[tint] }} />
          <h3 style={sectionTitle}>Knowledge base</h3>
        </div>
        <span style={pill}>{files.length} {files.length === 1 ? 'file' : 'files'}</span>
      </header>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        style={{
          ...dropZone,
          borderColor: dragOver ? tintColor[tint] : 'var(--border-strong)',
          background: dragOver ? 'var(--tint-2)' : 'var(--tint-1)',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.csv,.xlsx,.docx,.txt,.md"
          style={{ display: 'none' }}
          onChange={e => {
            addFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <Icon name="upload" size={22} style={{ color: tintColor[tint] }} />
        <div style={{ marginTop: 10, fontSize: 13.5, fontWeight: 500, color: 'var(--text-1)' }}>
          Drop files or click to upload
        </div>
        <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-3)' }}>
          PDF · CSV · XLSX · DOCX · TXT — up to 25 MB each
        </div>
      </div>

      {files.length > 0 && (
        <ul style={fileList}>
          {files.map(f => (
            <li key={f.id} style={fileRow}>
              <div
                style={{
                  width: 30, height: 30, borderRadius: 7,
                  background: 'var(--tint-2)',
                  display: 'grid', placeItems: 'center',
                  color: f.status === 'indexed' ? 'var(--green)' : tintColor[tint],
                  flexShrink: 0,
                }}
              >
                <Icon name="file" size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text-1)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {f.name}
                </div>
                <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 2 }}>
                  {formatSize(f.size)} · {f.status === 'indexed' ? 'Indexed' : 'Parsing…'}
                </div>
              </div>
              <button
                onClick={() => removeFile(f.id)}
                aria-label="Remove file"
                style={{
                  width: 26, height: 26, borderRadius: 6,
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text-3)',
                  display: 'grid', placeItems: 'center',
                  cursor: 'pointer', flexShrink: 0,
                }}
              >
                <Icon name="x" size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const section = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  padding: 22,
};
const sectionHeader = {
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  marginBottom: 16,
};
const sectionTitle = { fontSize: 14, fontWeight: 600, color: 'var(--text-1)', margin: 0 };
const pill = {
  fontSize: 11, fontWeight: 500, color: 'var(--text-3)',
  padding: '3px 8px', borderRadius: 99,
  background: 'var(--tint-1)', border: '1px solid var(--border)',
};
const dropZone = {
  cursor: 'pointer',
  borderRadius: 12,
  border: '1.5px dashed var(--border-strong)',
  padding: '32px 24px',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  textAlign: 'center',
  transition: 'all 0.15s ease',
};
const fileList = {
  listStyle: 'none', padding: 0, margin: '14px 0 0',
  display: 'flex', flexDirection: 'column', gap: 8,
};
const fileRow = {
  display: 'flex', alignItems: 'center', gap: 12,
  padding: '10px 12px',
  background: 'var(--tint-1)',
  border: '1px solid var(--border)',
  borderRadius: 9,
};
