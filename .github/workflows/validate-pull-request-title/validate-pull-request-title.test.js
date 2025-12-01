import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { validateTitle } from "./validate-pull-request-title.js";

describe("PR Title Validation", () => {
  const validCases = [
    {
      title: "feat(api): SC-1234 Add new endpoint",
      desc: "accepts standard feature with scope and ticket",
    },
    {
      title: "fix: AI-5678 Fix crash on startup",
      desc: "accepts fix with ticket and no scope",
    },
    {
      title: "chore: PT-999 Update dependencies",
      desc: "accepts chore with PT ticket",
    },
    {
      title: "revert(auth): SC-0000 Revert bad commit",
      desc: "accepts revert with scope and ticket",
    },
    {
      title: "feat(api): SC-1234-description-with-hyphens",
      desc: "accepts hyphen as separator after ticket",
    },
  ];

  describe("Valid Titles", () => {
    validCases.forEach(({ title, desc }) => {
      it(desc, () => {
        const result = validateTitle(title);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
        expect(result.warnings).toEqual([]);
      });
    });
  });

  const warningCases = [
    {
      title: "feat: Add feature SC-1234",
      desc: "warns when ticket is at the end",
      expectedWarningMatch: /format is incorrect/,
    },
  ];

  describe("Warnings", () => {
    warningCases.forEach(({ title, desc, expectedWarningMatch }) => {
      it(desc, () => {
        const result = validateTitle(title);
        expect(result.isValid).toBe(true);
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.warnings[0]).toMatch(expectedWarningMatch);
      });
    });
  });

  const invalidCases = [
    {
      title: "feat: Add feature",
      desc: "fails when ticket is missing",
      expectedErrorMatch: /Ticket reference.*missing/,
    },
    {
      title: "random: SC-1234 Add feature",
      desc: "fails when prefix is invalid",
      expectedErrorMatch: /valid conventional commit prefix/,
    },
    {
      title: "feat(api) SC-1234 Missing colon",
      desc: "fails when colon is missing",
      expectedErrorMatch: /valid conventional commit prefix/,
    },
    {
      title: "Update README",
      desc: "fails when completely malformed",
      expectedErrorMatch: /valid conventional commit prefix/,
    },
    {
      title: "SC-1234 feat: Add feature",
      desc: "fails when ticket is at the start (invalid prefix)",
      expectedErrorMatch: /valid conventional commit prefix/,
    },
  ];

  describe("Invalid Titles", () => {
    invalidCases.forEach(({ title, desc, expectedErrorMatch }) => {
      it(desc, () => {
        const result = validateTitle(title);
        expect(result.isValid).toBe(false);
        expect(result.errors.some((e) => expectedErrorMatch.test(e))).toBe(
          true
        );
      });
    });
  });
});
