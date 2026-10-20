---
name: dos-hooks
description: Stage 3. Extract reusable opening patterns from analyzed swipes into hook records (H-###), or generate new openings for a product from existing hook records. Use for anything about hooks or openings.
---

# Hooks

## Extract (default)

Input: analyzed swipes (`state: analyzed`).

1. For each opening worth keeping, check `library/hooks/` for an existing hook with the same pattern. If one exists, add the swipe to its `swipes` list instead of making a duplicate.
2. Otherwise copy `templates/hook.md` to `library/hooks/H-###.md`. Store the verbatim opening, the reusable pattern with `[slots]`, reader tension, promise, opening visual, and the **required payoff** the body must deliver.
3. Copy the source's view count, platform and capture date from its **Performance** table into `source_views` / `source_platform` / `source_captured` (the latest snapshot on its main platform).
4. Note if the pattern rests on one reference, and anything in the source's opening we couldn't repeat honestly.
5. Run `node tools/build-index.mjs`.

## Generate openings for a product

Input: a product slug and an audience problem from its `context.md`, optionally specific hook IDs.

1. Read the product's `context.md` and `used-content.md`.
2. Propose ten openings with meaningfully different approaches, not ten rewordings. For each: the hook it draws on, the promise, the evidence needed, and how the slides will deliver it.
3. Reject any opening that needs an unsupported result, invented experience, or a claim the product's **Factual constraints** don't cover. Say why it was rejected.
4. Flag any that repeat something in `used-content.md`.
5. Don't write records for these; the chosen one goes into a brief via `/dos-brief`.
