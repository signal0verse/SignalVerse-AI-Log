# Persian and English Futures YouTube covers

## Metadata

- Date: 2026-10-05, Asia/Kuala_Lumpur
- Task: Separate Persian and English YouTube thumbnails for completed Standard Futures training films
- Module: Customer education media, not trading implementation
- Repository: signal0verse/signalverse-main
- Application source publication: none this request
- Deployment: paused by the owner pending YouTube links; no production operation

## Objective and scope

The owner requested two separately usable covers, one Persian and one English. Generate only thumbnail artwork matching the existing dark, teal/blue/gold instructional visual family. Keep Standard Futures, Real account and Auto Scanner themes, and the verified 24-chapter count. No claim of returns, win rate or account performance, and no financial/private-account data.

## Actions taken

Used the built-in image generation tool with two independent prompts, not a CLI/API fallback. Persian composition uses right-aligned large, connected text and left chart/scanner artwork; English uses left-aligned headline with right chart/scanner artwork. Both conceptual chart illustrations include red and green candles; neither is represented as an actual account screenshot.

Inspected generated artwork for spelling, readable text hierarchy, language separation, clipping and visual consistency. Persian text: آموزش فیوچرز, استاندارد, اسکن خودکار • حساب واقعی, نسخه فارسی, ۲۴ فصل. English text: FUTURES, TUTORIAL, STANDARD • REAL ACCOUNT, AUTO SCANNER, ENGLISH VERSION, 24 CHAPTERS. No spoken brand was added, and films/voices remain unchanged.

Copied both selected original PNGs byte-for-byte to the workspace output directory; default generated originals remain preserved. No image re-encoding, upscaling, crop or creative edit. Saved the exact prompt set in output/futures-youtube-covers-20261005/prompts.txt. Updated the isolated education worktree handoff with artifact paths and continued deployment pause; no unrelated primary dirty edits touched.

## Files created and checks

| File | Resolution | Bytes | SHA-256 |
| --- | --- | --- | --- |
| output/futures-youtube-covers-20261005/futures-youtube-cover-fa.png | 1672×941 | 1,534,209 | 44d0900b4d78e782fe1b447b8e50e7c8c3346fa1ffa2f17e8d85ac842a143217 |
| output/futures-youtube-covers-20261005/futures-youtube-cover-en.png | 1672×941 | 1,563,691 | 561c69b46bc82fc2221dd84a190c5210d361e45cf7cb600d30f840c5d0df71c6 |

Both PNG headers/dimensions, file existence/size and SHA-256 inspected locally. Aspect ratio approximately 16:9; not falsely claimed exact 1920×1080 or 4K. Visual QA passed for both selected designs. No code/test build needed for image-only generation; no API/bootstrap/env/account/test script executed.

Checked the [official YouTube thumbnail guidance](https://support.google.com/youtube/answer/72431) directly on 2026-10-05: PNG accepted, 640-pixel minimum video width, approximately 16:9 recommended, mobile video-thumbnail upload limit 2 MB. These originals are above minimum width and below 2 MB. Current recommended 3840×2160 resolution is not the delivered generation size; no claim of 4K quality. For vertical films, YouTube says some mobile home/explore/subscription surfaces may replace a custom 16:9 image with an automatic 4:5 thumbnail; this limitation cannot be fixed by an asset alone.

## Git and publication

PNG assets/prompts remain local, outside Git. Application source is not committed or pushed in this request; main/VPS unchanged. Only this sanitized report is published to SignalVerse-AI-Log master under the repository's reporting instruction, with remote whole-byte verification when successful. Existing deployment preparation remains unfinished/unpublished and must not be mistaken for a released app.

## Remaining issues and next step

No YouTube upload, account verification or custom-thumbnail save performed; the owner will upload videos/covers and provide the two video links. Continue to wait before source push/deploy. After links arrive, adapt bilingual in-app playback and actual per-language chapter seeking, finalize exact source scope and run required release checks before official deployment.
