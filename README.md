# Candy — Voice Agent Dashboard

A dark, galaxy-themed voice agent management platform built for HR teams and customer service operations. Built with React, Vite, TypeScript, and Tailwind CSS.

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| Vite | 5.4 | Dev server & bundler |
| TypeScript | 5.5 | Type safety |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router | 6.26 | Client-side routing |
| Zustand | 4.5 | Global state management |
| Recharts | 2.12 | Charts & data visualisation |
| Lucide React | 0.447 | Icon library |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Clone the repo
git clone <your-repo-url>
cd metaspace

# Install dependencies
npm install

# Start the dev server
npm run dev
```

App runs at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output goes to `dist/`. Preview the production build with:

```bash
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx       # Auth guard + layout wrapper
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   └── Topbar.tsx         # Top header with breadcrumbs & search
│   └── ui/
│       ├── Badge.tsx          # Status & nav badges
│       ├── Toast.tsx          # Toast notification system
│       └── Toggle.tsx         # On/off toggle component
├── data/
│   └── mockData.ts            # All mock data (calls, agents, charts)
├── pages/
│   ├── AuthPage.tsx           # Login screen
│   ├── DashboardPage.tsx      # Main overview page
│   ├── VoiceAgentsPage.tsx    # AI chat + live campaign panel
│   ├── LiveCallsPage.tsx      # Real-time call log (auto-updates)
│   ├── AnalyticsPage.tsx      # Charts & KPI metrics
│   ├── DataPage.tsx           # Contact dataset management
│   └── SettingsPage.tsx       # Profile, workspace, API, security
├── store/
│   └── useAppStore.ts         # Zustand global store
├── types/
│   └── index.ts               # Shared TypeScript types
├── App.tsx                    # Route definitions
├── main.tsx                   # App entry point
└── index.css                  # Global styles & Tailwind config
```

---

## Pages Overview

### Dashboard
The main landing page after login. Shows KPI stats (calls, success rate, active workflows), an AI prompt bar, voice agent cards by category, recent activity feed, and quick action shortcuts.

### AI Agent Chat (`/app/voice-agents`)
A split-panel view with a live AI chat interface on the left and the active campaign controls on the right. Includes file upload preview, a progress bar tracking calls initiated, and the screening script editor.

### Live Calls (`/app/live`)
A real-time call log that simulates live campaign activity — call statuses update automatically every 2.5 seconds. Includes filter tabs, live stats, and per-row actions (play recording, view transcript, more options).

### Analytics (`/app/analytics`)
Area chart for calls over time, pie chart for call outcomes, bar chart for agent type usage, and a usage limits panel showing credit consumption against plan limits.

### Data (`/app/data`)
Dataset management page for uploading and organising contact lists. Supports Excel (.xlsx) and CSV formats. Table shows dataset name, row count, status (active / processing / error), upload time, and file size.

### Settings (`/app/settings`)
Tabbed settings panel covering: Profile, Workspace, Usage & Limits, Voice Configuration (voice type selector), API & Webhooks (key reveal + copy), and Security (2FA toggle, session management).

---


---

## State Management

Zustand manages global app state in `src/store/useAppStore.ts`:

- `isAuthenticated` — controls the auth guard in `AppShell`
- `calls` — live call log array (updated by the ticker in `LiveCallsPage`)
- `chatMessages` — AI chat history (persists across navigation)
- `toasts` — notification queue

> **Note:** State is in-memory only and resets on full page reload. There is no backend or persistence layer — all data is mock.

---

## Authentication

The login screen accepts any email/password combination. On submit it sets `isAuthenticated: true` in the Zustand store and redirects to `/app/dashboard`. The `AppShell` component watches this flag and redirects unauthenticated users back to `/auth`.

---

## License

Private — SpaceMarvel AI. All rights reserved.
