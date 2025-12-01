# GitHub Actions Workflows

This directory contains the shared GitHub Actions workflows used across the organization.

## Available Workflows

- **Validate Pull Request Title** (`validate-pull-request-title/`): Ensures PR titles follow Conventional Commits and include Jira ticket references.
- **Auto Approve** (`auto-approve.yml`): Automatically approves specific types of PRs (configuration details inside the file).

## Testing Workflows

### 1. Unit Tests (Deno)

Scripts used in workflows are written in JavaScript / TypeScript, and run by Deno.

- **Why Deno?**: Deno allows granular security permissions (e.g., explicit network/file access). Since these scripts run in a repository with global impact, this security control is worth the trade-off of deviating from more commonly used tech at simpleclub (Node/Python/Dart).
- **Requirement**: No `package.json`. Use standard Deno imports (e.g., `jsr:@std/...`).
- **Running Tests**:
  ```bash
  # Example for PR title validation
  deno test .github/workflows/validate-pull-request-title/validate-pull-request-title.test.js
  ```

### 2. Integration Tests (act)

We use [act](https://github.com/nektos/act) to simulate GitHub Actions locally using Docker.

**Prerequisites:**

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [act](https://github.com/nektos/act)

**Running Integration Tests:**
A helper script is available to run the workflows with mock events:

```bash
# Run from the root of the repository
bash .github/test/test-workflow-with-act.sh
```

You can also run `act` directly if you prefer:

```bash
act pull_request -W .github/workflows/validate-pull-request-title/validate-pull-request-title.yml --container-architecture linux/amd64 -e .github/test/mock-events/pull_request.json
```
