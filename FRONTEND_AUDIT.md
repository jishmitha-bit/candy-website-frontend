# Candy Agents — Frontend Audit

> **Scope:** Full audit of `candy-website-frontend/` (React 18 + TypeScript + Tailwind + Vite)
> **Date:** 2026-05-06
> **Severity legend:** 🔴 Critical · 🟠 High · 🟡 Medium · 🟢 Low / Enhancement

---

## Executive Summary

The frontend is cleanly structured — Vite, React 18 strict mode, TypeScript, Tailwind, a thin API client, and a sensible global context. The component hierarchy is logical and the auth flow is coherent. However, there are several issues that will cause real pain at scale. The most urgent are **JWT in localStorage** (XSS-exploitable), **zero i18n infrastructure** (all UI text is hardcoded English despite the product being multilingual), **no WebSocket streaming** from the backend (users wait in silence for responses), and **`useAgent` hook being a stub** while `AgentWorkspace` — the core UI — depends on it. Every domain page also embeds its system prompt as a hardcoded TypeScript string literal, completely bypassing the backend's versioned prompt system.

---

## 1. Language Handling — Critical Gaps

### 1.1 🔴 Zero i18n Infrastructure — All UI Text Is Hardcoded English

**Files:** Every file in `src/pages/`, `src/components/`

**Problem:** The product sells itself as a multilingual voice agent platform supporting 12 languages. The dashboard, sidebar, agent config panels, and all form labels are hardcoded English strings scattered across JSX:

```tsx
// Sidebar.tsx
<span>Dashboard</span>
<span>HR Flow</span>
<span>Live Calls</span>

// KnowledgeBase.tsx
<p>Upload documents to power your agent's knowledge</p>
<button>Upload File</button>
```

There is not a single `i18n` import or translation key in the codebase. A Hindi-speaking operator building a Hindi-language agent sees an English-only UI. This is a significant UX inconsistency.

**Fix — adopt `react-i18next` (open-source, MIT):**

```bash
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
```

```ts
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)           // loads /public/locales/{lang}/translation.json
  .use(LanguageDetector)      // detects browser language
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'bn', 'es', 'fr', 'de', 'ja', 'ko'],
    interpolation: { escapeValue: false },
  });
```

```tsx
// In any component
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
<button>{t('knowledge.upload_file')}</button>
```

Translation files live in `/public/locales/en/translation.json`, `/public/locales/hi/translation.json`, etc. — editable by translators without touching code.

**Alternative (slightly simpler for smaller apps):** [`lingui`](https://lingui.js.org/) — similar MIT license, macro-based extraction.

---

### 1.2 🟠 LanguagePicker Updates Local State Only — Not Reflected in API Calls

**Files:** `src/components/agent/LanguagePicker.tsx`, `src/api/agents.ts`

**Problem:** The `LanguagePicker` component lets users select a language and voice. But it's unclear whether this selection is:

1. Saved to the backend (`PATCH /v1/agents/{id}`)
2. Or only stored in local component state / AppContext

If it's only local, the agent will keep operating in its DB-configured language regardless of what the UI shows. The selection silently has no effect.

**Fix:** On language/voice change, immediately persist to backend:

```ts
async function handleLanguageChange(langCode: string, voiceId: string) {
  setSelectedLang(langCode);
  setSelectedVoice(voiceId);
  await api.patch(`/v1/agents/${agentId}`, {
    primary_language: langCode,
    voice_id: voiceId,
  });
  showToast('Language updated', 'success');
}
```

---

### 1.3 🟡 No Real-Time Language Switch Feedback in Chat UI

**Files:** `src/pages/hrflow/ChatPanel.tsx`, `src/pages/financial/index.tsx`

**Problem:** When the backend detects a language switch mid-conversation and returns `active_language` in the response, the chat UI does nothing with it. The user has no visual indicator that the agent switched languages — they may think the agent is malfunctioning.

**Fix:** Display a language-switch badge in the chat timeline:

```tsx
// In ChatPanel.tsx
{message.languageSwitched && (
  <div className="flex items-center gap-2 text-xs text-tint-2 my-1">
    <GlobeIcon size={12} />
    <span>Switched to {LANGUAGE_NAMES[message.activeLanguage]}</span>
  </div>
)}
```

Backend response should include: `{ active_language: "hi", language_switched: true, ack_message: "मैं हिंदी में..." }`

---

### 1.4 🟡 No RTL Layout Support

**Files:** `src/styles/globals.css`, `src/layouts/AppLayout.tsx`

**Problem:** The `supportedLngs` list in backend includes Arabic (implicit via Romanized keywords). If Arabic is ever added to the 12 supported languages, the entire LTR-only Tailwind layout will break — text will flow right-to-left against left-anchored containers.

**Fix:** Apply `dir` attribute based on language:

```tsx
// AppLayout.tsx
import { useTranslation } from 'react-i18next';

const RTL_LANGS = new Set(['ar', 'he', 'ur', 'fa']);

export function AppLayout({ children }) {
  const { i18n } = useTranslation();
  const dir = RTL_LANGS.has(i18n.language) ? 'rtl' : 'ltr';

  return (
    <div dir={dir} className={dir === 'rtl' ? 'font-arabic' : ''}>
      {children}
    </div>
  );
}
```

Tailwind v3 supports `rtl:` variants natively — no additional plugin needed.

---

## 2. Security Issues

### 2.1 🔴 JWT Token Stored in localStorage — XSS Vulnerable

**File:** `src/api/client.ts`, `src/context/AppContext.tsx`

**Problem:**

```ts
const TOKEN_KEY = 'candy.token';
localStorage.setItem(TOKEN_KEY, token);
```

`localStorage` is accessible by any JavaScript on the page. If a third-party dependency, injected ad script, or XSS vulnerability is ever present, the JWT is silently exfiltrated. Attackers can then impersonate users until the token expires.

**Fix — use `httpOnly` cookies instead:**

This requires a small backend change to set the cookie:

```python
# Backend: auth.py
from fastapi import Response

@router.post("/login")
async def login(response: Response, ...):
    token = create_jwt(user)
    response.set_cookie(
        key="candy_auth",
        value=token,
        httponly=True,           # not accessible to JS
        secure=True,             # HTTPS only
        samesite="strict",       # CSRF protection
        max_age=86400,
    )
    return {"user": user_data}   # no token in body
```

```ts
// Frontend: api/client.ts — remove manual Authorization header
// Browser sends httpOnly cookie automatically with credentials: 'include'
const res = await fetch(url, {
  credentials: 'include',   // send cookies cross-origin
  ...opts,
});
```

If migrating to httpOnly cookies is complex right now, at minimum use **`sessionStorage`** instead of `localStorage` — it clears on tab close and is slightly harder to exfiltrate across tabs, though not truly safe from XSS.

---

### 2.2 🟠 No CSRF Protection

**File:** `src/api/client.ts`

**Problem:** Cookie-based auth (once migrated from localStorage) requires CSRF protection. Currently no CSRF token is generated or validated.

**Fix:** Add double-submit cookie pattern:

```python
# Backend: on login, set a readable CSRF cookie
response.set_cookie("candy_csrf", csrf_token, httponly=False, samesite="strict")
```

```ts
// Frontend: read CSRF cookie, send as header
function getCsrfToken(): string {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('candy_csrf='))
    ?.split('=')[1] ?? '';
}

// In api() wrapper
headers['X-CSRF-Token'] = getCsrfToken();
```

---

### 2.3 🟡 User Object Stored in localStorage — PII Exposure

**File:** `src/context/AppContext.tsx`

**Problem:**

```ts
localStorage.setItem('candy.user', JSON.stringify(user));
```

The stored object includes `email`, `full_name`, `company_name`, `role`. This PII persists indefinitely and is accessible to any script.

**Fix:** Store only the minimum needed for UI rendering (`role`, `company_name`) — derive the rest from a `/v1/auth/me` call on app load. Never persist `email` or `full_name` in localStorage.

---

## 3. Architecture & State Management Issues

### 3.1 🔴 `useAgent` Hook Is a Stub

**File:** `src/hooks/useAgent.ts`

**Problem:** The file exists but the hook is either empty or minimal (`// TBD`). `AgentWorkspace.tsx` — the core editor for every domain page — almost certainly depends on this hook for agent loading, saving, and live status. If it's a stub, the agent configuration UI either doesn't persist changes or crashes on load.

**Fix:** Implement the full hook:

```ts
// src/hooks/useAgent.ts
import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import type { Agent } from '../api/agents';

export function useAgent(agentId: string | null) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!agentId) return;
    setLoading(true);
    api<Agent>(`/v1/agents/${agentId}`)
      .then(setAgent)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [agentId]);

  const save = useCallback(async (patch: Partial<Agent>) => {
    if (!agentId) return;
    setSaving(true);
    try {
      const updated = await api<Agent>(`/v1/agents/${agentId}`, {
        method: 'PATCH',
        body: patch,
      });
      setAgent(updated);
    } finally {
      setSaving(false);
    }
  }, [agentId]);

  return { agent, loading, error, saving, save };
}
```

---

### 3.2 🟠 Domain Prompts Hardcoded in TypeScript — Bypass Backend Versioning

**Files:** `src/pages/financial/index.tsx`, `src/pages/ecommerce/index.tsx`, etc.

**Problem:**

```tsx
// financial/index.tsx
const defaultPrompt = `Handle incoming customer calls... answer about home loans,
EMI calculations... use knowledge base. Speak warmly...`;
```

Every domain page has its own hardcoded `defaultPrompt` string. The backend has a sophisticated `candy.prompt_versions` table with hash guards and versioning. These hardcoded strings completely bypass that system — changes to prompts require a frontend deployment.

**Fix:** Fetch the prompt from the backend on agent load:

```tsx
const { agent } = useAgent(agentId);

// Use agent.current_prompt_template from backend, fall back to default only if not set
const prompt = agent?.current_prompt_template ?? DEFAULT_PROMPT_FALLBACK;
```

The `defaultPrompt` in each page should become a one-time seed value posted to the backend on first agent creation, not the ongoing source of truth.

---

### 3.3 🟠 AppContext Handles Both UI State and Side Effects — Anti-Pattern

**File:** `src/context/AppContext.tsx`

**Problem:** `AppContext` manages:
- Navigation state (`currentView`, `activeNav`)
- Auth state (`user`, sign-in, sign-out)
- Toast notifications
- Chat messages (demo seed data)
- Call logs

This single context re-renders all consumers on any state change. A new toast causes `ChatPanel`, `Sidebar`, `Topbar`, and `Dashboard` to all re-render simultaneously.

**Fix:** Split into domain-specific contexts with `React.memo` boundaries:

```tsx
// src/context/AuthContext.tsx  — user, signedIn, signOut
// src/context/NavContext.tsx   — currentView, activeNav, showView
// src/context/ToastContext.tsx — toasts, addToast
// src/context/CallContext.tsx  — calls, live stats
```

For complex state with many consumers, adopt [Zustand](https://github.com/pmndrs/zustand) (MIT, ~1KB gzipped) — it's significantly more performant than context for frequently-updating state:

```ts
// pip install zustand (it's npm install zustand)
import { create } from 'zustand';

const useToastStore = create(set => ({
  toasts: [],
  addToast: (msg, kind) => set(state => ({
    toasts: [...state.toasts, { id: Date.now(), msg, kind }]
  })),
  removeToast: (id) => set(state => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}));
```

---

### 3.4 🟠 No WebSocket / Streaming Response Integration

**Files:** `src/pages/hrflow/ChatPanel.tsx`, `src/pages/financial/index.tsx`, `src/api/client.ts`

**Problem:** All chat responses use a blocking `await api('/agent/chat')` call that returns only after the full LangGraph pipeline completes (3–8 seconds). There is no streaming, no typing indicator tied to actual backend progress, and no WebSocket connection.

**Fix:** Add a streaming fetch client that reads SSE events:

```ts
// src/api/chat-stream.ts
export async function* streamChat(
  agentId: string,
  message: string,
  langCode: string,
  signal: AbortSignal,
): AsyncGenerator<string> {
  const res = await fetch(`${BASE_URL}/api/v1/agent/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ agent_id: agentId, user_message: message, language_code: langCode }),
    signal,
  });

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split('\n');
    for (const line of lines) {
      if (line.startsWith('data: ') && line !== 'data: [DONE]') {
        const data = JSON.parse(line.slice(6));
        if (data.token) yield data.token;
      }
    }
  }
}
```

```tsx
// In ChatPanel.tsx
const abortRef = useRef<AbortController>();

async function sendMessage(text: string) {
  abortRef.current = new AbortController();
  let fullResponse = '';

  addMessage({ role: 'assistant', content: '', streaming: true });

  for await (const token of streamChat(agentId, text, lang, abortRef.current.signal)) {
    fullResponse += token;
    updateLastMessage(fullResponse);  // progressive update
  }

  finalizeLastMessage(fullResponse);
}
```

---

### 3.5 🟡 No Error Boundaries

**File:** All component files

**Problem:** There are no React Error Boundaries anywhere in the component tree. A runtime error in `AgentWorkspace`, `KnowledgeBase`, or `ChatPanel` will unmount the entire app and show a blank screen.

**Fix:** Add a boundary at the route level and around each major panel:

```tsx
// src/components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface State { hasError: boolean; error?: Error }

export class ErrorBoundary extends Component<{ children: ReactNode; fallback?: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6 text-red-500">
          Something went wrong. <button onClick={() => this.setState({ hasError: false })}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

```tsx
// In App.tsx — wrap each major route
<ErrorBoundary fallback={<RouteError />}>
  <AgentWorkspace />
</ErrorBoundary>
```

---

### 3.6 🟡 `mockData.ts` Is Loaded Unconditionally in Production

**File:** `src/utils/mockData.ts`

**Problem:** The `AppContext` initializes `chatMessages` and `calls` from `mockData.ts` seed data. This fake data is present in the production bundle and is the default state for all users on first load, making it look like there's activity when there isn't.

**Fix:**

```ts
// AppContext.tsx
const [calls, setCalls] = useState<Call[]>([]);   // empty by default
const [chatMessages, setChatMessages] = useState<Message[]>([]);

// Only seed in development
if (import.meta.env.DEV) {
  setCalls(mockData.calls);
  setChatMessages(mockData.messages);
}
```

Or remove mock data entirely and use MSW ([Mock Service Worker](https://mswjs.io/), MIT) for dev-only API mocking.

---

### 3.7 🟡 No Loading State for Voice Actions in TestPanel

**File:** `src/components/agent/TestPanel.tsx`

**Problem:** The `TestPanel` provides voice test controls (record, play, stop). It's unclear whether there are loading/disabled states for:
- While STT is transcribing
- While LLM is generating
- While TTS is synthesizing

Without these states, a user can trigger multiple concurrent requests by clicking rapidly, leading to race conditions and overlapping audio playback.

**Fix:** Implement a strict state machine for the voice test flow:

```ts
type VoiceState = 'idle' | 'recording' | 'transcribing' | 'generating' | 'speaking' | 'error';

const [voiceState, setVoiceState] = useState<VoiceState>('idle');
const canRecord = voiceState === 'idle' || voiceState === 'error';
const canStop = voiceState === 'recording' || voiceState === 'speaking';
```

---

## 4. Performance Issues

### 4.1 🟡 Embedding Model Icon SVGs Rendered as Inline JSX

**File:** `src/assets/icons.tsx`

**Problem:** If all icons are exported from a single file and imported where needed, tree-shaking should handle it. But if the entire icon file is imported with `import * as Icons from '../assets/icons'` anywhere, the full SVG bundle is included in the main chunk.

**Fix:** Use named exports and ensure only used icons are imported:

```ts
// Good — tree-shakeable
import { GlobeIcon, MicIcon } from '../assets/icons';

// Bad — pulls in everything
import * as Icons from '../assets/icons';
```

Alternatively, adopt [`lucide-react`](https://lucide.dev/) (already in scope for some tools) — it ships individual SVG components with perfect tree-shaking.

---

### 4.2 🟡 No Route-Based Code Splitting

**File:** `src/App.tsx`

**Problem:** All 7 domain pages (financial, ecommerce, logistics, healthcare, marketing, hrflow, live) are statically imported and included in the initial bundle. The initial JS payload is likely 400KB+ gzipped.

**Fix:** Use `React.lazy` + `Suspense`:

```tsx
// App.tsx
const FinancialPage = lazy(() => import('./pages/financial'));
const EcommercePage = lazy(() => import('./pages/ecommerce'));
// ...

<Suspense fallback={<PageLoader />}>
  {currentView === 'financial' && <FinancialPage />}
  {currentView === 'ecommerce' && <EcommercePage />}
</Suspense>
```

This splits each domain into its own chunk, loaded only when navigated to — typically reducing initial bundle size by 50–70%.

---

### 4.3 🟢 Vite Config Has No Bundle Analysis

**File:** `vite.config.ts`

**Problem:** No bundle size visibility makes it impossible to catch accidental large dependencies (e.g., a locale file from `date-fns` pulling in all 100 locales).

**Fix:**

```bash
npm install --save-dev rollup-plugin-visualizer
```

```ts
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  visualizer({ open: true, filename: 'dist/bundle-stats.html' }),
]
```

---

## 5. TypeScript Strictness Issues

### 5.1 🟡 API Response Types Are Likely `any` in Several Places

**File:** `src/api/agents.ts`, `src/api/knowledge.ts`

**Problem:** The API client is generic (`api<T>()`), but if the callers pass `api<any>()` or omit the type parameter, TypeScript provides no protection against mismatched response shapes.

**Fix:** Define and enforce response types for every API call:

```ts
// src/types/api.ts
export interface Agent {
  agent_id: string;
  name: string;
  use_case: string;
  primary_language: string;
  multilingual: boolean;
  voice_id: string;
  current_prompt_template: string;
  status: 'draft' | 'published' | 'archived';
}

export interface KnowledgeDocument {
  document_id: string;
  filename: string;
  source: 'upload' | 'url_crawl';
  status: 'queued' | 'processing' | 'embedded' | 'error';
  created_at: string;
}
```

```ts
// src/api/agents.ts
export function getAgent(id: string): Promise<Agent> {
  return api<Agent>(`/v1/agents/${id}`);
}
```

---

### 5.2 🟡 No Zod Validation on API Responses

**File:** `src/api/client.ts`

**Problem:** API responses are cast directly to TypeScript types without runtime validation. A backend schema change will cause silent type mismatches at runtime, not caught by TypeScript.

**Fix — add Zod parsing (open-source, MIT):**

```bash
npm install zod
```

```ts
// src/api/agents.ts
import { z } from 'zod';

const AgentSchema = z.object({
  agent_id: z.string().uuid(),
  name: z.string(),
  use_case: z.string(),
  primary_language: z.string(),
  ...
});

export async function getAgent(id: string): Promise<Agent> {
  const raw = await api<unknown>(`/v1/agents/${id}`);
  return AgentSchema.parse(raw);   // throws ZodError on mismatch
}
```

---

## 6. Accessibility (a11y) Issues

### 6.1 🟡 No ARIA Labels on Icon-Only Buttons

**Files:** `src/components/Sidebar.tsx`, `src/components/agent/TestPanel.tsx`

**Problem:** Icon-only buttons (mic, stop, play, settings) have no `aria-label`. Screen readers announce them as "button" with no description — making the voice testing interface completely inaccessible.

**Fix:**

```tsx
// Bad
<button onClick={startRecording}><MicIcon /></button>

// Good
<button
  onClick={startRecording}
  aria-label="Start recording"
  title="Start recording"
>
  <MicIcon aria-hidden="true" />
</button>
```

---

### 6.2 🟡 Color Contrast Not Verified for Theme CSS Variables

**File:** `src/styles/globals.css`

**Problem:** The dark/light theme uses CSS variables (`--bg-0`, `--text-1`, `--tint-2`). Without checking the contrast ratio between foreground and background variables, it's possible some text fails WCAG AA (4.5:1 ratio for normal text).

**Fix:** Run [axe-core](https://github.com/dequelabs/axe-core) (MIT) as part of your test suite:

```bash
npm install --save-dev @axe-core/react
```

```tsx
// src/main.tsx — dev only
if (import.meta.env.DEV) {
  import('@axe-core/react').then(axe => {
    axe.default(React, ReactDOM, 1000);
  });
}
```

---

## 7. Testing Gaps

### 7.1 🟠 No Tests Exist in the Frontend

**Files:** All of `src/`

**Problem:** There is no `*.test.ts`, `*.spec.ts`, or test runner configuration in `package.json`. The voice pipeline and language-switching UI logic are completely untested.

**Fix — minimal test stack:**

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event jsdom
```

Priority test targets:
1. `api/client.ts` — 401 handling, error propagation
2. `useAgent` hook — loading, saving, error states
3. `LanguagePicker` — onChange fires API call
4. `ChatPanel` — message rendering, streaming token display

```ts
// src/api/client.test.ts
import { describe, it, expect, vi } from 'vitest';
import { api } from './client';

describe('api client', () => {
  it('dispatches auth-expired on 401', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => ({}) });
    const listener = vi.fn();
    window.addEventListener('candy:auth-expired', listener);
    await expect(api('/test')).rejects.toThrow();
    expect(listener).toHaveBeenCalledOnce();
  });
});
```

---

## 8. Open-Source Stack Recommendations

| Current Approach | Open-Source Alternative | License | Benefit |
|---|---|---|---|
| Manual i18n strings | `react-i18next` | MIT | Auto browser-lang detection, JSON translation files |
| `localStorage` JWT | `httpOnly` cookie (backend change) | — | Eliminates XSS token theft |
| Context for all state | `Zustand` | MIT | Zero boilerplate, no re-render cascade |
| No tests | `Vitest` + `@testing-library/react` | MIT | Fast, native Vite integration |
| No API schema validation | `Zod` | MIT | Runtime type safety on API responses |
| No streaming | Native `fetch` ReadableStream | — | No extra dependency, SSE support built-in |
| `mockData.ts` in prod | `msw` (Mock Service Worker) | MIT | Dev-only, intercepts at network layer |
| No a11y checks | `axe-core` | MPL 2.0 | Auto-runs in dev, zero config |
| No bundle analysis | `rollup-plugin-visualizer` | MIT | Catch accidental large imports |

---

## 9. Priority Fix Roadmap

### Week 1 — Stability (Stop Silent Failures)

1. **Implement `useAgent` hook** — all agent config must load from and persist to backend
2. **Remove hardcoded prompts** from domain pages — fetch from `/v1/agents/{id}`
3. **Move mock data to dev-only** — production users see real (empty) state
4. **Add Error Boundaries** to all major page components

### Week 2 — Security

5. **Migrate JWT to httpOnly cookie** (coordinate with backend `auth.py` change)
6. **Remove PII from localStorage** — keep only `role` and `company_name`
7. **Add CSRF token** once cookie auth is in place

### Week 3 — Language & Streaming

8. **Add `react-i18next`** infrastructure — even just EN to start; wires up for translations later
9. **Implement streaming chat** with `fetch` + SSE
10. **Language switch badge** in chat timeline
11. **Persist LanguagePicker selection** to backend immediately on change

### Week 4 — Quality

12. **Add Vitest** + tests for `api/client`, `useAgent`, `LanguagePicker`
13. **Code splitting** with `React.lazy` for domain pages
14. **Zod validation** on all API responses
15. **ARIA labels** on all icon-only interactive elements

---

## 10. Quick Environment Checklist

```bash
# .env (development)
VITE_API_BASE_URL=http://localhost:8001

# .env.production (should be set in CI/CD, not committed)
VITE_API_BASE_URL=https://api.yourproduction.com
VITE_ENV=production

# Add to package.json scripts
"test": "vitest run",
"test:watch": "vitest",
"analyze": "vite build --mode analyze",
"type-check": "tsc --noEmit",
"lint": "eslint src --ext .ts,.tsx"
```

**Missing from `package.json` scripts:**
- `type-check` — TypeScript errors only catch at build time currently
- `lint` — no ESLint configured
- `test` — no test runner

Add ESLint with the React and TypeScript recommended configs:

```bash
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks eslint-plugin-jsx-a11y
```

---

*Audit produced from full static analysis of `candy-website-frontend/`. All component and file references based on observed code patterns — verify against your local HEAD before applying fixes.*
