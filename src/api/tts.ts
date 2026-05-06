import { API_BASE, getToken, ApiError } from './client';

/**
 * Server-side TTS — returns an MP3 Blob the browser can play via a normal
 * <audio> element or `new Audio(blobUrl)`. Routes to ElevenLabs by default
 * (multilingual: Tamil/Hindi/Telugu/etc.) so it works without the user
 * having any voices installed locally.
 */
export async function synthesize(args: {
  text: string;
  language_code?: string;
  voice_id?: string;
  provider?: 'elevenlabs' | 'deepgram';
  signal?: AbortSignal;
}): Promise<Blob> {
  const { signal, ...body } = args;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/v1/tts/speak`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok) {
    let detail: any;
    try { detail = await res.json(); } catch { detail = await res.text(); }
    throw new ApiError(res.status, detail);
  }

  return res.blob();
}
