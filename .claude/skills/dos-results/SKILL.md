---
name: dos-results
description: Stage 8. Log a published post's metrics against the brief and draft version that produced it (R-<CODE>-###), update used-content and format evidence, and decide what to do next. Use when the user shares published posts or metrics, or asks what to make next.
---

# Results

## Log a post

Input: the published draft ID (or brief), its URL and publication date, and metrics with the date they were read.

1. Copy `templates/result.md` to `products/<slug>/results/R-<CODE>-###.md` (same `###` as the brief). Link the exact draft version that was published.
2. Fill metrics only as given, with `captured` and `age_days`. If the result exists already, add a snapshot row instead of overwriting.
3. Set the draft's and brief's `status: published`.
4. Add a row to the product's `used-content.md`: date, result ID, hook, format, verbatim opening, and items or resources the post used.
5. If the format was `candidate`, add this result to its `results` and set `status: proven`. Mark the hook's `used_in` and `status: used`.
6. Write **What changed?** and **What do we do next?**. The next step is one decision: improve the execution, make a variation (state the change and what it tests), investigate further, or move on.
7. Run `node tools/build-index.mjs`.

## Compare results

Input: a product slug, or "all products".

Compare results with their briefs and published versions. Account for post age; compare posts at similar ages and keep missing data visible. Identify patterns worth investigating, keeping observations separate from explanations. For each concept, propose the next production decision, what the next variation would change, and what it would help us learn. Our posts aren't controlled experiments; say so where it matters.

When comparing across products, remember they have different audiences. A format working for one product is a candidate for another, not a result.
