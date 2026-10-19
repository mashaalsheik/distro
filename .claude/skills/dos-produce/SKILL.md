---
name: dos-produce
description: Stage 6. Produce an approved brief (slides exported as PNGs, or a video script and shot list) and record the draft (D-<CODE>-###-v#). Use when asked to make, render or produce a post, deck or video.
---

# Produce a draft

Input: a brief ID with `status: approved` (or the user explicitly says to proceed).

1. Read the brief, its format, its hook, its swipes (look at their contact sheets), and the product's `context.md`.
2. Next version number: `D-<CODE>-###-v1` where `###` matches the brief, or the next `v#` if drafts exist.
3. Write the slide copy following the format's sequence and visual rules. Don't add claims beyond the brief's verified ones.
4. **Slideshow / image:** render the slides:
   - Use an HTML/CSS slide template at the format's `canvas` size. Keep content (a JSON or Markdown list of slides) separate from layout so a copy revision doesn't mean rebuilding the layout.
   - Export one PNG per slide to `assets/D-<CODE>-###-v#/01.png` … with a headless browser (Playwright/Chromium), plus `contact-sheet.png`.
   - Put any reusable renderer code under `tools/`, not inside the asset folder.
   **Video:** write the script and shot list in the draft's **Copy** table (one row per beat with on-screen text, spoken line and shot). Don't fabricate footage. If the user supplies recorded clips, you can assemble a rough cut with ffmpeg (trim, concatenate, burn in captions) into `assets/D-<CODE>-###-v#/cut.mp4` plus a frame contact sheet; otherwise the script is the deliverable.
5. Copy `templates/draft.md` to `products/<slug>/drafts/D-<CODE>-###-v#.md`. Set `media`. Record the copy, departures from the spec with reasons, and missing material or unresolved claims.
6. Set the brief's `status: in-production`.
7. Run `node tools/build-index.mjs`. Show the contact sheet, then suggest `/dos-review`.
