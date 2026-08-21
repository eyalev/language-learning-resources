# What is in the dataset

Counts as of the 2026-08-20 snapshot. Regenerate them with `node scripts/build.mjs`;
`stats.json` holds the machine-readable version.

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
