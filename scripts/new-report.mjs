#!/usr/bin/env node
// Creates a new report file from templates/report-template.md, named
// YYYY-MM-DD-HHMM-[module]-[short-description].md (local system time), under
// reports/<module>/ (falls back to reports/general/ for an unknown module).
// No dependencies - plain Node fs/path only, matching this repo's own
// "keep it lightweight" rule.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const KNOWN_MODULES = ['futures', 'spot', 'prediction', 'exchange', 'infrastructure', 'security', 'general'];

const [, , moduleArg, ...descParts] = process.argv;
if (!moduleArg || descParts.length === 0) {
  console.error('Usage: node scripts/new-report.mjs <module> <short-description>');
  console.error(`Known modules: ${KNOWN_MODULES.join(', ')} (anything else falls back to "general")`);
  process.exit(1);
}

const moduleName = KNOWN_MODULES.includes(moduleArg) ? moduleArg : 'general';
if (moduleArg !== moduleName) {
  console.error(`Note: "${moduleArg}" is not a known module - filing under "general" instead.`);
}

const shortDescription = descParts.join('-').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

const now = new Date();
const pad = n => String(n).padStart(2, '0');
const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
const dateOnly = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

const fileName = `${stamp}-${moduleName}-${shortDescription}.md`;
const targetDir = path.join(ROOT, 'reports', moduleName);
const targetPath = path.join(targetDir, fileName);

if (fs.existsSync(targetPath)) {
  console.error(`Refusing to overwrite existing report: ${targetPath}`);
  process.exit(1);
}

const templatePath = path.join(ROOT, 'templates', 'report-template.md');
let content = fs.readFileSync(templatePath, 'utf8');
content = content.replace('- Date:', `- Date: ${dateOnly}`);
content = content.replace('- Module:', `- Module: ${moduleName}`);

fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(targetPath, content);
console.log(`Created: ${path.relative(ROOT, targetPath)}`);
