import { z } from 'zod';

export const MetadataSchema = z.object({
  session_id: z.string().min(1),
  cli_session_id: z.string().min(1),
  cwd: z.string(),
  model: z.string().min(1),
  created_at: z.string().datetime(),
  last_activity_at: z.string().datetime(),
  title: z.string(),
  total_input_tokens: z.number().int().nonnegative().optional(),
  total_output_tokens: z.number().int().nonnegative().optional(),
});

export type Metadata = z.infer<typeof MetadataSchema>;
