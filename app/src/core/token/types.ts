export type Tokens = { readonly input: number; readonly output: number };
export type EventTokenAttribution = { readonly eventId: string; readonly tokens: Tokens };
export type SubAgentTokenAttribution = { readonly subagentId: string; readonly tokens: Tokens };
export type Waterfall = {
  readonly total: Tokens;
  readonly perEvent: ReadonlyArray<EventTokenAttribution>;
  readonly perSubagent: ReadonlyMap<string, Tokens>;
  readonly declared: Tokens | null;
  readonly reconciliationPct: number; // sum / declared input+output total; 1.0 if declared is null
};
