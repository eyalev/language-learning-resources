#!/usr/bin/env node
// Checks data/resources/*.json against SCHEMA.md. Exits non-zero on any error.
//
//   node scripts/validate.mjs           # errors only
//   node scripts/validate.mjs --warn    # also print warnings (plain http, etc.)
//
// This is a structural check. It does not fetch anything — for that see
// scripts/linkcheck.mjs.

import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const RES_DIR = join(ROOT, 'data', 'resources');
const SHOW_WARNINGS = process.argv.includes('--warn');

const TYPES = ['app', 'course', 'podcast', 'youtube', 'book', 'website', 'dictionary', 'tutoring', 'community', 'tool', 'media'];
const LEVELS = ['beginner', 'intermediate', 'advanced'];
const SKILLS = ['listening', 'speaking', 'reading', 'writing', 'vocabulary', 'grammar', 'pronunciation', 'immersion'];
const PRICES = ['free', 'freemium', 'paid'];
const METHODS = ['flashcards', 'structured-course', 'audio-method', 'comprehensible-input', 'graded-reading', 'conversation-practice', 'pronunciation-training', 'grammar-reference', 'authentic-media', 'gamified'];
const REQUIRED = ['id', 'name', 'url', 'types', 'languages', 'levels', 'skills', 'price', 'pitch', 'notes'];

const languages = JSON.parse(readFileSync(join(ROOT, 'data', 'languages.json'), 'utf8'));
const langSlugs = new Set(languages.map((l) => l.slug));
const variantTags = new Set(languages.flatMap((l) => (l.variants || []).map((v) => v.tag)));

const errors = [];
const warnings = [];

const files = readdirSync(RES_DIR).filter((f) => f.endsWith('.json')).sort();
const seenId = new Map();
const seenUrl = new Map();
let count = 0;

const checkUrl = (url, where, sink) => {
  if (typeof url !== 'string' || !url) return sink.push(`${where}: url missing or not a string`);
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return sink.push(`${where}: unparseable url ${JSON.stringify(url)}`);
  }
  if (!/^https?:$/.test(parsed.protocol)) sink.push(`${where}: non-http(s) url ${url}`);
  else if (parsed.protocol === 'http:') warnings.push(`${where}: plain http (no TLS) ${url}`);
  if (!parsed.hostname.includes('.')) sink.push(`${where}: implausible hostname in ${url}`);
  if (/\s/.test(url)) sink.push(`${where}: whitespace in url ${url}`);
};

const subsetOf = (allowed) => (v) => Array.isArray(v) && v.length > 0 && v.every((x) => allowed.includes(x));

for (const file of files) {
  const fileSlug = file.replace(/\.json$/, '');
  let arr;
  try {
    arr = JSON.parse(readFileSync(join(RES_DIR, file), 'utf8'));
  } catch (e) {
    errors.push(`${file}: does not parse — ${e.message}`);
    continue;
  }
  if (!Array.isArray(arr)) {
    errors.push(`${file}: top level is not an array`);
    continue;
  }
  if (fileSlug !== 'universal' && !langSlugs.has(fileSlug)) {
    errors.push(`${file}: no matching slug in data/languages.json`);
  }

  arr.forEach((r, i) => {
    count++;
    const where = `${file}[${i}] ${r?.id ?? '(no id)'}`;
    if (typeof r !== 'object' || r === null) return errors.push(`${where}: not an object`);

    for (const k of REQUIRED) {
      const v = r[k];
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0)) {
        errors.push(`${where}: required field "${k}" is missing or empty`);
      }
    }

    if (typeof r.id === 'string') {
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(r.id)) errors.push(`${where}: id is not kebab-case`);
      if (seenId.has(r.id)) errors.push(`${where}: duplicate id, also in ${seenId.get(r.id)}`);
      else seenId.set(r.id, file);
    }

    checkUrl(r.url, `${where} url`, errors);
    if (typeof r.url === 'string') {
      const key = r.url.replace(/\/$/, '').toLowerCase();
      if (seenUrl.has(key)) warnings.push(`${where}: same url as ${seenUrl.get(key)}`);
      else seenUrl.set(key, r.id);
    }

    if (!subsetOf(TYPES)(r.types)) errors.push(`${where}: types must be a non-empty subset of ${TYPES.join('|')}`);
    if (!subsetOf(LEVELS)(r.levels)) errors.push(`${where}: levels must be a non-empty subset of ${LEVELS.join('|')}`);
    if (!subsetOf(SKILLS)(r.skills)) errors.push(`${where}: skills must be a non-empty subset of ${SKILLS.join('|')}`);
    if (!PRICES.includes(r.price)) errors.push(`${where}: price must be one of ${PRICES.join('|')}`);

    if (!Array.isArray(r.languages)) errors.push(`${where}: languages must be an array`);
    else {
      for (const l of r.languages) {
        if (l !== '*' && !langSlugs.has(l)) errors.push(`${where}: unknown language slug "${l}"`);
      }
      if (fileSlug === 'universal') {
        if (!r.languages.includes('*')) errors.push(`${where}: entries in universal.json must have languages ["*"]`);
      } else if (!r.languages.includes(fileSlug)) {
        errors.push(`${where}: lives in ${file} but languages is ${JSON.stringify(r.languages)}`);
      }
    }

    if (r.methods !== undefined) {
      if (!Array.isArray(r.methods)) errors.push(`${where}: methods must be an array`);
      else for (const m of r.methods) if (!METHODS.includes(m)) errors.push(`${where}: unknown method "${m}"`);
    }

    if (r.popularity !== undefined && (!Number.isInteger(r.popularity) || r.popularity < 1 || r.popularity > 5)) {
      errors.push(`${where}: popularity must be an integer 1-5, got ${JSON.stringify(r.popularity)}`);
    }

    if (r.cefr !== undefined && !/^[A-C][0-2](–[A-C][0-2])?$/.test(r.cefr)) {
      errors.push(`${where}: cefr must look like "A1" or "A1–B2" (en dash), got ${JSON.stringify(r.cefr)}`);
    }

    if (r.tags !== undefined) {
      if (!Array.isArray(r.tags)) errors.push(`${where}: tags must be an array`);
      else for (const t of r.tags) if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t)) errors.push(`${where}: tag "${t}" is not kebab-case`);
    }

    if (r.links !== undefined) {
      if (!Array.isArray(r.links)) errors.push(`${where}: links must be an array`);
      else {
        const seenLink = new Set();
        r.links.forEach((l, j) => {
          if (!l || typeof l.label !== 'string' || !l.label) errors.push(`${where}: links[${j}] has no label`);
          checkUrl(l?.url, `${where} links[${j}] (${l?.label})`, errors);
          const key = `${l?.label}|${l?.url}`;
          if (seenLink.has(key)) warnings.push(`${where}: links[${j}] repeats ${l?.label} ${l?.url}`);
          else seenLink.add(key);
        });
      }
    }

    if (typeof r.pitch === 'string' && r.pitch.length > 110) warnings.push(`${where}: pitch is ${r.pitch.length} chars (target ~90)`);
    if (typeof r.notes === 'string' && r.notes.length < 80) warnings.push(`${where}: notes is only ${r.notes.length} chars (target 2-4 sentences)`);
  });
}

// Variant tags declared in languages.json but never used by any resource: the
// site that consumes this data builds variant pages from them, so an unused
// tag usually means the resources were tagged with something else.
const usedTags = new Set();
for (const file of files) {
  for (const r of JSON.parse(readFileSync(join(RES_DIR, file), 'utf8'))) for (const t of r.tags || []) usedTags.add(t);
}
for (const t of variantTags) if (!usedTags.has(t)) warnings.push(`languages.json declares variant tag "${t}" that no resource carries`);

console.log(`checked ${count} resources in ${files.length} files`);
for (const e of errors) console.log(`ERROR  ${e}`);
if (SHOW_WARNINGS) for (const w of warnings) console.log(`warn   ${w}`);
console.log(`${errors.length} errors, ${warnings.length} warnings${SHOW_WARNINGS ? '' : ' (run with --warn to list warnings)'}`);
process.exit(errors.length ? 1 : 0);
