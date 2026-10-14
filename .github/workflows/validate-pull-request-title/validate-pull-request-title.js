/**
 * Validates the PR title against Conventional Commits and Jira Ticket requirements.
 * @param {string} title
 * @returns {{ isValid: boolean, errors: string[], warnings: string[] }}
 */
export function validateTitle(title) {
  const errors = [];
  const warnings = [];

  // Regex Definitions
  const REGEX_PREFIX =
    /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?:/;
  const REGEX_TICKET = /(SC|AI|PT)-[0-9]+/;
  const REGEX_FULL =
    /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?: (SC|AI|PT)-[0-9]+[- ].+$/;

  // 1. Fast Path: Check if it matches the perfect format
  if (REGEX_FULL.test(title)) {
    return { isValid: true, errors, warnings };
  }

  // 2. Granular Diagnostics
  let failed = false;

  // Check 1: Prefix
  if (!REGEX_PREFIX.test(title)) {
    errors.push(
      "Title must start with a valid conventional commit prefix (e.g., 'feat:', 'fix(scope):')."
    );
    errors.push(
      "Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert."
    );
    failed = true;
  }

  // Check 2: Ticket Presence & Format
  if (REGEX_TICKET.test(title)) {
    // Ticket is present but full regex failed -> Warning
    warnings.push("Ticket reference found, but the format is incorrect.");
    warnings.push("Expected: `type(scope): TICKET subject`");
    warnings.push(
      "Example: `feat(learning-activity): SC-12345 description of changes`"
    );
  } else {
    // Ticket is missing -> Error
    errors.push("Ticket reference (e.g., SC-1234) is missing.");
    failed = true;
  }

  return { isValid: !failed, errors, warnings };
}

// CLI Execution
if (import.meta.main) {
  const title = Deno.args[0];
  if (!title) {
    console.error("Error: No title provided.");
    Deno.exit(1);
  }

  const { isValid, errors, warnings } = validateTitle(title);

  // Output Summary Header to stdout
  console.log(`## PR Title Validation
Validating title: ${title}
`);

  if (isValid) {
    console.log("✅ PR title is valid.");
  } else {
    console.log("❌ PR title validation failed.");
  }

  // Output Errors
  errors.forEach((err) => {
    console.error(`::error::${err}`); // Annotation to stderr
    console.log(`❌ ${err}`); // Markdown to stdout
  });

  // Output Warnings
  warnings.forEach((warn) => {
    console.error(`::warning::${warn}`); // Annotation to stderr
    console.log(`⚠️ ${warn}`); // Markdown to stdout
  });

  console.log(
    "See [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for more details."
  );

  if (!isValid) {
    Deno.exit(1);
  }
}
