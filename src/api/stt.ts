import { API_BASE, getToken, ApiError } from './client';

/** Build the WebSocket URL for /v1/stt/stream, swapping http(s) → ws(s). */
export function streamUrl(language: string = 'multi'): string {
  const ws = API_BASE.replace(/^http/, 'ws');
  const qs = new URLSearchParams({ language });
  const tok = getToken();
  if (tok) qs.set('token', tok);   // server doesn't require auth, but we
                                   // include the token in case it's wrapped
                                   // behind require_any later.
  return `${ws}/v1/stt/stream?${qs.toString()}`;
}

export interface TranscribeOut {
  transcript: string;
  detected_language: string | null;
  confidence: number | null;
  duration_ms: number;
}

/**
 * Send a recorded audio Blob to the backend for transcription. Uses
 * Deepgram with `detect_language=true` so the user can speak any
 * supported language and get the right transcript without pre-selecting.
 */
export async function transcribe(
  audio: Blob,
  language_code: string = 'multi',
): Promise<TranscribeOut> {
  const fd = new FormData();
  fd.append('audio', audio, 'utterance.webm');
  fd.append('language_code', language_code);

  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/v1/stt/transcribe`, {
    method:  'POST',
    headers,
    body:    fd,
  });

  if (!res.ok) {
    let detail: any;
    try { detail = await res.json(); } catch { detail = await res.text(); }
    throw new ApiError(res.status, detail);
  }
  return res.json();
}
