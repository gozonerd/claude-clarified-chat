# Claude Code Session Export — Data Format Specification

**Generated:** 2026-04-15
**Source:** 5 sample ZIP exports from Claude Code Desktop (v2.1.92)
**Purpose:** Complete data dictionary for building a parser

---

## 1. ZIP Structure

Each export is a ZIP file named `session-export-{timestamp}.zip`.

### Directory Layout

```
{cliSessionId}.jsonl                    # Main conversation JSONL
{cliSessionId}/
  subagents/
    agent-{agentId}.jsonl               # Non-compact subagent conversation
    agent-{agentId}.meta.json           # Subagent metadata (only for non-compact)
    agent-acompact-{hash}.jsonl         # Auto-compacted subagent conversation
  tool-results/
    {toolUseId}.txt                     # Large tool results stored as separate files
metadata.json                           # Session metadata
logs/
  main.log                              # Main application log (~2.4MB)
  claude.ai-web.log                     # Web client errors/warnings
  cowork_vm_node.log                    # VM/Cowork node logs
  ssh.log                               # SSH manager init logs
  unknown-window.log                    # Unattributed window logs
```

### Observations Across 5 Exports

| Export | Main JSONL Records | Subagent Files | Has tool-results/ | Has attachment records |
|--------|-------------------|----------------|--------------------|-----------------------|
| 1      | 414               | 1 compact      | No                 | No                    |
| 2      | 414               | 1 compact      | No                 | No                    |
| 3      | 271               | 0              | No                 | No                    |
| 4      | 1142              | 1 non-compact + 2 compact | Yes (1 file) | Yes (3)       |
| 5      | 1880              | 1 non-compact + 4 compact | No           | Yes (1)               |

Note: Exports 1 and 2 are the same session exported twice — identical JSONL and metadata, only main.log differs slightly in size.

---

## 2. metadata.json — Full Schema

All fields were present in all 5 exports (none are optional based on sample data).

| Field | Type | Always Present | Description | Example |
|-------|------|---------------|-------------|---------|
| `sessionId` | string | Yes | UI-level session ID, prefixed with `local_` | `"local_7a7e0693-471d-46a4-a487-302c8043da54"` |
| `cliSessionId` | string | Yes | CLI session UUID — matches the main JSONL filename | `"9c5bf51b-63c6-4c10-b819-702895b7f0a0"` |
| `cwd` | string | Yes | Current working directory (Windows path with backslashes) | `"C:\\Users\\NerdyKrystal\\repos"` |
| `originCwd` | string | Yes | Original working directory at session start | `"C:\\Users\\NerdyKrystal\\repos"` |
| `createdAt` | integer | Yes | Session creation timestamp (Unix epoch milliseconds) | `1776117699917` |
| `lastActivityAt` | integer | Yes | Last activity timestamp (Unix epoch milliseconds) | `1776126987538` |
| `model` | string | Yes | Default model for the session | `"claude-haiku-4-5-20251001"` or `"claude-sonnet-4-6"` |
| `isArchived` | boolean | Yes | Whether session is archived | `false` |
| `title` | string | Yes | Session title (auto-generated or user-set) | `"Haiku Melody and Harmony"` |
| `permissionMode` | string | Yes | Permission mode for the session | `"bypassPermissions"` |
| `enabledMcpTools` | object | Yes | Map of tool identifiers to boolean (true = enabled). Keys use format `"ServerName:tool_name"` or `"uuid:tool_name"` or `"local:ServerName:tool_name"`. Some keys have hash suffixes. | `{"Desktop Commander:get_file_info": true, ...}` |
| `remoteMcpServersConfig` | array | Yes | List of remote MCP server configurations | See below |
| `chromePermissionMode` | string | Yes | Chrome automation permission level | `"skip_all_permission_checks"` |
| `completedTurns` | integer | Yes | Number of completed conversation turns | `5`, `18`, `28` |

### enabledMcpTools Key Formats

Tool keys follow these patterns:
- `"ServerName:tool_name"` — Local MCP server tools (e.g., `"Desktop Commander:read_file"`)
- `"ServerName:tool_name-{hash}"` — Versioned local tools (e.g., `"Desktop Commander:create_directory-c1d8d8a85728942221c6baee3c6b4fbb"`)
- `"{uuid}:tool_name"` — Remote MCP server tools (e.g., `"b6b5d94f-fee6-47a9-a44e-a9aac6e2fd7f:clickup_search-175718d5574aea059630621c0a5d6d62"`)
- `"local:ServerName:tool_name"` — Local MCP with explicit prefix (e.g., `"local:Claude in Chrome:computer"`)

### remoteMcpServersConfig Item Schema

| Field | Type | Description |
|-------|------|-------------|
| `uuid` | string | Unique identifier for the remote MCP server |
| `name` | string | Human-readable server name |
| `tools` | array | List of tool definitions |

Each tool in `tools`:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Tool function name |
| `description` | string | Tool description |
| `inputSchema` | object | JSON Schema for tool input parameters |

---

## 3. JSONL Records — Record Types

Each line in the JSONL file is a JSON object. There are 6 distinct record types:

| type | Description | Count Range (across exports) |
|------|-------------|----------------------------|
| `user` | User messages and tool results | 78–594 |
| `assistant` | Assistant responses | 185–1175 |
| `system` | System events (compaction, hook feedback) | 0–40 |
| `queue-operation` | Message queue operations | 6–66 |
| `last-prompt` | Last user prompt cache | 0–4 |
| `attachment` | Tool schema deltas | 0–3 |

---

## 4. Record Type: `user`

### Top-Level Fields

| Field | Type | Always Present | Description |
|-------|------|---------------|-------------|
| `type` | string | Yes | Always `"user"` |
| `uuid` | string | Yes | Unique record ID (UUID v4) |
| `parentUuid` | string or null | Yes | UUID of the parent record. `null` for the first user message in a conversation |
| `isSidechain` | boolean | Yes | Whether this record is in a sidechain (subagent) |
| `timestamp` | string | Yes | ISO 8601 timestamp with timezone (e.g., `"2026-04-13T21:13:14.814Z"`) |
| `sessionId` | string | Yes | CLI session UUID |
| `message` | object | Yes | The message payload (see below) |
| `userType` | string | Yes | Always `"external"` in observed data |
| `entrypoint` | string | Yes | Client entrypoint | `"claude-desktop"` |
| `cwd` | string | Yes | Current working directory at time of message |
| `version` | string | Yes | Client version string | `"2.1.92"` |
| `gitBranch` | string | Yes | Git branch at time of message | `"master"` |
| `promptId` | string | Mostly | UUID for grouping related messages within a turn |
| `slug` | string | Mostly | Session slug (adjective-adjective-noun format). Absent on first few records before slug is assigned |
| `permissionMode` | string | Optional | Present on human-typed messages: `"bypassPermissions"` |
| `toolUseResult` | object or string | Optional | Structured result metadata from tool execution (present when message contains `tool_result` blocks) |
| `sourceToolAssistantUUID` | string | Optional | UUID of the assistant record that initiated the tool call |
| `sourceToolUseID` | string | Optional | ID of the Skill tool_use that injected this content (for skill-loaded content) |
| `isMeta` | boolean | Optional | `true` for system-injected messages (hook feedback, skill content). Not typed by the user |
| `isCompactSummary` | boolean | Optional | `true` for auto-compaction summary messages |
| `isVisibleInTranscriptOnly` | boolean | Optional | `true` for messages shown in transcript but not sent to the model |
| `agentId` | string | Optional | Present in subagent conversations — links to the subagent ID |

### user.message Schema

| Field | Type | Description |
|-------|------|-------------|
| `role` | string | Always `"user"` |
| `content` | string or array | Plain text string for human messages and compaction summaries; array of content blocks for tool results |

When `content` is an array, it contains content blocks (see Section 8).

---

## 5. Record Type: `assistant`

### Top-Level Fields

| Field | Type | Always Present | Description |
|-------|------|---------------|-------------|
| `type` | string | Yes | Always `"assistant"` |
| `uuid` | string | Yes | Unique record ID |
| `parentUuid` | string | Yes | UUID of the parent record (never null for assistant records) |
| `isSidechain` | boolean | Yes | Whether in a subagent sidechain |
| `timestamp` | string | Yes | ISO 8601 timestamp |
| `sessionId` | string | Yes | CLI session UUID |
| `message` | object | Yes | The API response message (see below) |
| `requestId` | string | Yes | API request ID (format: `req_{hash}`) |
| `userType` | string | Yes | Always `"external"` |
| `entrypoint` | string | Yes | Client entrypoint |
| `cwd` | string | Yes | Working directory |
| `version` | string | Yes | Client version |
| `gitBranch` | string | Yes | Git branch |
| `slug` | string | Mostly | Session slug. Absent on early records |
| `agentId` | string | Optional | Present in subagent conversations |

### assistant.message Schema (API Response Envelope)

| Field | Type | Always Present | Description |
|-------|------|---------------|-------------|
| `model` | string | Yes | Model that generated this response | `"claude-haiku-4-5-20251001"`, `"claude-sonnet-4-6"` |
| `id` | string | Yes | API message ID (format: `msg_{hash}`) |
| `type` | string | Yes | Always `"message"` |
| `role` | string | Yes | Always `"assistant"` |
| `content` | array | Yes | Array of content blocks (see Section 8) |
| `stop_reason` | string or null | Yes | `null` (streaming/partial), `"end_turn"`, or `"tool_use"` |
| `stop_sequence` | string or null | Yes | Always `null` in observed data |
| `stop_details` | object or null | Yes | Always `null` in observed data |
| `usage` | object | Yes | Token usage information (see below) |

### usage Schema

| Field | Type | Always Present | Description |
|-------|------|---------------|-------------|
| `input_tokens` | integer | Yes | Input tokens counted for billing |
| `cache_creation_input_tokens` | integer | Yes | Tokens written to cache |
| `cache_read_input_tokens` | integer | Yes | Tokens read from cache |
| `output_tokens` | integer | Yes | Output tokens generated |
| `service_tier` | string | Yes | Service tier used | `"standard"` |
| `cache_creation` | object | Yes | Cache creation breakdown |
| `cache_creation.ephemeral_5m_input_tokens` | integer | Yes | 5-minute ephemeral cache tokens |
| `cache_creation.ephemeral_1h_input_tokens` | integer | Yes | 1-hour ephemeral cache tokens |
| `inference_geo` | string | Optional | Inference geography | `""` or `"not_available"` |
| `server_tool_use` | object | Optional | Server-side tool usage counters |
| `server_tool_use.web_search_requests` | integer | Optional | Number of web search requests |
| `server_tool_use.web_fetch_requests` | integer | Optional | Number of web fetch requests |
| `iterations` | array | Optional | Empty array `[]` in observed data — structure unknown |
| `speed` | string | Optional | Response speed tier | `"standard"` |

---

## 6. Record Type: `system`

### Top-Level Fields

| Field | Type | Always Present | Description |
|-------|------|---------------|-------------|
| `type` | string | Yes | Always `"system"` |
| `subtype` | string | Yes | System event subtype (see below) |
| `uuid` | string | Yes | Unique record ID |
| `timestamp` | string | Yes | ISO 8601 timestamp |
| `sessionId` | string | Yes | CLI session UUID |
| `isSidechain` | boolean | Yes | Whether in a subagent |
| `level` | string | Yes | Log level: `"info"` or `"suggestion"` |
| `parentUuid` | string or null | Yes | Parent record UUID |
| `userType` | string | Yes | Always `"external"` |
| `entrypoint` | string | Yes | Client entrypoint |
| `cwd` | string | Yes | Working directory |
| `version` | string | Yes | Client version |
| `gitBranch` | string | Yes | Git branch |
| `slug` | string | Mostly | Session slug |

### System Subtypes

#### `stop_hook_summary`

Emitted when stop hooks run after an assistant turn.

| Field | Type | Description |
|-------|------|-------------|
| `hookCount` | integer | Number of hooks that ran |
| `hookInfos` | array | Info about each hook. Items: `{"command": "callback"}` |
| `hookErrors` | array | Error/output strings from each hook |
| `preventedContinuation` | boolean | Whether hooks prevented the assistant from continuing |
| `stopReason` | string | Reason for stopping (empty string if none) |
| `hasOutput` | boolean | Whether hooks produced output |
| `toolUseID` | string | Internal tool use ID that triggered the hooks |

#### `compact_boundary`

Emitted when auto-compaction occurs.

| Field | Type | Description |
|-------|------|-------------|
| `content` | string | Always `"Conversation compacted"` |
| `isMeta` | boolean | Always `false` |
| `logicalParentUuid` | string | UUID of the logical parent before compaction |
| `compactMetadata` | object | Compaction details |
| `compactMetadata.trigger` | string | What triggered compaction | `"auto"` |
| `compactMetadata.preTokens` | integer | Token count before compaction | e.g., `167225`, `167444` |

---

## 7. Record Type: `queue-operation`

Tracks the message queue (user prompts queued while assistant is busy).

| Field | Type | Always Present | Description |
|-------|------|---------------|-------------|
| `type` | string | Yes | Always `"queue-operation"` |
| `operation` | string | Yes | One of: `"enqueue"`, `"dequeue"`, `"remove"` |
| `timestamp` | string | Yes | ISO 8601 timestamp |
| `sessionId` | string | Yes | CLI session UUID |
| `content` | string | Optional | The queued message content (present only on `"enqueue"`) |

**Note:** `queue-operation` records do NOT have `uuid`, `parentUuid`, `slug`, or most other common fields.

---

## 8. Record Type: `last-prompt`

Caches the last user-typed prompt for restoration.

| Field | Type | Always Present | Description |
|-------|------|---------------|-------------|
| `type` | string | Yes | Always `"last-prompt"` |
| `lastPrompt` | string | Yes | The text of the last user prompt |
| `sessionId` | string | Yes | CLI session UUID |

**Note:** Minimal record — only 3 fields.

---

## 9. Record Type: `attachment`

Carries schema deltas (e.g., deferred tool additions).

### Top-Level Fields

| Field | Type | Always Present | Description |
|-------|------|---------------|-------------|
| `type` | string | Yes | Always `"attachment"` |
| `uuid` | string | Yes | Unique record ID |
| `parentUuid` | string | Yes | Parent record UUID |
| `isSidechain` | boolean | Yes | Whether in a subagent |
| `timestamp` | string | Yes | ISO 8601 timestamp |
| `sessionId` | string | Yes | CLI session UUID |
| `attachment` | object | Yes | The attachment payload |
| `userType` | string | Yes | Always `"external"` |
| `entrypoint` | string | Yes | Client entrypoint |
| `cwd` | string | Yes | Working directory |
| `version` | string | Yes | Client version |
| `gitBranch` | string | Yes | Git branch |
| `slug` | string | Mostly | Session slug |

### attachment.attachment Schema

Only one type observed:

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"deferred_tools_delta"` |
| `addedNames` | array of string | Tool names being added (e.g., `["EnterWorktree", "NotebookEdit", ...]`) |
| `removedNames` | array of string | Tool names being removed |
| `addedLines` | array of string | Human-readable lines describing added tools |

---

## 10. Content Blocks (Inside Messages)

### Assistant Content Block Types

#### `thinking`

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"thinking"` |
| `thinking` | string | The model's chain-of-thought reasoning text |
| `signature` | string | Cryptographic signature for the thinking block (Base64-encoded) |

#### `text`

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"text"` |
| `text` | string | The assistant's visible text response |

#### `tool_use`

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"tool_use"` |
| `id` | string | Unique tool use ID (format: `toolu_{hash}`) |
| `name` | string | Tool name (see Section 14 for complete list) |
| `input` | object | Tool-specific input parameters (see Section 11) |
| `caller` | object | Optional. Caller context. Observed: `{"type": "direct"}` |

### User Content Block Types

#### `text`

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"text"` |
| `text` | string | Text content (human messages, skill content, hook feedback) |

#### `tool_result`

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"tool_result"` |
| `tool_use_id` | string | ID of the tool_use this is responding to |
| `content` | string or array | Tool output text, or array of content blocks (usually `[{"type":"text","text":"..."}]`) |
| `is_error` | boolean | Whether the tool execution errored |

---

## 11. Tool Input Schemas (tool_use.input)

### Bash

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `command` | string | Yes | Shell command to execute |
| `description` | string | Optional | Human-readable description |
| `timeout` | integer | Optional | Timeout in milliseconds |
| `dangerouslyDisableSandbox` | boolean | Optional | Bypass sandbox restrictions |

### Read

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file_path` | string | Yes | Absolute file path |
| `offset` | integer | Optional | Starting line number |
| `limit` | integer | Optional | Number of lines to read |

### Write

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file_path` | string | Yes | Absolute file path |
| `content` | string | Yes | File content to write |

### Edit

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file_path` | string | Yes | Absolute file path |
| `old_string` | string | Yes | Text to find and replace |
| `new_string` | string | Yes | Replacement text |
| `replace_all` | boolean | Optional | Replace all occurrences (default: false) |

### Glob

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pattern` | string | Yes | Glob pattern |
| `path` | string | Optional | Directory to search in |

### Grep

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pattern` | string | Yes | Regex pattern |
| `path` | string | Optional | File or directory to search |
| `output_mode` | string | Optional | `"content"`, `"files_with_matches"`, or `"count"` |
| `context` | integer | Optional | Context lines around matches |
| `head_limit` | integer | Optional | Limit output entries |
| `offset` | integer | Optional | Skip first N entries |
| `glob` | string | Optional | File glob filter |
| `- i` | boolean | Optional | Case insensitive (note: key has a space — `"- i"`) |

### Agent

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | Yes | Task prompt for the subagent |
| `description` | string | Yes | Short description of the task |
| `subagent_type` | string | Yes | Agent type: `"Explore"`, `"Plan"`, etc. |

### Skill

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `skill` | string | Yes | Skill name to invoke |
| `args` | string | Optional | Arguments for the skill |

### TodoWrite

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `todos` | array | Yes | Array of todo items |

Each todo item:
| Field | Type | Description |
|-------|------|-------------|
| `content` | string | Todo description |
| `status` | string | `"pending"`, `"in_progress"`, or `"completed"` |
| `activeForm` | string | Current action/verb form |

### TaskOutput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `task_id` | string | Yes | Background task ID |
| `block` | boolean | Optional | Whether to block waiting for output |
| `timeout` | integer | Optional | Timeout in milliseconds |

### TaskStop

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `task_id` | string | Yes | Background task ID to stop |

### MCP Tools (e.g., `mcp__Claude_Preview__preview_start`)

Input varies by tool. Examples:
- `preview_start`: `{"name": "server-name"}`
- `preview_screenshot`: `{"serverId": "uuid"}`
- `preview_logs`: `{"serverId": "uuid"}`

---

## 12. toolUseResult Schemas (on user records)

The `toolUseResult` field on user records contains structured metadata about tool execution. It can be:
- An **object** with tool-specific fields
- A **string** (for errors from MCP tools)

### Bash toolUseResult

| Field | Type | Always Present | Description |
|-------|------|---------------|-------------|
| `stdout` | string | Yes | Standard output |
| `stderr` | string | Yes | Standard error |
| `interrupted` | boolean | Yes | Whether execution was interrupted |
| `isImage` | boolean | Yes | Whether output is an image |
| `noOutputExpected` | boolean | Yes | Whether output was expected |
| `backgroundTaskId` | string | Optional | ID if command was backgrounded |
| `assistantAutoBackgrounded` | boolean | Optional | Whether the system auto-backgrounded the command |
| `dangerouslyDisableSandbox` | boolean | Optional | Whether sandbox was disabled |
| `returnCodeInterpretation` | string | Optional | Interpretation hint (e.g., `"No matches found"`) |
| `staleReadFileStateHint` | string | Optional | Warning about files modified since last Read |

### Read toolUseResult

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"text"` or `"file_unchanged"` |
| `file` | object | File metadata (see below) |

`file` object for `"text"` type:
| Field | Type | Description |
|-------|------|-------------|
| `filePath` | string | Absolute file path |
| `content` | string | File content |
| `numLines` | integer | Number of lines returned |
| `startLine` | integer | Starting line number |
| `totalLines` | integer | Total lines in file |

`file` object for `"file_unchanged"` type:
| Field | Type | Description |
|-------|------|-------------|
| `filePath` | string | Absolute file path |

### Write toolUseResult

| Field | Type | Description |
|-------|------|-------------|
| `type` | string | `"create"` (new file) or `"update"` (existing file) |
| `filePath` | string | Absolute file path |
| `content` | string | Written content |
| `structuredPatch` | array | Diff hunks (empty for create, populated for update) |
| `originalFile` | string or null | Original file content (`null` for create) |

### Edit toolUseResult

| Field | Type | Description |
|-------|------|-------------|
| `filePath` | string | Absolute file path |
| `oldString` | string | The text that was replaced |
| `newString` | string | The replacement text |
| `originalFile` | string | File content before edit |
| `structuredPatch` | array | Diff hunks |
| `userModified` | boolean | Whether the user modified the edit (permission intercept) |
| `replaceAll` | boolean | Whether replace-all was used |

### structuredPatch Hunk Schema

Each hunk in `structuredPatch`:

| Field | Type | Description |
|-------|------|-------------|
| `oldStart` | integer | Line number in old file |
| `oldLines` | integer | Number of lines in old version |
| `newStart` | integer | Line number in new file |
| `newLines` | integer | Number of lines in new version |
| `lines` | array of string | Unified diff lines (prefixed with `+`, `-`, or ` `) |

### Glob toolUseResult

| Field | Type | Description |
|-------|------|-------------|
| `filenames` | array of string | Matched file paths |
| `durationMs` | integer | Search duration in milliseconds |
| `numFiles` | integer | Number of files matched |
| `truncated` | boolean | Whether results were truncated |

### Grep toolUseResult

| Field | Type | Description |
|-------|------|-------------|
| `mode` | string | Output mode used |
| `numFiles` | integer | Number of files with matches |
| `filenames` | array of string | Matched file paths |
| `content` | string | Matching content (when mode is `"content"`) |
| `numLines` | integer | Number of matching lines |
| `appliedLimit` | integer | Optional. Applied head limit |
| `appliedOffset` | integer | Optional. Applied offset |

### Agent toolUseResult

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"completed"` |
| `prompt` | string | The prompt given to the agent |
| `agentId` | string | Agent identifier (matches subagent filename) |
| `agentType` | string | `"Explore"`, `"Plan"`, etc. |
| `content` | array | Final output content blocks: `[{"type":"text","text":"..."}]` |
| `totalDurationMs` | integer | Total execution time in ms |
| `totalTokens` | integer | Total tokens consumed |
| `totalToolUseCount` | integer | Total tool calls made |
| `usage` | object | Aggregated token usage (same schema as assistant.message.usage) |

### Skill toolUseResult

| Field | Type | Description |
|-------|------|-------------|
| `success` | boolean | Whether skill loaded successfully |
| `commandName` | string | Name of the skill invoked |

### TodoWrite toolUseResult

| Field | Type | Description |
|-------|------|-------------|
| `oldTodos` | array | Previous todo list |
| `newTodos` | array | Updated todo list (same item schema as input) |
| `verificationNudgeNeeded` | boolean | Whether verification was flagged |

### TaskOutput toolUseResult

| Field | Type | Description |
|-------|------|-------------|
| `retrieval_status` | string | `"success"` |
| `task` | object | Task details (see below) |

`task` object:
| Field | Type | Description |
|-------|------|-------------|
| `task_id` | string | Background task ID |
| `task_type` | string | `"local_bash"` |
| `status` | string | `"completed"` |
| `description` | string | Task description |
| `output` | string | Task output text |
| `exitCode` | integer | Process exit code |

### TaskStop toolUseResult

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Confirmation message |
| `task_id` | string | Stopped task ID |
| `task_type` | string | `"local_bash"` |
| `command` | string | The command that was running |

### MCP Tool toolUseResult (String Type)

MCP tool results that error come back as plain strings:
```
"Error: Failed to start server: No server named \"...\" found in .claude/launch.json."
```

---

## 13. Subagent Files

### Naming Convention

- **Non-compact:** `agent-a{hash}.jsonl` + `agent-a{hash}.meta.json`
- **Compact (auto-compacted):** `agent-acompact-{hash}.jsonl` (no meta file)

The `{hash}` in the filename matches the `agentId` field on records within.

### Meta File Schema (`agent-{id}.meta.json`)

| Field | Type | Description |
|-------|------|-------------|
| `agentType` | string | `"Explore"`, `"Plan"`, etc. |
| `description` | string | Human-readable task description |

### Subagent JSONL Records

Subagent JSONL files contain the same record types as the main JSONL:
- `user` — tool results and injected prompts
- `assistant` — model responses
- `system` — compaction boundaries and hook summaries
- `attachment` — deferred tool deltas

**Key differences from main conversation:**
- `isSidechain` is always `true`
- `agentId` field is present on all records
- `parentUuid` is `null` for the first record (the agent's initial prompt)
- `sessionId` matches the parent session's `cliSessionId`

### Linking Subagents to Parent Conversation

1. In the **main JSONL**, an `assistant` record contains a `tool_use` block with `name: "Agent"` and `input.subagent_type` + `input.description`
2. The corresponding `user` record in the main JSONL has `toolUseResult.agentId` matching the subagent filename
3. The **subagent JSONL** contains the full conversation, starting with a `user` record whose `agentId` matches
4. Compact subagents (`acompact-*`) represent auto-compacted versions of the main conversation context fed to the agent — they share the parent's session UUID chain but operate in parallel

---

## 14. All Tool Names Observed

| Tool Name | Where Used | Description |
|-----------|------------|-------------|
| `Agent` | Main + Subagents | Spawn a subagent |
| `Bash` | Main + Subagents | Execute shell commands |
| `Edit` | Main + Subagents | Edit files (find and replace) |
| `Glob` | Main + Subagents | Find files by pattern |
| `Grep` | Main + Subagents | Search file contents |
| `Read` | Main + Subagents | Read file contents |
| `Skill` | Main only | Invoke a registered skill |
| `TaskOutput` | Main + Subagents | Get background task output |
| `TaskStop` | Main + Subagents | Stop a background task |
| `TodoWrite` | Main only | Update the todo list |
| `Write` | Main + Subagents | Write/create files |
| `mcp__Claude_Preview__preview_logs` | Main + Subagents | Get preview server logs |
| `mcp__Claude_Preview__preview_screenshot` | Main + Subagents | Take preview screenshot |
| `mcp__Claude_Preview__preview_start` | Main + Subagents | Start a preview server |

---

## 15. tool-results Directory

Large tool results may be stored as separate files rather than inline in the JSONL.

**Location:** `{cliSessionId}/tool-results/{toolUseId}.txt`

**Naming:** The filename is the `tool_use_id` from the `tool_use` block, with `.txt` extension.

**Content:** Plain text output (e.g., grep results, file search results).

**Observed:** 1 file across 5 exports (22,521 bytes, containing grep output).

---

## 16. Log Files

All log files use the format: `YYYY-MM-DD HH:MM:SS [level] message`

### main.log
- **Size:** ~2.4 MB, ~28,000 lines
- **Content:** Full application lifecycle — startup, version info, API calls, tool execution, errors
- **Levels:** `info`, `error`, `warn`, `debug`

### claude.ai-web.log
- **Size:** ~40 KB, ~260 lines
- **Content:** Web client errors (CORS, React Query, Intercom)

### cowork_vm_node.log
- **Size:** ~5.7 KB, ~75 lines
- **Content:** VM/Cowork bundle status, loading events

### ssh.log
- **Size:** ~680 bytes, ~6 lines
- **Content:** SSH manager initialization with version hashes

### unknown-window.log
- **Size:** ~2 KB, ~6 lines
- **Content:** Errors from unattributed browser windows (subset of claude.ai-web.log)

---

## 17. Parent-Child UUID Chain Pattern

Records form a linked list via `uuid` and `parentUuid`:

```
user (parentUuid: null)                   # First message
  -> assistant (thinking block)           # Each content block type gets its own record
    -> assistant (text block)
      -> assistant (tool_use block)
        -> user (tool_result block)       # Tool result links back to the tool_use assistant
          -> assistant (thinking block)   # Next response
            -> assistant (tool_use block)
              -> user (tool_result block)
```

**Key rules:**
1. The first `user` message has `parentUuid: null`
2. Each subsequent record's `parentUuid` points to the previous record's `uuid`
3. An assistant response is split across MULTIPLE records — one per content block type (thinking, text, tool_use)
4. Tool results link back to the tool_use record that spawned them
5. When multiple tool_use blocks are in the same response, their corresponding tool_result records may reference different parent UUIDs (the specific tool_use record)
6. `system` records (like `stop_hook_summary`) are inserted into the chain at the point they occurred
7. `compact_boundary` system records have `parentUuid: null` but `logicalParentUuid` pointing to the previous conversation context

---

## 18. Fields That Vary Between Exports

| Field | Variation | Notes |
|-------|-----------|-------|
| `model` | `claude-haiku-4-5-20251001` vs `claude-sonnet-4-6` | Per-session setting |
| `cwd` | Different paths | `C:\Users\NerdyKrystal\repos` vs `C:\Users\NerdyKrystal` |
| `slug` | Different per session | `"unified-splashing-octopus"`, `"cozy-coalescing-boole"`, etc. |
| `completedTurns` | 2 to 28 | Varies by session length |
| Subagent count | 0 to 5 | Session complexity dependent |
| `attachment` records | 0 to 3 | Present only when deferred tools change |
| `last-prompt` records | 0 to 4 | Present only in sessions where user typed prompts |

---

## 19. Summary Statistics Across All 5 Exports

| Metric | Value |
|--------|-------|
| Total main JSONL records | 4,121 (deduplicated: 3,707 since exports 1+2 are identical) |
| Total subagent JSONL records | 2,922 |
| Distinct record types | 6 (`user`, `assistant`, `system`, `queue-operation`, `last-prompt`, `attachment`) |
| Distinct system subtypes | 2 (`stop_hook_summary`, `compact_boundary`) |
| Distinct tool names | 14 |
| Distinct content block types (assistant) | 3 (`thinking`, `text`, `tool_use`) |
| Distinct content block types (user) | 2 (`text`, `tool_result`) |
| Distinct attachment types | 1 (`deferred_tools_delta`) |
| Distinct queue operations | 3 (`enqueue`, `dequeue`, `remove`) |
| Distinct models | 2 (`claude-haiku-4-5-20251001`, `claude-sonnet-4-6`) |
| Distinct stop_reasons | 3 (`null`, `"end_turn"`, `"tool_use"`) |
| Distinct toolUseResult types | 5 (`"text"`, `"create"`, `"update"`, `"file_unchanged"`, string) |
