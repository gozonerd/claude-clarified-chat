import { z } from 'zod';

const BaseEventSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().datetime(),
  content: z.unknown(),
  tokens: z
    .object({
      input: z.number().int().nonnegative(),
      output: z.number().int().nonnegative(),
    })
    .optional(),
  subagent_id: z.string().optional(),
});

const UserEventSchema = BaseEventSchema.extend({
  type: z.literal('user'),
});

const AssistantEventSchema = BaseEventSchema.extend({
  type: z.literal('assistant'),
});

const ToolUseEventSchema = BaseEventSchema.extend({
  type: z.literal('tool_use'),
});

const ToolResultEventSchema = BaseEventSchema.extend({
  type: z.literal('tool_result'),
});

const ThinkingEventSchema = BaseEventSchema.extend({
  type: z.literal('thinking'),
});

const SystemEventSchema = BaseEventSchema.extend({
  type: z.literal('system'),
});

export const EventSchema = z.discriminatedUnion('type', [
  UserEventSchema,
  AssistantEventSchema,
  ToolUseEventSchema,
  ToolResultEventSchema,
  ThinkingEventSchema,
  SystemEventSchema,
]);

export type Event = z.infer<typeof EventSchema>;
