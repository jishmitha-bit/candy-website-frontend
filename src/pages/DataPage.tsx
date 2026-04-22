import { useState } from 'react'
import {
  Upload, Search, Filter, Download, Plus, FileText, Database,
  Users, CheckCircle, Clock, AlertCircle, MoreHorizontal, Eye,
  Trash2, RefreshCw,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

const dataSources = [
  { id: 1, name: 'senior_frontend_candidates.xlsx', type: 'Excel', rows: 248, status: 'active', uploaded: '2 hours ago', size: '142 KB' },
  { id: 2, name: 'q1_customer_support_contacts.csv', type: 'CSV', rows: 1420, status: 'active', uploaded: '1 day ago', size: '890 KB' },
  { id: 3, name: 'hr_screening_batch_april.xlsx', type: 'Excel', rows: 95, status: 'processing', uploaded: '3 hours ago', size: '64 KB' },
  { id: 4, name: 'leads_march_export.csv', type: 'CSV', rows: 3102, status: 'active', uploaded: '5 days ago', size: '2.1 MB' },
  { id: 5, name: 'appointments_q1.xlsx', type: 'Excel', rows: 187, status: 'error', uploaded: '2 days ago', size: '112 KB' },
]

const stats = [
  { icon: Database, label: 'Total datasets', value: '12', delta: '+2 this week', color: '#7C3AED' },
  { icon: Users, label: 'Total contacts', value: '18,640', delta: '+1,420 today', color: '#A78BFA' },
  { icon: CheckCircle, label: 'Processed', value: '16,890', delta: '90.6% success', color: '#22D3EE' },
  { icon: Clock, label: 'Pending', value: '1,750', delta: 'In queue', color: '#F59E0B' },
]

const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
  processing: { label: 'Processing', color: '#22D3EE', bg: 'rgba(34,211,238,0.15)' },
  error: { label: 'Error', color: '#FF4560', bg: 'rgba(255,69,96,0.15)' },
}

export default function DataPage() {
  const addToast = useAppStore((s) => s.addToast)
  const [search, setSearch] = useState('')

  const filtered = dataSources.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fadeUp">
      <div className="mb-8">
        <p className="text-[11px] text-text-3 uppercase tracking-[0.2em] mb-2.5">Data · Management</p>
        <h1 className="text-[36px] font-bold tracking-[-0.025em] leading-[1.1] mb-3">
          Contact <em className="not-italic grad-text">data</em>
        </h1>
        <p className="text-text-3 text-[15px]">Manage your contact lists, imports, and data sources for voice campaigns.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className="relative rounded-[14px] border border-border px-5 py-[18px] overflow-hidden"
              style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(12px)' }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(circle at 100% 0%, ${s.color}15, transparent 60%)` }}
              />
              <div className="flex items-center gap-2 text-[12px] text-text-3 mb-2">
                <Icon className="w-3.5 h-3.5" strokeWidth={1.75} style={{ color: s.color }} />
                {s.label}
              </div>
              <div className="text-[26px] font-bold tracking-[-0.02em]">{s.value}</div>
              <div className="text-[11.5px] text-text-3 mt-1">{s.delta}</div>
            </div>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] border border-border-strong flex-1 max-w-[420px] transition-all focus-within:border-purple/40 focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.1)]"
          style={{ background: 'rgba(0,0,0,0.25)' }}
        >
          <Search className="w-3.5 h-3.5 text-text-3 shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search datasets…"
            className="flex-1 bg-transparent border-none outline-none text-text-1 text-[14px] placeholder:text-text-3"
          />
        </div>
        <button
          onClick={() => addToast('Filter — coming soon', 'info')}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-[10px] border border-border text-text-2 text-[13px] hover:text-text-1 hover:border-border-strong transition-all"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <Filter className="w-3.5 h-3.5" /> Filter
        </button>
        <button
          onClick={() => addToast('Export — coming soon', 'info')}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-[10px] border border-border text-text-2 text-[13px] hover:text-text-1 hover:border-border-strong transition-all"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <Download className="w-3.5 h-3.5" /> Export
        </button>
        <div className="flex-1" />
        <button
          onClick={() => addToast('Upload dataset — coming soon', 'info')}
          className="btn-brand flex items-center gap-2 px-4 py-2.5 rounded-[10px] text-[13px] font-semibold"
        >
          <Plus className="w-3.5 h-3.5" /> Upload dataset
        </button>
      </div>

      {/* Upload dropzone */}
      <div
        className="rounded-xl border-2 border-dashed border-border-strong p-8 mb-6 text-center transition-all hover:border-purple/40 cursor-pointer"
        style={{ background: 'rgba(14,8,32,0.4)' }}
        onClick={() => addToast('File upload — drag & drop coming soon', 'info')}
      >
        <div
          className="w-12 h-12 rounded-[14px] grid place-items-center mx-auto mb-3"
          style={{ background: 'rgba(124,58,237,0.14)' }}
        >
          <Upload className="w-5 h-5 text-purple-hi" />
        </div>
        <p className="text-[14px] font-medium text-text-1 mb-1">Drop files here or click to upload</p>
        <p className="text-[12.5px] text-text-3">Supports Excel (.xlsx), CSV, and Google Sheets exports · Max 50 MB</p>
      </div>

      {/* Dataset table */}
      <div
        className="rounded-lg border border-border overflow-hidden"
        style={{ background: 'rgba(14,8,32,0.65)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-[16px] font-semibold">Datasets</h3>
          <button
            onClick={() => addToast('Refreshing datasets…', 'info')}
            className="w-8 h-8 rounded-[8px] grid place-items-center border border-border text-text-2 hover:text-text-1 hover:border-border-strong transition-all"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-border" style={{ background: 'rgba(124,58,237,0.03)' }}>
              {['Name', 'Type', 'Rows', 'Status', 'Uploaded', 'Size', ''].map((h, i) => (
                <th key={i} className={`px-5 py-3 text-[12px] text-text-3 font-medium ${i === 6 ? 'text-right' : 'text-left'}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => {
              const sm = statusMeta[d.status]
              return (
                <tr key={d.id} className="border-b border-border hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-[8px] grid place-items-center shrink-0"
                        style={{ background: 'rgba(124,58,237,0.12)', color: '#A78BFA' }}
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[13.5px] font-medium text-text-1">{d.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px] font-mono text-text-3 px-2 py-0.5 rounded-[6px]" style={{ background: 'rgba(255,255,255,0.05)' }}>{d.type}</span>
                  </td>
                  <td className="px-5 py-3.5 text-[13.5px] font-semibold text-text-1">{d.rows.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold uppercase tracking-wider"
                      style={{ background: sm.bg, color: sm.color }}
                    >
                      {d.status === 'processing' && <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: sm.color }} />}
                      {d.status === 'error' && <AlertCircle className="w-3 h-3" />}
                      {sm.label}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-text-3">{d.uploaded}</td>
                  <td className="px-5 py-3.5 text-[13px] font-mono text-text-3">{d.size}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => addToast(`Previewing ${d.name}`, 'info')}
                        className="w-7 h-7 rounded-[6px] grid place-items-center text-text-3 hover:text-text-1 hover:bg-white/[0.06] transition-all"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => addToast(`Downloading ${d.name}`, 'info')}
                        className="w-7 h-7 rounded-[6px] grid place-items-center text-text-3 hover:text-text-1 hover:bg-white/[0.06] transition-all"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => addToast(`${d.name} deleted`, 'success')}
                        className="w-7 h-7 rounded-[6px] grid place-items-center text-text-3 hover:text-neon-red hover:bg-neon-red/[0.08] transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                      <button className="w-7 h-7 rounded-[6px] grid place-items-center text-text-3 hover:text-text-1 hover:bg-white/[0.06] transition-all">
                        <MoreHorizontal className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-3 text-[13.5px]">No datasets match your search.</div>
        )}
      </div>
    </div>
  )
}
