#!/usr/bin/env node
// Best-effort, pattern-based secret scanner for report files before commit.
// Not a guarantee - always also read the diff yourself. No dependencies,
// self-contained (this repo must not depend on AI-Bridge or anything else).

import fs from 'node:fs';
import path from 'node:path';

const SECRET_PATTERNS = [
  { name: 'generic key/value secret', re: /(api[_-]?key|secret|token|password|passwd|access[_-]?key|service[_-]?role[_-]?key|private[_-]?key|client[_-]?secret)\s*[:=]\s*["']?[A-Za-z0-9_\-./+=]{8,}["']?/gi },
  { name: 'PEM private key block', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g },
  { name: 'Bearer token', re: /Authorization:\s*Bearer\s+[A-Za-z0-9\-._~+/]+=*/gi },
  { name: 'JWT-shaped token', re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
  { name: 'Postgres/DB URI with embedded credentials', re: /postgres(?:ql)?:\/\/[^:/\s]+:[^@/\s]+@/gi },
  { name: 'AWS access key id', re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: 'OpenAI/Anthropic-shaped API key', re: /\b(sk-[A-Za-z0-9]{16,}|sk-ant-[A-Za-z0-9-]{16,}|sk-proj-[A-Za-z0-9]{16,})\b/g },
  { name: 'Telegram bot token', re: /\b\d{6,10}:[A-Za-z0-9_-]{30,40}\b/g },
  { name: 'GitHub token', re: /\bgh[pousr]_[A-Za-z0-9]{30,}\b/g },
];

const targets = process.argv.slice(2);
if (targets.length === 0) {
  console.error('Usage: node scripts/scan-secrets.mjs <file-or-directory> [...]');
  process.exit(1);
}

function collectFiles(target) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    return fs.readdirSync(target, { withFileTypes: true }).flatMap(entry => {
      if (entry.name === '.git' || entry.name === 'node_modules') return [];
      const full = path.join(target, entry.name);
      return entry.isDirectory() ? collectFiles(full) : [full];
    });
  }
  return [target];
}

let anyFound = false;
for (const target of targets) {
  if (!fs.existsSync(target)) {
    console.error(`Skipping - does not exist: ${target}`);
    continue;
  }
  for (const file of collectFiles(target)) {
    const content = fs.readFileSync(file, 'utf8');
    for (const { name, re } of SECRET_PATTERNS) {
      const matches = content.match(re);
      if (matches) {
        anyFound = true;
        console.log(`POSSIBLE SECRET (${name}) in ${file}:`);
        for (const m of matches) console.log(`  ${m.slice(0, 60)}${m.length > 60 ? '...' : ''}`);
      }
    }
  }
}

console.log(anyFound ? '\nReview the matches above before committing - redact anything that is a real secret.' : '\nNo obvious secret patterns found. This is not a guarantee - still read the diff yourself.');
process.exit(anyFound ? 1 : 0);
