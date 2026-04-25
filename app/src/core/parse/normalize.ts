import type {
  ContentBlock,
  DisplayEvent,
  RawAssistantEvent,
  RawEvent,
  RawUserEvent,
} from '../../schemas/event';

// Normalize a raw Claude Desktop export event into 0..N flat DisplayEvents.
// Conversational events with array message.content flatten one block per row.
// Conversational events with string message.content map 1:1.
// Session-meta types (queue-operation, last-prompt, custom-title, attachment)
// and system events map 1:1, never filtered (filtering would re-create the
// F13 "counted-but-hidden" anti-pattern).
export function normalize(raw: RawEvent, sourcePath?: string): DisplayEvent[] {
  switch (raw.type) {
    case 'user':
      return normalizeUser(raw, sourcePath);
    case 'assistant':
      return normalizeAssistant(raw, sourcePath);
    case 'system':
      return [
        {
          id: raw.uuid,
          type: 'system',
          timestamp: raw.timestamp ?? '',
          content: extractSystemContent(raw),
          subagent_id: subagentIdOf(raw.parentUuid ?? null, raw.isSidechain ?? false),
          raw,
          source_path: sourcePath,
        },
      ];
    case 'queue-operation':
      return [
        {
          id: synthId('queue-operation', raw.sessionId, raw.timestamp, raw.operation),
          type: 'queue-operation',
          timestamp: raw.timestamp ?? '',
          content: { operation: raw.operation, body: raw.content ?? '' },
          raw,
          source_path: sourcePath,
        },
      ];
    case 'last-prompt':
      return [
        {
          id: synthId('last-prompt', raw.sessionId, undefined, raw.lastPrompt.slice(0, 16)),
          type: 'last-prompt',
          timestamp: '',
          content: raw.lastPrompt,
          raw,
          source_path: sourcePath,
        },
      ];
    case 'custom-title':
      return [
        {
          id: synthId('custom-title', raw.sessionId, undefined, raw.customTitle),
          type: 'custom-title',
          timestamp: '',
          content: raw.customTitle,
          raw,
          source_path: sourcePath,
        },
      ];
    case 'attachment':
      return [
        {
          id: raw.uuid,
          type: 'attachment',
          timestamp: raw.timestamp ?? '',
          content: raw.attachment,
          subagent_id: subagentIdOf(raw.parentUuid ?? null, raw.isSidechain ?? false),
          raw,
          source_path: sourcePath,
        },
      ];
  }
}

function normalizeUser(raw: RawUserEvent, sourcePath?: string): DisplayEvent[] {
  const sid = subagentIdOf(raw.parentUuid, raw.isSidechain);
  const content = raw.message.content;
  if (typeof content === 'string') {
    return [
      {
        id: raw.uuid,
        type: 'user',
        timestamp: raw.timestamp,
        content,
        subagent_id: sid,
        raw,
        source_path: sourcePath,
      },
    ];
  }
  const out: DisplayEvent[] = [];
  for (const [i, block] of content.entries()) {
    out.push(blockToDisplay(block, raw.uuid, raw.timestamp, sid, raw, sourcePath, i));
  }
  // Edge case: empty content array — emit a placeholder so the event is still visible
  if (out.length === 0) {
    out.push({
      id: raw.uuid,
      type: 'user',
      timestamp: raw.timestamp,
      content: '',
      subagent_id: sid,
      raw,
      source_path: sourcePath,
    });
  }
  return out;
}

function normalizeAssistant(
  raw: RawAssistantEvent,
  sourcePath?: string,
): DisplayEvent[] {
  const sid = subagentIdOf(raw.parentUuid, raw.isSidechain);
  const tokens = extractTokens(raw);
  const blocks = raw.message.content;
  const out: DisplayEvent[] = [];
  for (const [i, block] of blocks.entries()) {
    const ev = blockToDisplay(block, raw.uuid, raw.timestamp, sid, raw, sourcePath, i);
    // Attach token totals to the first block of each assistant message so the
    // token waterfall sums them once per message rather than once per block.
    if (i === 0 && tokens !== undefined) {
      out.push({ ...ev, tokens });
    } else {
      out.push(ev);
    }
  }
  if (out.length === 0) {
    out.push({
      id: raw.uuid,
      type: 'assistant',
      timestamp: raw.timestamp,
      content: '',
      subagent_id: sid,
      tokens,
      raw,
      source_path: sourcePath,
    });
  }
  return out;
}

function blockToDisplay(
  block: ContentBlock,
  parentUuid: string,
  timestamp: string,
  sid: string | undefined,
  raw: RawEvent,
  sourcePath: string | undefined,
  blockIdx: number,
): DisplayEvent {
  const id = `${parentUuid}#${String(blockIdx)}`;
  switch (block.type) {
    case 'text':
      return {
        id,
        type: raw.type === 'assistant' ? 'assistant' : 'user',
        timestamp,
        content: block.text,
        subagent_id: sid,
        raw: block,
        source_path: sourcePath,
      };
    case 'thinking':
      return {
        id,
        type: 'thinking',
        timestamp,
        content: block.thinking,
        subagent_id: sid,
        raw: block,
        source_path: sourcePath,
      };
    case 'tool_use':
      return {
        id,
        type: 'tool_use',
        timestamp,
        content: { name: block.name, input: block.input, tool_use_id: block.id },
        subagent_id: sid,
        raw: block,
        source_path: sourcePath,
      };
    case 'tool_result':
      return {
        id,
        type: 'tool_result',
        timestamp,
        content: { tool_use_id: block.tool_use_id, body: block.content, is_error: block.is_error ?? false },
        subagent_id: sid,
        raw: block,
        source_path: sourcePath,
      };
  }
}

function subagentIdOf(parentUuid: string | null, isSidechain: boolean): string | undefined {
  if (!isSidechain) return undefined;
  if (parentUuid === null) return undefined;
  return parentUuid;
}

function extractTokens(
  raw: RawAssistantEvent,
): { input: number; output: number } | undefined {
  const usage = raw.message.usage;
  if (usage === undefined || usage === null || typeof usage !== 'object') return undefined;
  const u = usage as Record<string, unknown>;
  const input = typeof u['input_tokens'] === 'number' ? u['input_tokens'] : undefined;
  const output = typeof u['output_tokens'] === 'number' ? u['output_tokens'] : undefined;
  if (input === undefined && output === undefined) return undefined;
  return { input: input ?? 0, output: output ?? 0 };
}

function extractSystemContent(raw: import('../../schemas/event').RawSystemEvent): unknown {
  const out: Record<string, unknown> = {};
  if (raw.subtype !== undefined) out['subtype'] = raw.subtype;
  if (raw.level !== undefined) out['level'] = raw.level;
  if (raw.toolUseID !== undefined) out['toolUseID'] = raw.toolUseID;
  if (raw.hookCount !== undefined) out['hookCount'] = raw.hookCount;
  if (raw.hookInfos !== undefined) out['hookInfos'] = raw.hookInfos;
  if (raw.hookErrors !== undefined) out['hookErrors'] = raw.hookErrors;
  if (raw.preventedContinuation !== undefined) out['preventedContinuation'] = raw.preventedContinuation;
  if (raw.stopReason !== undefined) out['stopReason'] = raw.stopReason;
  if (raw.hasOutput !== undefined) out['hasOutput'] = raw.hasOutput;
  if (raw.error !== undefined) out['error'] = raw.error;
  if (raw.retryAttempt !== undefined) out['retryAttempt'] = raw.retryAttempt;
  return out;
}

function synthId(
  prefix: string,
  sessionId: string,
  timestamp: string | undefined,
  discriminator: string,
): string {
  const t = timestamp ?? '';
  return `${prefix}:${sessionId}:${t}:${discriminator}`;
}
