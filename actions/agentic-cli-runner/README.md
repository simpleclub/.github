# Agentic CLI Runner Action

A reusable GitHub Action that provides a consistent, provider-agnostic setup and execution environment for AI-powered agentic workflows using [OpenCode](https://opencode.ai/).

## Design Philosophy

This action uses OpenCode — an open-source agentic coding tool that supports 75+ LLM providers via the [AI SDK](https://ai-sdk.dev/). It is designed to be used across all simpleclub repositories as a shared, reusable composite action.

Key features:

- **Provider-agnostic**: Supply any `provider/model` string (e.g., `google/gemini-2.5-flash`, `anthropic/claude-sonnet-4`)
- **Single API key input**: One `agent_api_key` input applied to all known provider env vars
- **OpenCode `run` command**: Uses `opencode run` (non-interactive headless mode)
- **Auto-approve by default**: OpenCode allows all tool operations without explicit approval — no "yolo" flag needed
- **Metadata collection**: Extracts `.ai-metadata/*.json` and `*.md` files into a consolidated `metadata` output

## Usage

```yaml
- name: Run AI Agent
  id: agent-step
  uses: simpleclub/.github/actions/agentic-cli-runner@main
  with:
    prompt: 'Your prompt here'
    agent_api_key: ${{ secrets.GEMINI_API_KEY }}
    agent_model: 'google/gemini-2.5-flash'
    opencode_version: '1.2.6'
    expected_files: '["run-summary.json"]'
    debug: 'false'
    max_attempts: '3'
```

## Inputs

| Input               | Description                                                                 | Required | Default                              |
| ------------------- | --------------------------------------------------------------------------- | -------- | ------------------------------------ |
| `prompt`            | The prompt to send to the agent                                             | ✅       | —                                    |
| `agent_api_key`     | API key for the model provider                                              | ✅       | —                                    |
| `agent_model`       | Fully qualified `provider/model` string                                     | ✅       | —                                    |
| `debug`             | Enable debug mode (verbose logging)                                         | ❌       | `false`                              |
| `max_attempts`      | Maximum retry attempts                                                      | ❌       | `3`                                  |
| `working_directory` | Working directory                                                           | ❌       | `.`                                  |
| `git_user_name`     | Git user name for commits                                                   | ❌       | `Kumpel AI`                          |
| `git_user_email`    | Git user email for commits                                                  | ❌       | `kumpel-ai@users.noreply.github.com` |
| `opencode_version`  | `opencode-ai` npm package version                                           | ❌       | `1.2.6`                              |
| `expected_files`    | JSON array of expected metadata file names (without `.ai-metadata/` prefix) | ❌       | `["run-summary.json"]`               |

## Outputs

| Output                 | Description                                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `changed`              | Whether any changes were made                                                 |
| `attempts`             | Number of attempts made                                                       |
| `metadata`             | Consolidated metadata JSON string (all processed `.ai-metadata` files merged) |
| `job_duration_seconds` | Total job duration in seconds                                                 |

## How It Works

1. **Install** — Installs `opencode-ai@{version}` globally via npm
2. **Configure** — Generates inline OpenCode config via `OPENCODE_CONFIG_CONTENT`:
   - Enables only the target provider (extracted from `agent_model`)
   - Disables autoupdate, sharing, LSP downloads for CI
   - API key is provided via standard provider env vars (auto-discovered by the AI SDK)
3. **Run** — Executes `opencode run --model <model> "<prompt>"` with retry logic
4. **Process** — Extracts `.ai-metadata/*.json` and `*.md` files into a consolidated `metadata` output
5. **Artifacts** — Uploads metadata, conversation logs, and (on failure) error reports

## Provider Configuration

The action extracts the provider from the model string and uses OpenCode's `enabled_providers` config to load only that provider. The API key is provided exclusively via environment variables — the same key is set as `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_GENERATIVE_AI_API_KEY`, `GOOGLE_API_KEY`, `GEMINI_API_KEY`, etc. The AI SDK auto-discovers the appropriate env var for the enabled provider at runtime.

> **Note**: OpenCode's `{env:VAR}` config template syntax is _not_ used for API keys, as it does not reliably resolve in CI. Standard env var auto-discovery is more robust.

### Supported Provider Examples

| Model String                           | Provider   |
| -------------------------------------- | ---------- |
| `google/gemini-2.5-flash`              | Google AI  |
| `anthropic/claude-sonnet-4`            | Anthropic  |
| `openai/gpt-4o`                        | OpenAI     |
| `openrouter/anthropic/claude-sonnet-4` | OpenRouter |

## Metadata Files

The action automatically processes metadata files created by the agent in `.ai-metadata/`:

- **JSON files** (`.json`) — Parsed, validated, and merged into the `metadata` output
- **Markdown files** (`.md`) — Read as strings and added to the `metadata` output

File names are converted to camelCase keys (e.g., `qa-response.md` → `qaResponse`).

## Error Handling

- Retries on failure up to `max_attempts`
- On failure, zips and uploads OpenCode log directories as artifacts
- Validates expected metadata files and warns if missing
- Provides detailed error messages in step annotations

## AGENTS.md Discovery

OpenCode automatically discovers `AGENTS.md` files in the repository for context. No explicit configuration is needed — just ensure your repo has the standard `AGENTS.md` files.

## Artifacts

| Artifact Name                                      | Condition  | Contents                      |
| -------------------------------------------------- | ---------- | ----------------------------- |
| `ai-metadata-{run_id}-{attempt}`                   | Always     | `.ai-metadata/` directory     |
| `opencode-conversation-history-{run_id}-{attempt}` | Always     | Conversation logs per attempt |
| `opencode-error-reports-{run_id}-{attempt}`        | On failure | Zipped OpenCode log dirs      |
