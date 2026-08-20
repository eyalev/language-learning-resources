# Contributing

Corrections are the most valuable contribution here. Links rot, free tiers
disappear, and podcasts stop publishing — the dataset is only as good as the
last person who checked it.

## Reporting something wrong

Open an issue with the resource `id` and what is wrong. A link that shows it is
enough; you do not need to propose a fix.

Useful reports: a dead or redirected URL, a price that changed tier
(`free` → `freemium` → `paid`), a resource that has stopped being maintained,
notes that describe something the resource no longer does, a mis-tagged dialect
or script variant, a resource filed under the wrong language.

## Editing the data

1. Edit the relevant `data/resources/<language>.json`. That is the only source
   of truth.
2. Run `node scripts/validate.mjs --warn`. It must exit 0. Node 18+, no
   dependencies to install.
3. Run `node scripts/build.mjs` to regenerate `resources.json`,
   `resources.csv` and `stats.json`, and commit those too.
4. Open a pull request describing what you changed and how you verified it.

Do not hand-edit `resources.json`, `resources.csv` or `stats.json` — the next
build overwrites them.

`SCHEMA.md` documents every field and its allowed values. New values for
`types`, `levels`, `skills`, `price` or `methods` need a discussion first;
those vocabularies are deliberately small, and the validator rejects anything
outside them.

## Adding a resource

The bar is *best-of, not exhaustive*. A new entry needs:

- **A URL you have opened**, today. Not one you remember.
- **A concrete `pitch`** — one line, under about 90 characters, saying what it
  actually is. Not what it promises.
- **Honest `notes`** — 2–4 sentences: what it is, what it is good at, who it
  suits, and the caveat. Every resource has a caveat; an entry without one
  reads as advertising and will be edited or declined.
- **Correct `price`.** `free` means the whole thing is usable at no cost,
  `freemium` means a free tier a learner can genuinely get value from, `paid`
  means you must pay to get anything.
- **A unique kebab-case `id`**, unique across every file, not just yours.

A resource that works generically for four or more languages belongs in
`universal.json` with `"languages": ["*"]`, not copied into each language file.

Please disclose any affiliation with a resource you are adding. It is not
disqualifying; undisclosed, it is.

## Licensing of contributions

By contributing you agree that your contributions to the data are licensed
under CC BY 4.0, and contributions to `scripts/` under MIT, matching the rest
of the repository.
