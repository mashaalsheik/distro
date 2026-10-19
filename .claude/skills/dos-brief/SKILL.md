---
name: dos-brief
description: Stage 5. Write a production brief (B-<CODE>-###) for one post for one product, choosing a format, hook and references. Also sets up a new product folder. Use when planning a post or adding a product.
---

# Briefs

## Set up a new product

If the user names a product without a folder in `products/`:

1. Copy `products/_template` to `products/<slug>` (lowercase, hyphens).
2. Ask for, or draft from anything they've supplied, the fields in `context.md`. Pick a 2–5 letter uppercase `code` that no other product uses.
3. Mark everything you couldn't confirm `unknown`, especially **Factual constraints**.
4. Add the product to the table in `README.md`.

## Write a brief

Input: a product slug, and optionally an audience problem, hook, format or concept to vary.

1. Read the product's `context.md` and `used-content.md`. If **Objective** or **Factual constraints** are `unknown`, ask before continuing.
2. Pick (or confirm) the format whose `products` includes this product and whose required inputs we can actually supply. Pick a hook whose required payoff the body can deliver.
3. Copy `templates/brief.md` to `products/<slug>/briefs/B-<CODE>-###.md` (next free number for that product).
4. Fill audience and problem, the exact opening copy, the slide plan (one row per slide, following the format's sequence), available assets with paths, claims to verify, and the intended action.
5. Every factual claim gets a source in `context.md` or a link. A claim without one stays in **Claims to verify** and blocks production.
6. If this is a variation, set `variation_of` and write what changes and what it will help us learn before anything is produced.
7. If the body can't deliver the opening's promise, revise the promise now.
8. Run `node tools/build-index.mjs` and show the brief for approval. Don't produce slides until the user approves it.
