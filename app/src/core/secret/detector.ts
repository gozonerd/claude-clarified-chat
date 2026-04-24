import type { Event } from '../../schemas/event';
import type { Detection, SecretPattern } from './types';

type RegexEntry = { readonly pattern: SecretPattern; readonly regex: RegExp };

const PATTERNS: ReadonlyArray<RegexEntry> = [
  { pattern: 'anthropic', regex: /sk-ant-[A-Za-z0-9_-]{20,}/g },
  { pattern: 'openai', regex: /sk-[A-Za-z0-9]{32,}/g },
  { pattern: 'aws', regex: /AKIA[0-9A-Z]{16}/g },
  { pattern: 'jwt', regex: /eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g },
  { pattern: 'github-pat', regex: /gh[pousr]_[A-Za-z0-9]{36,}/g },
  { pattern: 'rsa-pem', regex: /-----BEGIN (RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/g },
  { pattern: 'password-kv', regex: /(?:password|passwd|pwd|secret|token|api[_-]?key)\s*[:=]\s*['"]?[A-Za-z0-9!@#$%^&*_-]{8,}/gi },
];

const PREVIEW_KEEP = 4;

function maskedPreview(match: string): string {
  return match.slice(0, PREVIEW_KEEP) + '***' + match.slice(-PREVIEW_KEEP);
}

export function scan(events: ReadonlyArray<Event>): Detection[] {
  const detections: Detection[] = [];
  for (const ev of events) {
    const haystack = stringify(ev.content);
    if (haystack === '') continue;
    const claimed: Array<{ start: number; end: number }> = [];
    for (const { pattern, regex } of PATTERNS) {
      const re = new RegExp(regex.source, regex.flags);
      let m: RegExpExecArray | null;
      while ((m = re.exec(haystack)) !== null) {
        const start = m.index;
        const end = m.index + m[0].length;
        let overlaps = false;
        for (const c of claimed) {
          if (!(end <= c.start || start >= c.end)) { overlaps = true; break; }
        }
        if (overlaps) continue;
        claimed.push({ start, end });
        detections.push({ eventId: ev.id, pattern, start, end, preview: maskedPreview(m[0]) });
      }
    }
  }
  return detections;
}

function stringify(content: unknown): string {
  if (typeof content === 'string') return content;
  if (content === null || content === undefined) return '';
  try {
    const json = JSON.stringify(content);
    // JSON.stringify can return undefined only for functions; filter them
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return json ?? '';
  } catch {
    // If JSON.stringify fails (e.g., circular reference), we can't stringify it
    return '';
  }
}
