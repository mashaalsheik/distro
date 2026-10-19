---
name: dos-collect
description: Stage 1. Turn supplied links, screenshots, slideshow images or videos (in chat, in assets/inbox, or in the Drive inbox) into complete swipe records (SW-###). Use when the user shares reference posts to save. Does not analyze or generate content.
---

# Collect references

Input can be any mix of: links, screenshots, slideshow images, video files, or "the inbox". The inbox is the Drive folder `distro-assets/inbox` (link in `assets/README.md`) or a local `assets/inbox/`.

## 1. Sort the inbox into posts

One record per **post**, not per file.

- Group files that belong to the same post: numbered or consecutive screenshots of one slideshow, a video plus a screenshot of its metrics, a screenshot of a caption. Use file names, timestamps, matching account names and visual continuity.
- If you can't tell whether two files are the same post, ask rather than merging or splitting.
- Decide each post's `media`:
  - `slideshow`: a carousel/photo-mode post with several slides
  - `video`: any video, whatever its length
  - `image`: a single-image post
  - `text`: a text post (e.g. on X or LinkedIn), even if captured as a screenshot
- Set `capture: complete` only if you have every slide, or the full video with audio. A screenshot of a video, or some of a slideshow's slides, is `partial`.
- Show the user the grouping (post → files → media → capture) before writing records if there are more than five posts or any grouping was a guess.

## 2. Save the assets

Find the next free `SW-###` in `library/swipes/` and create `assets/SW-###/` for each post.

- **Slideshow:** save slides in order as `01.png`, `02.png`, …. Make `contact-sheet.png` (one row, or a grid above 6 slides).
- **Video:** save as `source.<ext>`. Then:
  - `ffprobe` for duration → `length` in seconds.
  - Extract a frame every second: `ffmpeg -i source.mp4 -vf fps=1 frames/%03d.png`. For videos over 60s, every 2s.
  - Build `contact-sheet.png` from the frames with timestamps: `ffmpeg -i source.mp4 -vf "fps=1,scale=270:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.6,tile=6x5" -frames:v 1 contact-sheet.png` (adjust the tile grid to fit).
  - Audio: there's no speech-to-text in this environment. If the video has burned-in captions, transcribe them from the frames and say so. Otherwise ask the user for the spoken words, or the platform's auto-captions, and leave **Spoken** as `unknown` until then. Never guess the voiceover.
- **Image / text:** save as `01.png`. No contact sheet needed.
- **Metrics screenshots:** save as `metrics.png` and copy only the numbers shown.
- Keep originals unedited. Don't put frames you've cropped or annotated in the asset folder.

Drive: create `distro-assets/SW-###/`, upload the post's files there, move (or copy, then trash) the originals out of the inbox, and put the folder's link in `drive`. If the Drive connector can't download or move a file, say which one and continue with whatever you could reach.

## 3. Write the record

Copy `templates/swipe.md` to `library/swipes/SW-###.md`.

- **What we have:** the files present and, for a partial capture, exactly what's missing.
- **Beats:** one row per slide (`1`, `2`, …) or per moment in a video (`0:00–0:03`, split where the shot, text or topic changes). Transcribe text verbatim, including typos and odd characters.
- Source URL, account, publication date, today's date as `captured`, and only the metrics actually shown. Everything else is `unknown`.
- `outlier` only if the user gave you the account's typical numbers.
- Fill **Audience problem**, **Opening**, **Structure**, **Caption**, **Angle and CTA** from what's visible. Leave **Analysis** and **Adaptation ideas** for later stages.
- `state: collected`.

## 4. Finish

1. If the user only sent an account's top post, suggest also saving two or three of its ordinary posts for comparison.
2. Run `node tools/build-index.mjs`.
3. Report: records created (ID, media, capture), every field left `unknown`, anything you weren't sure how to transcribe, and inbox files you couldn't place. Do not start breakdowns or content.
