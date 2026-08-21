# Language learning resources — an open dataset

838 curated language-learning resources across 32 languages, as JSON and CSV.
Apps, courses, podcasts, YouTube channels, books, dictionaries, tools and
communities — each with a one-line pitch, a few sentences of honest notes
(including the catch), and machine-readable facets: type, CEFR range, level,
skills, learning method and price.

329 of them carry verified platform links — 751 in all — found by reading
Apple's catalogue and each resource's own site, never constructed from a name.

This is the data behind [howtolearn.app](https://howtolearn.app), published
under CC BY 4.0.

| | |
| --- | --- |
| Resources | **838** |
| Languages | **32** + 36 language-agnostic |
| Platform links | **751** across **329** resources |
| Free / freemium / paid | 468 / 234 / 136 |

## Get the data

| File | What it is |
| --- | --- |
| [`resources.json`](resources.json) | every resource in one array |
| [`resources.csv`](resources.csv) | one row per resource, for spreadsheets |
| [`data/resources/*.json`](data/resources) | the source of truth, one file per language |

```bash
# every free podcast a beginner can start with, in any language
jq -r '.[] | select((.types | index("podcast")) and .price == "free"
                    and (.levels | index("beginner")))
       | [.language, .name, .url] | @tsv' resources.json
```

The root files are generated and committed, so nothing needs building. To
regenerate after editing `data/`: `node scripts/build.mjs` (plain Node, no
dependencies).

## Documentation

- [Schema](SCHEMA.md) — every field, type and allowed value
- [What is in it](docs/breakdown.md) — counts by type, method and language
- [Using the data](docs/usage.md) — a full record, more recipes, the CSV columns
- [How it was curated](docs/curation.md) — selection, link verification, link-check results
- [Limitations](docs/limitations.md) — what the data is not, and known issues
- [Contributing](CONTRIBUTING.md) — corrections are the main thing this repo wants

## License

**Data** — [CC BY 4.0](LICENSE). Use it commercially, remix it, build on it;
attribution is the one requirement. **Code** (`scripts/`) — [MIT](LICENSE-CODE).

> Language learning resources dataset, curated by
> [How to Learn](https://howtolearn.app), licensed CC BY 4.0.
