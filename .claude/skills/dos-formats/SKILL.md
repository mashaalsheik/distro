---
name: dos-formats
description: Stage 4. Group analyzed references by content structure and write format records (F-###) with slide roles, required inputs, visual rules, failure conditions and a review checklist. Use when asked to build, propose or update formats.
---

# Formats

1. Read the analyzed swipes and their breakdowns. Group them by content structure (what each slide does), not by topic.
2. For each useful group, check `library/formats/` for an existing format. Update it with the new supporting swipes, or copy `templates/format.md` to `library/formats/F-###.md`.
3. Fill in purpose, required inputs, sequence with slide roles, visual rules, failure conditions and the review checklist. Link every supporting `SW-###`.
4. Flag a format supported by only one reference.
5. Keep `status: candidate` unless one of our own results records used it; then add it under `results` and set `proven`. Never mix source-post metrics into a format's own evidence.
6. In `products`, list which products could supply the format's required inputs, based on their `context.md`. A product that can't supply them doesn't get listed.
7. Run `node tools/build-index.mjs`.
