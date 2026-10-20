# Data updates

The published site makes no third-party browser API calls. It reads `data/snapshot.json` from the same site.

## Manual update
Run:

    python scripts/update_snapshot.py

Then commit `data/snapshot.json`.

## Optional GitHub Action
`.github/workflows/update-data.yml` can be run manually from Actions and is also scheduled weekly.
Delete that workflow file if you prefer manual-only updates.
