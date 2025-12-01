#!/usr/bin/env bash
set -euo pipefail

# Helper to run the PR workflow locally with act
# Requires: act (https://github.com/nektos/act), Docker

WORKFLOW_FILE=".github/workflows/validate-pull-request-title/validate-pull-request-title.yml"
EVENT_FILE=".github/test/mock-events/pull_request_opened.json"
# Use a newer image that supports Node 24 (required by actions/setup-node@v6)
IMAGE="ghcr.io/catthehacker/ubuntu:act-22.04"

echo "Running workflow $WORKFLOW_FILE with event $EVENT_FILE"

# Detect Docker Host if not set
if [[ -z "${DOCKER_HOST-}" ]]; then
  if command -v docker >/dev/null 2>&1; then
    DETECTED_HOST=$(docker context inspect --format '{{.Endpoints.docker.Host}}' 2>/dev/null || true)
    if [[ -n "$DETECTED_HOST" ]]; then
      echo "Detected DOCKER_HOST: $DETECTED_HOST"
      export DOCKER_HOST="$DETECTED_HOST"
    fi
  fi
fi

# If the user has a GITHUB_TOKEN set, use it.
# If not, try to get it from gh CLI.
# Otherwise, fall back to a dummy token (which might fail for cloning actions).
if [[ -z "${GITHUB_TOKEN-}" ]]; then
  if command -v gh >/dev/null 2>&1; then
    TOKEN=$(gh auth token 2>/dev/null || true)
    if [[ -n "$TOKEN" ]]; then
      echo "Using GITHUB_TOKEN from gh CLI"
      export GITHUB_TOKEN="$TOKEN"
    fi
  fi
fi

if [[ -z "${GITHUB_TOKEN-}" ]]; then
  echo "No GITHUB_TOKEN found; using dummy token (warning: this may fail action cloning)"
  export GITHUB_TOKEN=dummy_token
fi

# Add architecture flag for Apple Silicon if needed
ARCH_ARGS=""
if [[ "$(uname -m)" == "arm64" ]]; then
  ARCH_ARGS="--container-architecture linux/amd64"
fi

# Run act
act pull_request -W "$WORKFLOW_FILE" -e "$EVENT_FILE" -P ubuntu-latest=$IMAGE $ARCH_ARGS --env-file <(echo "GITHUB_TOKEN=$GITHUB_TOKEN")
