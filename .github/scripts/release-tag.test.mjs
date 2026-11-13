import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createReleaseTag, nextReleaseTag } from "./release-tag.mjs";

test("continues the existing beta series numerically", () => {
  assert.equal(nextReleaseTag(["v1.0.0-beta", "v1.0.0-beta.6"]), "v1.0.0-beta.7");
  assert.equal(nextReleaseTag(["v1.0.0-beta.9", "v1.0.0-beta.10"]), "v1.0.0-beta.11");
  assert.equal(nextReleaseTag(["v1.0.0-beta"]), "v1.0.0-beta.1");
});

test("switches to patch bumps after a stable release", () => {
  assert.equal(nextReleaseTag(["v1.0.0", "v1.0.0-beta.10"]), "v1.0.1");
  assert.equal(nextReleaseTag(["v1.2.9", "v1.2.10", "v1.1.99"]), "v1.2.11");
  assert.equal(nextReleaseTag(["v1.0.5", "v2.0.0-beta.2"]), "v2.0.0-beta.3");
});

test("handles an empty repository and ignores unrelated tags", () => {
  assert.equal(nextReleaseTag([]), "v0.1.0");
  assert.equal(nextReleaseTag(["snapshot", "v1.0.0-beta.6", "v1.0.0-beta.bad"]), "v1.0.0-beta.7");
});

test("publishes the checked-out commit and reuses its tag on retry", (t) => {
  const root = mkdtempSync(join(tmpdir(), "meditation-release-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const remote = join(root, "remote.git");
  const checkout = join(root, "checkout");
  const git = (cwd, ...args) => execFileSync("git", args, {
    cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"],
  }).trim();
  git(root, "init", "--bare", remote);
  git(root, "clone", remote, checkout);
  git(checkout, "config", "user.name", "Release test");
  git(checkout, "config", "user.email", "release@example.test");
  git(checkout, "commit", "--allow-empty", "-m", "Initial version");
  git(checkout, "tag", "v1.0.0-beta.6");
  git(checkout, "push", "origin", "HEAD:refs/heads/main", "--tags");
  git(checkout, "commit", "--allow-empty", "-m", "Next version");
  const sha = git(checkout, "rev-parse", "HEAD");
  assert.equal(createReleaseTag(checkout), "v1.0.0-beta.7");
  assert.equal(git(remote, "rev-parse", "v1.0.0-beta.7"), sha);
  assert.equal(createReleaseTag(checkout), "v1.0.0-beta.7");

  // An older commit can finish CI after a newer main commit has been pushed.
  git(checkout, "commit", "--allow-empty", "-m", "Later version");
  const laterSha = git(checkout, "rev-parse", "HEAD");
  git(checkout, "push", "origin", "HEAD:refs/heads/main");
  git(checkout, "checkout", "--detach", sha);
  assert.equal(createReleaseTag(checkout), "v1.0.0-beta.7");
  git(checkout, "checkout", "--detach", laterSha);
  assert.equal(createReleaseTag(checkout), "v1.0.0-beta.8");
  assert.equal(git(remote, "rev-parse", "v1.0.0-beta.8"), laterSha);
});
