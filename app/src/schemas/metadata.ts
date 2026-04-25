import { z } from 'zod';

// Empirically derived from real Claude Desktop export metadata.json files.
// Field names are camelCase (not snake_case). createdAt/lastActivityAt are epoch
// milliseconds (numbers), not ISO datetime strings. Forward-compat via passthrough.
export const MetadataSchema = z
  .object({
    sessionId: z.string().min(1),
    cliSessionId: z.string().min(1),
    cwd: z.string(),
    model: z.string().min(1),
    createdAt: z.number().int().nonnegative(),
    lastActivityAt: z.number().int().nonnegative(),
    title: z.string(),
    titleSource: z.string().optional(),
    branch: z.string().optional(),
    sourceBranch: z.string().optional(),
    originCwd: z.string().optional(),
    worktreeName: z.string().optional(),
    worktreePath: z.string().optional(),
    permissionMode: z.string().optional(),
    chromePermissionMode: z.string().optional(),
    effort: z.string().optional(),
    isArchived: z.boolean().optional(),
    completedTurns: z.number().int().nonnegative().optional(),
    enabledMcpTools: z.unknown().optional(),
    remoteMcpServersConfig: z.unknown().optional(),
    alwaysAllowedReasons: z.unknown().optional(),
  })
  .passthrough();

export type Metadata = z.infer<typeof MetadataSchema>;
