import { z } from 'zod';

export const SubAgentMetaSchema = z.object({
  id: z.string().min(1),
  spawned_at: z.string().datetime(),
  parent_id: z.string().min(1),
  purpose: z.string().optional(),
});

export type SubAgentMeta = z.infer<typeof SubAgentMetaSchema>;
