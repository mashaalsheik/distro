---
name: dos-collect
description: Stage 1. Turn supplied links, screenshots or slide images into complete swipe records (SW-###) with ordered assets. Use when the user shares reference posts to save. Does not analyze or generate content.
---

# Collect references

Input: links, screenshots, slide images or a folder of them, optionally with metrics and the products they might be relevant to.

1. Find the next free `SW-###` number in `library/swipes/`.
2. For each post:
   - Create `assets/SW-###/`. Save the slides in order as `01.png`, `02.png`, …. If you can't fetch the images, record the URL and ask the user for screenshots instead of guessing the content.
   - Build a contact sheet of the whole sequence as `assets/SW-###/contact-sheet.png` if you have the images (one row, or a grid for more than 6 slides).
   - Copy `templates/swipe.md` to `library/swipes/SW-###.md`. Transcribe every slide's text verbatim, including typos and odd characters. Describe what is visible.
   - Fill in source URL, account, publication date, today's date as `captured`, and only the metrics actually shown. Everything else is `unknown`.
   - Set `outlier` only if the user gave you the account's typical numbers; otherwise `unknown`.
   - Fill **Audience problem**, **Opening**, **Structure**, **Angle and CTA** from what's visible. Leave **Analysis** and **Adaptation ideas** for later stages.
   - `state: collected`.
3. If the user only sent an account's top post, suggest also saving two or three of its ordinary posts for comparison.
4. Run `node tools/build-index.mjs`.
5. Report the records created, every field left `unknown`, and any transcription you weren't sure of. Do not start breakdowns or content.
