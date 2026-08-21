# Using the data

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
strictly structured: [SCHEMA.md](../SCHEMA.md).


