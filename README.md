# Distribution workspace

A research-to-production system for short-form content (slideshows, short videos, image and text posts) across several products. Saved posts become analysis, analysis becomes production instructions, and published results change the next brief.

The pattern libraries are **shared**: a hook or format learned from one niche can be tested for any product. Everything that depends on a specific audience (context, briefs, drafts, results, what that audience has already seen) lives **per product**.

```
distribution/
  CLAUDE.md                 rules every agent pass follows
  .claude/skills/           one skill per pipeline stage (/dos-collect, /dos-breakdown, …)
  templates/                one Markdown template per record type
  library/                  shared across products
    swipes/                 SW-###  saved reference posts
    breakdowns/             BD-###  slide-by-slide analysis of a swipe
    hooks/                  H-###   opening patterns linked to swipes
    formats/                F-###   production specs for a repeatable structure
  products/
    _template/              copy this to add a product
    <product>/
      context.md            audience, objective, voice, factual constraints
      used-content.md       what this audience has already seen
      briefs/               B-<CODE>-###      decisions for one post
      drafts/               D-<CODE>-###-v#   versions, exports, review notes
      results/              R-<CODE>-###      published post, dated metrics, next decision
  assets/<ID>/              slides and contact sheets (untracked; mirrored to Drive)
  index/                    generated CSVs to import into Google Sheets
  tools/build-index.mjs     rebuilds index/ and checks every ID link
```

## The pipeline

| Stage | Skill | Input | Output |
| --- | --- | --- | --- |
| 1. Collect | `/dos-collect` | links, screenshots | `SW-###` records + `assets/SW-###/` |
| 2. Break down | `/dos-breakdown` | a swipe | `BD-###` linked to the swipe |
| 3. Extract hooks | `/dos-hooks` | breakdowns | `H-###` linked to swipes |
| 4. Build formats | `/dos-formats` | several breakdowns | `F-###` linked to swipes |
| 5. Brief | `/dos-brief` | product context + hook + format | `B-<CODE>-###` |
| 6. Produce | `/dos-produce` | a brief | `D-<CODE>-###-v1` + exports |
| 7. Review | `/dos-review` | a draft's exports | critique in the draft, then `-v2` … |
| 8. Results | `/dos-results` | a published post | `R-<CODE>-###` + next decision |

Every record has YAML frontmatter with its `id` and the IDs it links to. A brief names its format, hook and references; a draft names its brief; a result names the draft version that was published. Run `node tools/build-index.mjs` after a session to catch broken links and refresh the CSVs.

## Products

Each product gets a short uppercase `code` used in its IDs:

| Folder | Code | Status |
| --- | --- | --- |
| `products/diybcode` | `DIYB` | context drafted from the [DIYbcode](https://github.com/mashaalsheik/DIYbcode) README; needs your review |

To add one: copy `products/_template` to `products/<slug>`, set `code` in `context.md`, fill in the context, and add a row above. Or run `/dos-brief` and ask it to set up a new product.

## Mixed media

Drop screenshots, slideshow images and videos into the same inbox ([Drive](assets/README.md) or `assets/inbox/`). `/dos-collect` groups files into posts, and gives each one a `media` type (`slideshow`, `video`, `image`, `text`) and a `capture` (`complete`, or `partial` when you only have part of it, like one screenshot of a video). A post cross-posted to several platforms is one record, with a row per platform for its account, URL and date, and a performance row per platform per snapshot. Numbers come only from what's visible in the files you supply or what you type in, each with the date it was read and its source. Every record describes content as **beats**: slide numbers for slideshows, timestamps for video. That way hooks, breakdowns and formats can be compared across types. Videos get one frame per second and a timestamped contact sheet. Speech isn't transcribed automatically, so supply the voiceover or the platform's captions.

## Getting started

Do one complete loop before growing the library:

1. Fill in `products/<slug>/context.md` for the product you'll post for first.
2. Collect 5–10 references, including ordinary posts from the same accounts, not only their outliers: `/dos-collect <links>`.
3. Review the records. Fix missing fields, broken asset links and bad transcriptions before collecting more.
4. Break them down, extract hooks, and propose one format.
5. Write one brief, produce one deck, review it at phone size, revise, publish.
6. Log the result with a "what changed" and a "what next".

## Google Sheets

`node tools/build-index.mjs` writes `index/swipes.csv`, `swipe-metrics.csv` (one row per reference × platform × snapshot), `hooks.csv`, `formats.csv`, `briefs.csv` and `results.csv`. Import each into its own tab (File → Import → Replace current sheet). The Markdown files are the source of truth; the sheet is a view for sorting and filtering.

## Evidence rules

- Observations (what is visible in a post) are kept separate from hypotheses (why it performed).
- Metrics always carry a capture date. Anything not known is written `unknown`.
- A pattern seen in someone else's content is a `candidate`. A format with your own published results attached is `proven`. They are different evidence and stay labelled.
- Source posts' claims (time estimates, results, prices) are their creative promises, not facts to copy.
