# Language learning resources — an open dataset

838 curated language-learning resources across 32 languages, as structured
JSON and CSV. Apps, courses, podcasts, YouTube channels, books, dictionaries,
tools and communities — each with a one-line pitch, 2–4 sentences of honest
notes, and machine-readable facets: type, CEFR range, level, skills practised,
learning method, and price.

329 of them also carry verified platform links (Apple Podcasts, Spotify, RSS,
App Store, Google Play, YouTube) — 751 in total — which were found by reading
Apple's public catalogue and each resource's own website, never constructed
from a name.

This is the data behind [howtolearn.app](https://howtolearn.app), published
under CC BY 4.0 so it can be used, forked and corrected by anyone.

---

## What is in it

| | |
| --- | --- |
| Resources | **838** |
| Languages | **32** (+ 36 language-agnostic resources in `universal.json`) |
| Unique domains linked | **590** |
| Resources with platform links | **329**, carrying **751** links |
| Free / freemium / paid | **468** / **234** / **136** |
| Distinct tags | 344 |

By type — a resource can be several, so these sum to more than 838:

| Type | Count | Type | Count |
| --- | ---: | --- | ---: |
| `course` | 258 | `book` | 92 |
| `website` | 217 | `tool` | 92 |
| `podcast` | 204 | `dictionary` | 89 |
| `youtube` | 197 | `app` | 81 |
| `media` | 108 | `community` | 40 |
| | | `tutoring` | 37 |

By learning method — *how* the resource works, which is orthogonal to what
format it is. Anki and Duolingo are both apps; one is `flashcards`, the other
`structured-course` + `gamified`:

| Method | Count | Method | Count |
| --- | ---: | --- | ---: |
| `structured-course` | 225 | `graded-reading` | 40 |
| `comprehensible-input` | 182 | `pronunciation-training` | 31 |
| `grammar-reference` | 114 | `flashcards` | 19 |
| `authentic-media` | 92 | `audio-method` | 18 |
| `conversation-practice` | 42 | `gamified` | 6 |

177 records carry no method, because none of the ten genuinely applies
(dictionaries, communities, most tools).

### Coverage per language

Coverage is deliberately best-of rather than exhaustive, and it is uneven —
see [Limitations](#limitations).

| Language | Slug | Resources | Free | With platform links |
| --- | --- | ---: | ---: | ---: |
| *(language-agnostic)* | `universal` | 36 | 8 | 19 |
| Arabic | `arabic` | 35 | 18 | 9 |
| Chinese (Mandarin) | `chinese` | 35 | 16 | 17 |
| Japanese | `japanese` | 35 | 20 | 13 |
| English | `english` | 34 | 17 | 14 |
| German | `german` | 34 | 18 | 13 |
| French | `french` | 31 | 12 | 17 |
| Italian | `italian` | 31 | 12 | 13 |
| Russian | `russian` | 31 | 14 | 9 |
| Spanish | `spanish` | 30 | 13 | 16 |
| Korean | `korean` | 29 | 21 | 12 |
| Hebrew | `hebrew` | 27 | 13 | 13 |
| Portuguese | `portuguese` | 27 | 8 | 14 |
| Polish | `polish` | 25 | 14 | 9 |
| Dutch | `dutch` | 24 | 14 | 10 |
| Persian | `persian` | 24 | 16 | 7 |
| Ukrainian | `ukrainian` | 24 | 18 | 9 |
| Cantonese | `cantonese` | 23 | 18 | 9 |
| Finnish | `finnish` | 23 | 19 | 6 |
| Danish | `danish` | 22 | 17 | 6 |
| Hindi | `hindi` | 22 | 13 | 7 |
| Norwegian | `norwegian` | 22 | 12 | 8 |
| Czech | `czech` | 21 | 16 | 8 |
| Greek | `greek` | 21 | 12 | 7 |
| Turkish | `turkish` | 21 | 12 | 6 |
| Romanian | `romanian` | 20 | 16 | 6 |
| Swedish | `swedish` | 20 | 14 | 6 |
| Thai | `thai` | 20 | 6 | 9 |
| Vietnamese | `vietnamese` | 20 | 10 | 11 |
| Hungarian | `hungarian` | 19 | 13 | 9 |
| Filipino | `filipino` | 18 | 12 | 7 |
| Indonesian | `indonesian` | 17 | 12 | 5 |
| Swahili | `swahili` | 17 | 14 | 5 |

Six languages declare dialect or script variants that individual resources are
tagged with — Spanish, Portuguese, Chinese, Arabic, English and Norwegian — so
"European Portuguese podcasts" or "Levantine Arabic" can be filtered rather
than guessed at.

---

## Files

```
data/
  resources/<language>.json   source data, one file per language + universal.json
  languages.json              32 language records: slug, ISO code, endonym, variants
  SOURCE.txt                  which upstream commit this snapshot came from
resources.json                generated — every resource in one array, with `language`
resources.csv                 generated — one row per resource, arrays joined with |
stats.json                    generated — the counts quoted above
scripts/
  build.mjs                   regenerates resources.json / resources.csv / stats.json
  validate.mjs                schema + integrity check, exits non-zero on error
  linkcheck.mjs               fetches every URL, writes JSONL results
  sync.sh                     re-pulls data/ from the upstream howtolearn repo
SCHEMA.md                     every field, type and allowed value
```

`data/resources/*.json` is the source of truth; the three files at the root are
generated from it and committed so you can use them without running anything.
No dependencies, no build step required — `scripts/build.mjs` is plain Node ESM
(Node 18+) and only touches the standard library.

```
node scripts/validate.mjs --warn   # check the data
node scripts/build.mjs             # regenerate resources.json / .csv / stats.json
```

## Using it

A record looks like this:

```json
{
  "language": "spanish",
  "id": "notes-in-spanish",
  "name": "Notes in Spanish",
  "url": "https://www.notesinspanish.com/",
  "types": ["podcast", "course"],
  "languages": ["spanish"],
  "levels": ["beginner", "intermediate", "advanced"],
  "cefr": "A1–C1",
  "skills": ["listening", "vocabulary", "speaking"],
  "price": "freemium",
  "popularity": 3,
  "methods": ["comprehensible-input"],
  "tags": ["castilian-spanish"],
  "pitch": "Unscripted conversations between Ben and Marina, graded across three clear levels.",
  "notes": "Running since 2005 with a huge free archive split into Inspired Beginners, Intermediate and Advanced, it is the classic answer to 'I want to hear real Spaniards talking, not actors reading a script'. The audio is free; worksheets and transcripts are sold as paid packs, which is the main catch since the advanced episodes are genuinely hard without them. Madrid Spanish throughout, so expect vosotros and peninsular vocabulary.",
  "links": [
    { "label": "Apple Podcasts", "url": "https://podcasts.apple.com/us/podcast/learn-spanish-notes-in-spanish-inspired-beginners/id257441540" },
    { "label": "RSS", "url": "https://rss.libsyn.com/shows/19057/destinations/14862.xml" },
    { "label": "Spotify", "url": "https://open.spotify.com/show/6kf6aCHaI9WsPVL2PuvRom" }
  ]
}
```

That is a verbatim record — the `notes` field is that length throughout, and
the caveat ("worksheets and transcripts are sold as paid packs") is the part
that makes the dataset worth more than a list of links.

Every free podcast a beginner can start with, in any language — 42 of them,
with `jq`:

```bash
jq -r '.[] | select((.types | index("podcast"))
                    and .price == "free"
                    and (.levels | index("beginner")))
       | [.language, .name, .url] | @tsv' resources.json
```

Every RSS feed in the dataset, one per line — a ready-made podcast OPML source:

```bash
jq -r '.[] | .links[]? | select(.label == "RSS") | .url' resources.json
```

Python:

```python
import json, collections
rows = json.load(open("resources.json"))
by_method = collections.Counter(m for r in rows for m in r.get("methods", []))
comprehensible_input = [r for r in rows if "comprehensible-input" in r.get("methods", [])]
```

Or open `resources.csv` in a spreadsheet — it has one row per resource, arrays
joined with `|`, and the six common platforms broken out into their own
columns (`apple_podcasts`, `spotify`, `rss`, `app_store`, `google_play`,
`youtube`).

Full field reference, allowed values and the parts of the data that are *not*
strictly structured: [SCHEMA.md](SCHEMA.md).

---

## How it was curated

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

## Limitations

Read these before building anything that treats the data as authoritative.

- **It is opinionated.** This is a curated best-of, not a census. Absence of a
  resource is not a judgement, and presence means one curator thought it was
  worth a learner's time. Reasonable people will disagree about specific
  entries.
- **Coverage is uneven.** 17 entries for Swahili against 35 for Japanese. The
  thin languages are thin because fewer good resources exist *and* because less
  curation effort went in — you cannot read the counts as a measure of what is
  available in the world.
- **English is the assumed starting language.** Almost every resource is aimed
  at learners who speak English. A German speaker learning Polish is not well
  served here.
- **`popularity` is a subjective estimate**, not a measurement. No download
  counts, no traffic data — it is a 1–5 curator judgement of how widely known
  a resource is within *that language's* learner community, so the scale is not
  comparable across languages.
- **Notes are point-in-time.** Prices, free tiers and "still actively updated"
  were true when the entry was written (all entries were written in
  August 2026). Freemium tiers change constantly. There is no per-record
  `verified_at` field yet — that is a known gap.
- **`tags` are not a controlled vocabulary.** 344 distinct values, some
  duplicating `skills`/`methods`. Only the variant tags declared in
  `data/languages.json` are safe to build a filter on.
- **Flags are rough markers.** `data/languages.json` carries an emoji flag per
  language for UI purposes. A flag is a country, a language is not — Spanish is
  not Spain and Arabic is not Saudi Arabia.
- **Link verification covers reachability, not correctness.** A 200 means the
  URL resolves, not that the page still contains what the notes describe. Only
  a sample of entries has been re-read against the live site.
- **Language selection reflects demand, not linguistic importance.** 32
  languages with no regional or minority-language coverage.

## Known issues

Found by `scripts/validate.mjs --warn` and the 2026-08-20 link check. They are
listed rather than silently patched:

- **Three URLs could not be confirmed alive.** `danskioererne.dk`
  (`dansk-i-oererne`) answers HTTP 454 with `Vary: Cookie` — a cookie/bot gate
  rather than a clear 404; `danskherognu.dk` (`dansk-her-og-nu`) returns a 302
  redirect loop to itself; `turkce.yee.org.tr` (`yunus-emre-turkce`) serves an
  incomplete TLS certificate chain and then 403s. All three probably still work
  in a real browser — they need a human look. This and the four self-signed
  hosts above are one class of finding: browsers routinely complete an
  incomplete chain by fetching the missing intermediate, and follow cookie
  gates, where `curl` will not. **A failed request must never auto-remove a
  resource** — a link audit produces a list for a human, not a delete list.
- **Four URLs are plain `http://`, deliberately.** Of the eight originally
  found, four were upgraded once `https` was confirmed to answer 200
  (`swahili-grammar-guide`, and the platform links on `finnish-with-eemeli`,
  `ulpan-or`, `turkish-tea-time`). The remaining four stay on `http` because
  upgrading them makes things worse, not better: `basby-dansk` (basby.dk),
  `sealang-indonesian` (sealang.net) and `thai-language-com` all present a
  **self-signed certificate** over `https`, and `filoglossia`
  (www.xanthi.ilsp.gr) times out over `https` entirely. All four answer 200 over
  `http`. Rewriting them would send readers to a full-page browser security
  interstitial instead of a working page. Verified 2026-08-20 — re-test before
  changing.
- **Two declared variant tags are unused.** `data/languages.json` declares
  `simplified-chinese` and `traditional-chinese` for Chinese, but the Chinese
  resources are tagged `simplified` and `traditional` instead. Anything
  filtering Chinese by script variant using the declared tags gets nothing.
- **Two records list the same RSS feed twice.**
  `bahasa-indonesia-bersama-windah` and `podgap` each carry an identical `RSS`
  entry in `links` twice — harmless, but it means a `links` array is not
  guaranteed to have one entry per label. In `resources.csv` the second copy
  lands in `other_links`.
- **The `links` label vocabulary has a tail.** 722 of 751 links use one of six
  labels; the other 29 are one-offs (`Patreon`, `Grammar PDF`, `r/Vietnamese`,
  `Her på berget`, …). Do not assume labels are enumerable.

What is *not* wrong, having been checked: no duplicate ids, no two records
sharing a URL, no missing required fields, no value outside its controlled
vocabulary, no malformed CEFR range, no resource filed under the wrong
language, and no platform link pointing at the wrong platform's domain.

## Contributing a correction

Corrections are the main thing this repo wants. A dead link, a price that
changed, a resource that stopped being updated, or a genuinely great resource
that is missing:

1. Open an issue saying what is wrong and how you know — a link is enough.
2. Or open a pull request editing the relevant `data/resources/<language>.json`
   and nothing else. Run `node scripts/validate.mjs` first; it must exit 0.
   Do not hand-edit `resources.json`, `resources.csv` or `stats.json` — they
   are generated by `node scripts/build.mjs`.

For a new entry, follow the existing shape: honest notes including the caveat,
a concrete pitch, no marketing language, and a URL you have actually opened.
Entries that read like ad copy will be edited or declined. Please disclose any
affiliation with a resource you add — it is not disqualifying, undisclosed it
is. Details in [CONTRIBUTING.md](CONTRIBUTING.md).

Accepted corrections flow back into howtolearn.app.

## License

- **Data** (`data/`, `resources.json`, `resources.csv`, `stats.json`) —
  [Creative Commons Attribution 4.0 International](LICENSE) (CC BY 4.0). Use it
  commercially, remix it, build products on it. The one requirement is
  attribution.
- **Code** (`scripts/`) — [MIT](LICENSE-CODE).

Suggested attribution:

> Language learning resources dataset, curated by
> [How to Learn](https://howtolearn.app), licensed CC BY 4.0.

## Source

Curated and maintained as the data behind **[howtolearn.app](https://howtolearn.app)**
— a filterable directory that matches these resources to a learner's target
language, level and goals. If you find this dataset useful, a link back is the
attribution the license asks for.
