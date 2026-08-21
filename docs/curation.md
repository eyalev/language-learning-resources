# How it was curated

Every language file was built the same way, one language at a time:

1. **Research.** A candidate list was assembled from what the relevant learner
   communities actually recommend — r/languagelearning and the
   language-specific subreddits, well-known blogs and teachers, plus each
   country's public broadcaster and language institute. LLM-assisted research
   under a fixed prompt did the first pass; the bar is *best-of, not
   exhaustive*, and "when in doubt, leave it out".
2. **Write.** Each entry gets a pitch and 2–4 sentences of notes covering what
   it is, what it is good at, who it suits, and the caveat — the price tier,
   whether it is still maintained, what it does badly. Never marketing copy.
3. **Machine validation.** `scripts/validate.mjs`: schema, controlled
   vocabularies, cross-file id uniqueness, URL sanity, text length. Must pass
   with zero errors.
4. **Link check.** Every URL is fetched; 404/410/5xx are fixed or the entry is
   dropped. 403/405/429 are treated as "alive but bot-protected", not dead.
5. **Spot review.** Random entries per file are re-checked against the live
   site: is the price still right, is it still running, is the URL still the
   canonical one.

Each language file targets 25–35 entries with at least five fully-free ones, a
spread across types and levels including advanced, and dialect or script
coverage where it matters. Resources that work generically for four or more
languages live only in `universal.json`.

### How the platform links were verified

The `links` array is the part of this dataset that is most tedious to
reproduce, so it is worth being precise about where those URLs came from. Two
mechanisms, both of which only ever *record* a URL that a third party published:

- **Apple's public iTunes Search API** for podcasts and apps. The API returns
  the Apple Podcasts page, the RSS feed and the App Store page; a name
  similarity guard rejects loose matches, so a podcast is never linked to a
  same-titled different show.
- **The resource's own website** for Spotify, YouTube and Google Play — the
  "Subscribe in: Apple Podcasts · Spotify · RSS" row that podcasts publish
  themselves, matched by strict per-platform URL patterns. A page offering many
  different shows is treated as a directory and skipped. Every candidate URL is
  then fetched and only kept if it responds.

Nothing is constructed from a slug or a guess. All 555 links carrying one of
the five host-checkable platform labels resolve to that platform's own domain.

### Link check, 2026-08-20

All 1,589 URLs in the dataset (838 primary + 751 platform links) were fetched
on 2026-08-20:

| Result | Count |
| --- | ---: |
| 2xx / 3xx | 1,552 |
| 403 / 405 / 429 — alive but bot-protected (Goethe, Cambridge, Britannica, …) | 34 |
| Could not be confirmed | 3 |
| **404 / 410 — dead** | **0** |

The first pass flagged 19 failures; 15 of those returned 200 on an unhurried
retry, which is what a concurrent crawl does to small hosts — treat a single
failing run as a hint, not a verdict. The three that stayed unconfirmed are
listed under [Known issues](#known-issues). Reproduce with
`node scripts/linkcheck.mjs`.

---
