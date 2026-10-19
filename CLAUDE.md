# Distribution workspace: agent rules

Read `README.md` for the layout and pipeline. These rules apply to every pass.

## Records

- One Markdown file per record, named by its ID: `library/swipes/SW-014.md`, `products/diybcode/briefs/B-DIYB-003.md`.
- Start every record from the matching file in `templates/`. Keep the frontmatter keys even when the value is `unknown`.
- IDs are permanent. Take the next free number; never renumber or reuse one.
- Link related records by ID in frontmatter and with relative Markdown links in the body.
- Library records (swipes, breakdowns, hooks, formats) are shared across products. Briefs, drafts, results and used-content belong to one product.
- Source assets go in `assets/<ID>/`. Analysis never goes in the asset folder, and generated output never goes in a swipe's asset folder.

## Evidence

- Write `unknown` for anything you cannot see or were not given. Do not estimate metrics, dates or authors.
- Every metric gets a `captured` date beside it.
- Under **Observations**, write only what is visible in the post. Put explanations under **Hypotheses**, phrased as something to test.
- Keep source-post performance and our own results apart. A format is `candidate` until one of our posts using it has a results record.
- Flag any pattern supported by a single reference.
- Never write copy that claims a result, experience, number or feature that the product context or a cited source does not support. If the brief needs one, list it under "claims to verify" and stop.

## Scope of each pass

- Do only the stage you were asked for. Collecting does not include analysis; analysis does not include generating content.
- When a stage is done, list the records you created or changed and anything left `unknown`.
- After editing records, run `node tools/build-index.mjs` and fix any broken link it reports.

## Product context

Before any brief, draft or review, read the product's `context.md` and `used-content.md`. Don't repeat an opening, resource or angle that `used-content.md` shows this audience has already seen unless the brief says it is a deliberate repeat.
