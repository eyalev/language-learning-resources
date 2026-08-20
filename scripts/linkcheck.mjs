#!/usr/bin/env node
// Fetches every URL in the dataset (primary `url` plus each `links[].url`) and
// writes one JSON object per line so the result can be grepped and diffed.
//
//   node scripts/linkcheck.mjs                        # → linkcheck.jsonl
//   node scripts/linkcheck.mjs out.jsonl --only=thai  # one language file
//
// Reading the output:
//   2xx/3xx  fine
//   403/405/429  alive but bot-protected — the site refuses this client, not
//                proof the page is gone. Check by hand before deleting an entry.
//   404/410/5xx/0  real problems: dead, moved, or unreachable.
//
// Deliberately polite: 12 concurrent requests, 20s timeout, one pass.

import { readdirSync, readFileSync, createWriteStream } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RES_DIR = join(ROOT, 'data', 'resources');
const args = process.argv.slice(2);
const out = args.find((a) => !a.startsWith('--')) || join(ROOT, 'linkcheck.jsonl');
const only = (args.find((a) => a.startsWith('--only=')) || '').split('=')[1] || '';

const UA = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,*/*',
};

const jobs = [];
for (const file of readdirSync(RES_DIR).filter((f) => f.endsWith('.json') && (!only || f === `${only}.json`)).sort()) {
  for (const r of JSON.parse(readFileSync(join(RES_DIR, file), 'utf8'))) {
    jobs.push({ file, id: r.id, kind: 'primary', label: '', url: r.url });
    for (const l of r.links || []) jobs.push({ file, id: r.id, kind: 'platform', label: l.label, url: l.url });
  }
}

const stream = createWriteStream(out);
let next = 0;
let done = 0;

async function check(job) {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 20000);
  let status = 0;
  let error = '';
  try {
    const res = await fetch(job.url, { headers: UA, redirect: 'follow', signal: ctl.signal });
    status = res.status;
    // Drain the body so the socket is released rather than left half-open.
    try {
      await res.arrayBuffer();
    } catch {}
  } catch (e) {
    error = String(e?.message || e).slice(0, 120);
  } finally {
    clearTimeout(timer);
  }
  stream.write(JSON.stringify({ ...job, status, error }) + '\n');
  if (++done % 200 === 0) process.stderr.write(`  ${done}/${jobs.length}\n`);
}

await Promise.all(
  Array.from({ length: 12 }, async () => {
    while (next < jobs.length) await check(jobs[next++]);
  }),
);
stream.end();
process.stderr.write(`checked ${jobs.length} urls → ${out}\n`);
