# Agent Standards & Documentation

**ATTENTION AGENTS**: Before making changes, you **MUST** read the `README.md` files in the relevant directories (e.g., `.github/workflows/README.md`) to understand the current context and testing procedures.

## Development Workflow for Agents

1.  **Read Docs**: Check `.github/workflows/README.md` for testing instructions.
2.  **Modify Script**: Edit the Deno script in the workflow directory.
3.  **Unit Test**: Run the unit tests using `deno test`.
4.  **Integration Test**: Run `bash .github/test/test-workflow-with-act.sh` to verify the workflow configuration.
5.  **Commit**: Push changes.
