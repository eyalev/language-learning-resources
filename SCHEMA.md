# Schema

Describes the data as it actually is, verified against all 838 records by
`scripts/validate.mjs`. Where a field is described as "always present" that
means present on every record today, not that a consumer should assume it will
be present forever — code defensively for the optional ones.

## Files

| Path | Contents |
| --- | --- |
| `data/resources/<language>.json` | JSON array of resource objects for one language (32 files) |
| `data/resources/universal.json` | JSON array of resources that work for many languages |
| `data/languages.json` | JSON array of language objects (32 entries) |
| `resources.json` | generated: every resource in one array, each with an added `language` field |
| `resources.csv` | generated: one row per resource, arrays joined with `\|` |
| `stats.json` | generated: the counts quoted in the README |

Everything is UTF-8. `resources.csv` is written with a BOM and CRLF line
endings so Excel opens `Ελληνικά`, `日本語` and `العربية` correctly; every other
tool handles that fine.

## Resource object

A verbatim record from `data/resources/spanish.json`, with `notes` shortened:

```json
{
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
  "notes": "Running since 2005 with a huge free archive split into Inspired Beginners, Intermediate and Advanced …",
  "links": [
    { "label": "Apple Podcasts", "url": "https://podcasts.apple.com/us/podcast/…/id257441540" },
    { "label": "RSS", "url": "https://rss.libsyn.com/shows/19057/destinations/14862.xml" },
    { "label": "Spotify", "url": "https://open.spotify.com/show/6kf6aCHaI9WsPVL2PuvRom" }
  ]
}
```

Field order is not stable — the source files vary; read by key, not position.

### Fields

| Field | Type | Presence | Notes |
| --- | --- | --- | --- |
| `id` | string | always | kebab-case, unique across every file |
| `name` | string | always | display name, as the resource calls itself |
| `url` | string | always | the canonical link; unique across the dataset |
| `types` | string[] | always | non-empty, from the type vocabulary below |
| `languages` | string[] | always | language slugs, or `["*"]` in `universal.json` |
| `levels` | string[] | always | non-empty subset of `beginner`, `intermediate`, `advanced` |
| `skills` | string[] | always | non-empty, from the skill vocabulary below |
| `price` | string | always | exactly one of `free`, `freemium`, `paid` |
| `pitch` | string | always | one line, 59–95 chars (mean 79) |
| `notes` | string | always | 2–4 sentences, 292–603 chars (mean 442) |
| `popularity` | integer | always | 1–5, see below |
| `methods` | string[] | always | may be empty; from the method vocabulary below |
| `cefr` | string | 745 / 838 | `"B1"` or a range `"A1–B2"`, **en dash** (U+2013) |
| `tags` | string[] | 698 / 838 | free-form kebab-case, see below |
| `links` | object[] | 329 / 838 | extra platform links, see below |

`price` describes whether a learner can get real use out of the free tier, not
whether the resource has any paid product at all: `free` means the whole thing
is usable at no cost, `freemium` means a usable free tier with paid upgrades,
`paid` means you must pay to get anything.

`popularity` is a curator estimate of **how widely used** a resource is among
learners of that language — not how good it is. A superb niche podcast is
legitimately a 2. It is judged relative to that language's learner community,
so a Finnish flagship and a Spanish flagship can both be 4. Distribution today:
5 → 13, 4 → 145, 3 → 307, 2 → 349, 1 → 24.

### Controlled vocabularies

**`types`** — what format the resource is (a resource may be several):

`app` · `book` · `community` · `course` · `dictionary` · `media` · `podcast` ·
`tool` · `tutoring` · `website` · `youtube`

`media` means TV, film, music or news usable by learners. `website` is the
catch-all for a site that is not primarily one of the others.

**`levels`** — `beginner` · `intermediate` · `advanced`

**`skills`** — what you practise:

`grammar` · `immersion` · `listening` · `pronunciation` · `reading` ·
`speaking` · `vocabulary` · `writing`

**`methods`** — *how* the resource works, orthogonal to `types` and `skills`.
Anki and Duolingo are both apps, but one is `flashcards` and the other is
`structured-course` + `gamified`.

| Value | Meaning |
| --- | --- |
| `audio-method` | listen-and-repeat audio courses (Pimsleur, Michel Thomas, Assimil) |
| `authentic-media` | real native content — news, TV, podcasts made for natives |
| `comprehensible-input` | levelled listening/watching aimed at acquisition |
| `conversation-practice` | speaking with people (tutors, exchange) or with AI |
| `flashcards` | spaced repetition / vocabulary drilling you feed and review |
| `gamified` | streaks, points and levels as the core motivator |
| `graded-reading` | readers, parallel texts, tap-to-look-up reading tools |
| `grammar-reference` | explanations you consult rather than follow in order |
| `pronunciation-training` | targeted accent work with feedback |
| `structured-course` | a sequenced curriculum you progress through |

`methods` is empty for 177 records where none of the ten genuinely applies
(dictionaries, communities, tools). Empty means "not classified", not
"classified as none".

**`price`** — `free` · `freemium` · `paid`

### `languages`

Language slugs matching `data/languages.json`, or the single value `"*"` for
the 36 records in `universal.json`. Today every language-specific record lists
exactly one language — the array exists for resources that legitimately serve
a small group (say, Bokmål and Nynorsk material) and is worth reading as an
array rather than a scalar.

### `tags`

Free-form kebab-case keywords — 344 distinct values, and this is the least
structured part of the dataset. Tags fall into roughly three groups:

1. **Variant tags** that match a `variants[].tag` in `data/languages.json`
   (`european-portuguese`, `msa`, `castilian-spanish`, `bokmal`, …). These are
   load-bearing: they are what lets a consumer filter "European Portuguese
   podcasts" without getting Brazilian ones. 13 of the 15 declared variant tags
   are in use — see *Known issues* in the README for the two that are not.
2. **Descriptive keywords** with no controlled vocabulary at all — `textbook`,
   `news`, `slow-speech`, `geo-restricted`, `exam-prep`, `free-curriculum`.
   Useful for search, not safe to build a UI facet on.
3. **Duplicates of other fields** — some records tag `grammar` or
   `comprehensible-input` even though the same information is in `skills` or
   `methods`. Prefer the structured field.

An untagged resource should be read as variant-neutral, not as excluded: a
resource is only outside a variant if it carries at least one of that language's
variant tags and none of them is the one being filtered for.

### `links`

Optional array of `{ "label": string, "url": string }` — additional places the
same resource lives. `url` at the top level stays the canonical link.

751 link entries across 329 resources. The labels that are effectively a
controlled vocabulary, because a script produced them:

| Label | Count | Host |
| --- | --- | --- |
| `Apple Podcasts` | 178 | `podcasts.apple.com` |
| `RSS` | 167 | the show's own feed host |
| `YouTube` | 151 | `youtube.com` |
| `Google Play` | 77 | `play.google.com` |
| `App Store` | 76 | `apps.apple.com` |
| `Spotify` | 73 | `open.spotify.com` |

All 555 entries with one of the five platform labels point at that platform's
host — checked, no mislabelled rows. The remaining 29 entries carry
hand-written labels (`Patreon`, `Grammar PDF`, `r/Vietnamese`, `Episodes`, …)
and are one-offs; treat any label outside the table above as free text.

`resources.csv` gives the six labels above their own columns
(`apple_podcasts`, `spotify`, `rss`, `app_store`, `google_play`, `youtube`) and
packs everything else into `other_links` as `Label=URL | Label=URL`.

A `links` array is not guaranteed to hold at most one entry per label — two
records repeat an identical `RSS` entry (see *Known issues* in the README). The
CSV keeps the first occurrence in the dedicated column and pushes any repeat
into `other_links` rather than dropping it.

## Language object (`data/languages.json`)

```json
{
  "slug": "portuguese",
  "code": "pt",
  "name": "Portuguese",
  "nativeName": "Português",
  "flag": "🇵🇹",
  "aliases": ["Brazilian Portuguese", "European Portuguese"],
  "variants": [
    { "tag": "european-portuguese", "name": "European Portuguese" },
    { "tag": "brazilian-portuguese", "name": "Brazilian Portuguese" }
  ]
}
```

| Field | Type | Presence | Notes |
| --- | --- | --- | --- |
| `slug` | string | always | matches the data filename |
| `code` | string | always | ISO 639-1, except `fil` (Filipino) and `yue` (Cantonese), which are 639-2/3 |
| `name` | string | always | English name |
| `nativeName` | string | always | endonym |
| `flag` | string | always | emoji flag — a rough national marker, not a claim about where a language is spoken |
| `aliases` | string[] | 10 / 32 | searchable synonyms only, never used as resource tags |
| `variants` | object[] | 6 / 32 | dialect or script varieties; `tag` is the value resources carry in `tags` |

Languages declaring variants: Spanish, Portuguese, Chinese, Arabic, English,
Norwegian.

## Validating

```
node scripts/validate.mjs --warn
```

Exit code 0 means every record satisfies everything above. Warnings cover
things that are not schema violations but are worth a look — plain-`http` URLs,
two records sharing a URL, an unusually short `notes`, a declared variant tag
no resource carries.
