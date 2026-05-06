import { api } from './client';

export interface Language {
  id: number;
  code: string;
  name: string;
  stt_provider: string;
  tts_provider: string;
}

export interface Voice {
  id: number;
  language_id: number;
  language_code: string | null;
  language_name: string | null;
  provider: string;
  provider_voice_id: string;
  display_name: string;
  gender: string | null;
  accent: string | null;
  age: string | null;
  sample_url: string | null;
}

let _langCache: Language[] | null = null;

export async function listLanguages(): Promise<Language[]> {
  if (_langCache) return _langCache;
  // Languages are public-ish but the backend requires auth on most routes;
  // GET /v1/languages doesn't, but we send the JWT anyway for consistency.
  const list = await api<Language[]>('/v1/languages');
  _langCache = list;
  return list;
}

export async function voicesFor(code: string): Promise<Voice[]> {
  return api<Voice[]>(`/v1/languages/${encodeURIComponent(code)}/voices`);
}
