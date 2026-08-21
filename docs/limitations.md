# Limitations and known issues

Read these before treating the data as authoritative.

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
