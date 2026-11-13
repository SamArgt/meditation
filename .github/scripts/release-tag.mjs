import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

// Continue this repository's beta series, or patch releases after a stable tag.
function releaseTags(tags) {
  return tags.flatMap((tag) => {
    const match = /^v(\d+)\.(\d+)\.(\d+)(-beta(?:\.(\d+))?)?$/.exec(tag);
    if (!match) return [];
    const [, major, minor, patch, beta, sequence] = match;
    return [{
      tag,
      parts: [Number(major), Number(minor), Number(patch), beta ? 0 : 1, Number(sequence || 0)],
    }];
  }).sort((a, b) => {
    for (let i = 0; i < a.parts.length; i++) {
      if (a.parts[i] !== b.parts[i]) return b.parts[i] - a.parts[i];
    }
    return 0;
  });
}

export function nextReleaseTag(tags) {
  const latest = releaseTags(tags)[0];
  if (!latest) return "v0.1.0";
  const [major, minor, patch, stable, sequence] = latest.parts;
  return stable
    ? `v${major}.${minor}.${patch + 1}`
    : `v${major}.${minor}.${patch}-beta.${sequence + 1}`;
}

export function createReleaseTag(cwd = process.cwd()) {
  const git = (...args) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
  const sha = git("rev-parse", "HEAD");
  let lastError;

  // A competing main push can claim a tag between fetch and push. Refresh and retry.
  for (let attempt = 0; attempt < 5; attempt++) {
    git("fetch", "--tags", "origin");
    const existing = releaseTags(git("tag", "--points-at", sha).split("\n"))[0];
    if (existing) return existing.tag; // Re-running a release reuses its version.

    const tag = nextReleaseTag(git("tag", "--list").split("\n"));
    try {
      // Push the exact checked-out commit. Never move an existing tag.
      git("push", "origin", `${sha}:refs/tags/${tag}`);
      return tag;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const tag = createReleaseTag();
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `tag=${tag}\n`);
  console.log(`Release tag: ${tag}`);
}
