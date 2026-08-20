#!/usr/bin/env bash
# Re-pulls the source data from the howtolearn.app working repo and rebuilds
# the consolidated files. This dataset is a mirror: data/ is copied verbatim,
# everything else in this repo is written here.
#
#   scripts/sync.sh [path-to-howtolearn-repo]
#
# Default source path is $HOWTOLEARN_REPO, then ../langstack.
#
# What is copied:
#   <src>/data/resources/*.json  ->  data/resources/
#   <src>/data/languages.json    ->  data/languages.json
#
# What is NOT copied: SCHEMA.md. The schema doc in this repo is written against
# the data as it actually is and is maintained here — the upstream one lags.
#
# After syncing, review the diff before committing: an upstream edit can add a
# new language file, a new tag, or a new links label, and README.md quotes real
# counts that then need regenerating (they come from stats.json).

set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
src="${1:-${HOWTOLEARN_REPO:-$here/../langstack}}"

if [ ! -d "$src/data/resources" ]; then
  echo "no data/resources in '$src' — pass the howtolearn repo path as \$1" >&2
  exit 1
fi

echo "syncing from $src"
rm -rf "$here/data/resources"
mkdir -p "$here/data/resources"
cp "$src"/data/resources/*.json "$here/data/resources/"
cp "$src"/data/languages.json "$here/data/languages.json"

# Record where this snapshot came from, so a diff in the data can always be
# traced back to an upstream commit.
{
  echo "source: howtolearn.app working repo"
  echo "synced: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  if git -C "$src" rev-parse HEAD >/dev/null 2>&1; then
    echo "commit: $(git -C "$src" rev-parse HEAD)"
    echo "dirty:  $(git -C "$src" status --porcelain -- data | wc -l) uncommitted change(s) under data/"
  fi
} > "$here/data/SOURCE.txt"

node "$here/scripts/validate.mjs"
node "$here/scripts/build.mjs"

echo
echo "done. Review 'git diff --stat' and update the counts in README.md from stats.json."
