---
name: dos-breakdown
description: Stage 2. Analyze a saved swipe (slideshow, video, image or text) beat by beat from the viewer's point of view and write a BD-### record, separating observations from hypotheses. Use when asked to break down, analyze or study a reference.
---

# Break down a reference

Input: one or more `SW-###` IDs (or "all collected").

For each swipe:

1. Read the record and look at the actual assets in `assets/SW-###/`: the slides, or for a video the frames and contact sheet. Set `based_on` to `full post`, `partial capture` or `transcript only`. For a partial capture, analyze what's there and list the rest under **Not judgeable** rather than inferring it.
2. Copy `templates/breakdown.md` to `library/breakdowns/BD-###.md` (next free number) with `swipe: SW-###`.
3. Analyze the sequence beat by beat, using the swipe's **Beats** (slide numbers or timestamps). For each beat: what is visible or heard, what new information it adds, how it relates to the opening promise. For video, also note pacing: how fast the promise lands, dead air, where the thread could be lost.
4. Keep **Observations** (checkable against the post: "the first slide names one familiar problem") separate from **Hypotheses** ("the time estimates make the items feel achievable", phrased as something to test).
5. Identify unsupported claims, missing steps, and any beat that repeats an earlier point without adding value.
6. Say what the viewer has at the end that they didn't have at the start, and whether that pays off the opening.
7. If metrics are present, compute simple ratios (saves ÷ views, shares ÷ views; for video, average watch ÷ length) per platform, and show the arithmetic with the platform and capture date. Don't compare or add numbers across platforms: they count views differently.
8. Fill **Keep / change** so an adaptation knows what to preserve.
9. In the swipe record, link the breakdown under **Analysis**, add adaptation ideas for the products in its `products` list (read their `context.md`), and set `state: analyzed`.
10. Run `node tools/build-index.mjs`.

"Great hook, engaging visuals" is not analysis. Every line should help decide what to preserve or change.
