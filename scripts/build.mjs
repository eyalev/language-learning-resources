#!/usr/bin/env node
// Regenerates the consolidated distribution files from data/.
//
//   node scripts/build.mjs
//
// Reads  : data/languages.json, data/resources/*.json
// Writes : resources.json  (one array, every record carrying `language`)
//          resources.csv   (flat, one row per resource)
//          stats.json      (the counts quoted in README.md)
//
// Plain Node ESM, no dependencies. Node 18+ (uses only fs/path).

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RES_DIR = join(ROOT, 'data', 'resources');

// The platform labels that get their own CSV column. Anything else lands in
// `other_links`. Order here is the column order.
const PLATFORM_COLUMNS = [
  ['Apple Podcasts', 'apple_podcasts'],
  ['Spotify', 'spotify'],
  ['RSS', 'rss'],
  ['App Store', 'app_store'],
  ['Google Play', 'google_play'],
  ['YouTube', 'youtube'],
];

const languages = JSON.parse(readFileSync(join(ROOT, 'data', 'languages.json'), 'utf8'));
const langBySlug = new Map(languages.map((l) => [l.slug, l]));

const files = readdirSync(RES_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort();

const resources = [];
for (const file of files) {
  const slug = file.replace(/\.json$/, '');
  const arr = JSON.parse(readFileSync(join(RES_DIR, file), 'utf8'));
  if (!Array.isArray(arr)) throw new Error(`${file} is not a JSON array`);
  for (const r of arr) {
    // `language` is the file the record lives in: a language slug, or
    // "universal" for resources that work across many languages.
    resources.push({ language: slug, ...r });
  }
}

// Stable order: universal last, then by language slug, then by id.
resources.sort((a, b) => {
  const ua = a.language === 'universal' ? 1 : 0;
  const ub = b.language === 'universal' ? 1 : 0;
  if (ua !== ub) return ua - ub;
  if (a.language !== b.language) return a.language < b.language ? -1 : 1;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
});

// ---------------------------------------------------------------- resources.json

writeFileSync(join(ROOT, 'resources.json'), JSON.stringify(resources, null, 2) + '\n');

// ---------------------------------------------------------------- resources.csv

const csvEscape = (v) => {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const list = (v) => (Array.isArray(v) ? v.join('|') : '');

const header = [
  'id',
  'name',
  'url',
  'language',
  'languages',
  'types',
  'levels',
  'cefr',
  'skills',
  'price',
  'popularity',
  'methods',
  'tags',
  'pitch',
  'notes',
  ...PLATFORM_COLUMNS.map(([, col]) => col),
  'other_links',
];

const rows = [header.join(',')];
for (const r of resources) {
  const links = Array.isArray(r.links) ? r.links : [];
  const byLabel = new Map();
  const other = [];
  for (const l of links) {
    const known = PLATFORM_COLUMNS.some(([label]) => label === l.label);
    // Keep only the first URL per known label; the source data never has two,
    // but a duplicate must not silently replace the earlier one.
    if (known && !byLabel.has(l.label)) byLabel.set(l.label, l.url);
    else other.push(`${l.label}=${l.url}`);
  }
  rows.push(
    [
      r.id,
      r.name,
      r.url,
      r.language,
      list(r.languages),
      list(r.types),
      list(r.levels),
      r.cefr ?? '',
      list(r.skills),
      r.price,
      r.popularity ?? '',
      list(r.methods),
      list(r.tags),
      r.pitch,
      r.notes,
      ...PLATFORM_COLUMNS.map(([label]) => byLabel.get(label) ?? ''),
      other.join(' | '),
    ]
      .map(csvEscape)
      .join(','),
  );
}
// CRLF + UTF-8 BOM: what Excel needs to open a UTF-8 CSV without mangling
// Ελληνικά / 日本語 / العربية names.
writeFileSync(join(ROOT, 'resources.csv'), '﻿' + rows.join('\r\n') + '\r\n');

// ---------------------------------------------------------------- stats.json

const tally = (field) => {
  const out = {};
  for (const r of resources) {
    const v = r[field];
    if (v === undefined || v === null) continue;
    for (const x of Array.isArray(v) ? v : [v]) out[x] = (out[x] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(out).sort((a, b) => b[1] - a[1]));
};

const linkLabels = {};
for (const r of resources) for (const l of r.links || []) linkLabels[l.label] = (linkLabels[l.label] || 0) + 1;

const perLanguage = {};
for (const r of resources) {
  const e = (perLanguage[r.language] ||= { resources: 0, free: 0, withPlatformLinks: 0, platformLinks: 0 });
  e.resources++;
  if (r.price === 'free') e.free++;
  const n = (r.links || []).length;
  if (n) {
    e.withPlatformLinks++;
    e.platformLinks += n;
  }
}

const stats = {
  generated: new Date().toISOString().slice(0, 10),
  resources: resources.length,
  languageFiles: files.length,
  languages: files.filter((f) => f !== 'universal.json').length,
  universalResources: resources.filter((r) => r.language === 'universal').length,
  resourcesWithPlatformLinks: resources.filter((r) => (r.links || []).length > 0).length,
  platformLinks: resources.reduce((a, r) => a + (r.links || []).length, 0),
  uniquePrimaryDomains: new Set(
    resources
      .map((r) => {
        try {
          return new URL(r.url).hostname.replace(/^www\./, '');
        } catch {
          return null;
        }
      })
      .filter(Boolean),
  ).size,
  byPrice: tally('price'),
  byType: tally('types'),
  byLevel: tally('levels'),
  bySkill: tally('skills'),
  byMethod: tally('methods'),
  byPopularity: tally('popularity'),
  byPlatformLabel: Object.fromEntries(Object.entries(linkLabels).sort((a, b) => b[1] - a[1])),
  distinctTags: new Set(resources.flatMap((r) => r.tags || [])).size,
  perLanguage: Object.fromEntries(
    Object.entries(perLanguage).sort((a, b) => b[1].resources - a[1].resources),
  ),
  languagesDeclared: languages.length,
  languageNames: Object.fromEntries(languages.map((l) => [l.slug, l.name])),
};

writeFileSync(join(ROOT, 'stats.json'), JSON.stringify(stats, null, 2) + '\n');

// ---------------------------------------------------------------- report

const missingFile = languages.filter((l) => !files.includes(`${l.slug}.json`)).map((l) => l.slug);
const unknownFile = files
  .map((f) => f.replace(/\.json$/, ''))
  .filter((s) => s !== 'universal' && !langBySlug.has(s));

console.log(`resources.json  ${stats.resources} resources`);
console.log(`resources.csv   ${rows.length - 1} rows, ${header.length} columns`);
console.log(`stats.json      ${stats.languages} languages + universal, ${stats.platformLinks} platform links`);
if (missingFile.length) console.log(`note: declared in languages.json but no data file: ${missingFile.join(', ')}`);
if (unknownFile.length) console.log(`note: data file with no entry in languages.json: ${unknownFile.join(', ')}`);
