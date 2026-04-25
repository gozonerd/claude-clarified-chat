import { z } from 'zod';

// =============================================================================
// RAW SCHEMAS — empirically derived from real Claude Desktop export JSONL files.
// These validate the wire shape. They are NOT what the store/UI/exporters consume.
// The parser normalizes RawEvent → DisplayEvent[] (see core/parse/normalize.ts).
// =============================================================================

const TextBlockSchema = z
  .object({
    type: z.literal('text'),
    text: z.string(),
  })
  .passthrough();

const ThinkingBlockSchema = z
  .object({
    type: z.literal('thinking'),
    thinking: z.string(),
    signature: z.string().optional(),
  })
  .passthrough();

const ToolUseBlockSchema = z
  .object({
    type: z.literal('tool_use'),
    id: z.string(),
    name: z.string(),
    input: z.unknown(),
  })
  .passthrough();

const ToolResultBlockSchema = z
  .object({
    type: z.literal('tool_result'),
    tool_use_id: z.string(),
    content: z.unknown(),
    is_error: z.boolean().optional(),
  })
  .passthrough();

export const ContentBlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  ThinkingBlockSchema,
  ToolUseBlockSchema,
  ToolResultBlockSchema,
]);

export type ContentBlock = z.infer<typeof ContentBlockSchema>;

const MessageContentSchema = z.union([
  z.string(),
  z.array(ContentBlockSchema),
]);

const UserMessageSchema = z
  .object({
    role: z.literal('user'),
    content: MessageContentSchema,
  })
  .passthrough();

const AssistantMessageSchema = z
  .object({
    role: z.literal('assistant'),
    content: z.array(ContentBlockSchema),
    id: z.string().optional(),
    type: z.literal('message').optional(),
    model: z.string().optional(),
    stop_reason: z.string().nullable().optional(),
    stop_sequence: z.string().nullable().optional(),
    usage: z.unknown().optional(),
  })
  .passthrough();

const conversationalBase = {
  uuid: z.string(),
  parentUuid: z.string().nullable(),
  isSidechain: z.boolean(),
  timestamp: z.string(),
  sessionId: z.string(),
  userType: z.string().optional(),
  entrypoint: z.string().optional(),
  cwd: z.string().optional(),
  version: z.string().optional(),
  gitBranch: z.string().optional(),
};

const RawUserEventSchema = z
  .object({
    type: z.literal('user'),
    message: UserMessageSchema,
    promptId: z.string().optional(),
    toolUseResult: z.unknown().optional(),
    sourceToolAssistantUUID: z.string().optional(),
    permissionMode: z.string().optional(),
    isMeta: z.boolean().optional(),
    isApiErrorMessage: z.boolean().optional(),
    ...conversationalBase,
  })
  .passthrough();

const RawAssistantEventSchema = z
  .object({
    type: z.literal('assistant'),
    message: AssistantMessageSchema,
    requestId: z.string().optional(),
    slug: z.string().optional(),
    ...conversationalBase,
  })
  .passthrough();

const RawSystemEventSchema = z
  .object({
    type: z.literal('system'),
    uuid: z.string(),
    sessionId: z.string(),
    parentUuid: z.string().nullable().optional(),
    isSidechain: z.boolean().optional(),
    timestamp: z.string().optional(),
    subtype: z.string().optional(),
    level: z.string().optional(),
    toolUseID: z.string().optional(),
    hookCount: z.number().optional(),
    hookInfos: z.array(z.unknown()).optional(),
    hookErrors: z.array(z.unknown()).optional(),
    preventedContinuation: z.boolean().optional(),
    stopReason: z.string().optional(),
    hasOutput: z.boolean().optional(),
    error: z.unknown().optional(),
    retryInMs: z.number().optional(),
    retryAttempt: z.number().optional(),
    maxRetries: z.number().optional(),
    origin: z.string().optional(),
    userType: z.string().optional(),
    entrypoint: z.string().optional(),
    cwd: z.string().optional(),
    version: z.string().optional(),
    gitBranch: z.string().optional(),
  })
  .passthrough();

const RawQueueOperationEventSchema = z
  .object({
    type: z.literal('queue-operation'),
    operation: z.string(),
    sessionId: z.string(),
    timestamp: z.string().optional(),
    content: z.string().optional(),
  })
  .passthrough();

const RawLastPromptEventSchema = z
  .object({
    type: z.literal('last-prompt'),
    lastPrompt: z.string(),
    sessionId: z.string(),
  })
  .passthrough();

const RawCustomTitleEventSchema = z
  .object({
    type: z.literal('custom-title'),
    customTitle: z.string(),
    sessionId: z.string(),
  })
  .passthrough();

const RawAttachmentEventSchema = z
  .object({
    type: z.literal('attachment'),
    uuid: z.string(),
    sessionId: z.string(),
    attachment: z.unknown(),
    parentUuid: z.string().nullable().optional(),
    isSidechain: z.boolean().optional(),
    timestamp: z.string().optional(),
    userType: z.string().optional(),
    entrypoint: z.string().optional(),
    cwd: z.string().optional(),
    version: z.string().optional(),
    gitBranch: z.string().optional(),
  })
  .passthrough();

export const RawEventSchema = z.discriminatedUnion('type', [
  RawUserEventSchema,
  RawAssistantEventSchema,
  RawSystemEventSchema,
  RawQueueOperationEventSchema,
  RawLastPromptEventSchema,
  RawCustomTitleEventSchema,
  RawAttachmentEventSchema,
]);

export type RawEvent = z.infer<typeof RawEventSchema>;
export type RawUserEvent = z.infer<typeof RawUserEventSchema>;
export type RawAssistantEvent = z.infer<typeof RawAssistantEventSchema>;
export type RawSystemEvent = z.infer<typeof RawSystemEventSchema>;
export type RawQueueOperationEvent = z.infer<typeof RawQueueOperationEventSchema>;
export type RawLastPromptEvent = z.infer<typeof RawLastPromptEventSchema>;
export type RawCustomTitleEvent = z.infer<typeof RawCustomTitleEventSchema>;
export type RawAttachmentEvent = z.infer<typeof RawAttachmentEventSchema>;

// =============================================================================
// DISPLAY EVENT — flat shape consumed by store/UI/exporters.
// One raw event → 0..N display events (assistant message.content[] arrays
// flatten to one DisplayEvent per inner block; non-conversational types map 1:1).
// =============================================================================

export type DisplayEventType =
  | 'user'
  | 'assistant'
  | 'tool_use'
  | 'tool_result'
  | 'thinking'
  | 'system'
  | 'queue-operation'
  | 'last-prompt'
  | 'custom-title'
  | 'attachment';

export type DisplayEvent = {
  readonly id: string;
  readonly type: DisplayEventType;
  readonly timestamp: string;
  readonly content: unknown;
  readonly subagent_id?: string | undefined;
  readonly tokens?: { readonly input: number; readonly output: number } | undefined;
  readonly raw?: unknown;
  readonly source_path?: string | undefined;
};

// Backwards-compat alias for downstream consumers (store, UI, exporters, secret
// detector, token waterfall) that imported `Event`. The empirical schema is now
// `RawEvent`; what they consume is a `DisplayEvent`.
export type Event = DisplayEvent;

// EventSchema export retained for Phase 1 schema-test imports. Not used by the
// runtime parser (parser uses RawEventSchema for validation, then normalize()).
export const EventSchema = RawEventSchema;
