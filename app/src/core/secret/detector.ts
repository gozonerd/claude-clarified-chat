import type { Event } from '../../schemas/event';
import type { Detection, SecretPattern } from './types';

type RegexEntry = { readonly pattern: SecretPattern; readonly regex: RegExp };

// Order matters: anthropic (sk-ant-...) MUST be checked before openai (sk-...)
// because the openai regex would otherwise match anthropic keys.
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
  if (match.length <= PREVIEW_KEEP * 2) return '***';
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
        const overlaps = claimed.some(c => !(end <= c.start || start >= c.end));
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
    // JSON.stringify handles serializable objects
    const json = JSON.stringify(content);
    return json;
  } catch {
    // On circular reference or other stringify error, use Object.prototype.toString
    // which is safe for any type
    return Object.prototype.toString.call(content);
  }
}
