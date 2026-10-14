# Validate Pull Request Title

This workflow validates that a Pull Request title adheres to the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification and includes a Jira ticket reference.

## Validation Rules

1.  **Prefix**: Must start with a valid type (e.g., `feat`, `fix`, `chore`) and optional scope.
    - Regex: `^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?:`
2.  **Ticket**: Must contain a ticket reference (e.g., `SC-1234`, `AI-5678`).
    - Regex: `(SC|AI|PT)-[0-9]+`
3.  **Format**: The preferred format is `type(scope): TICKET subject`.

## Usage

This workflow is triggered on `pull_request` events (opened, edited, reopened, synchronized).

## Testing

For instructions on how to run unit tests and local integration tests, please refer to the [Workflows README](../README.md).
