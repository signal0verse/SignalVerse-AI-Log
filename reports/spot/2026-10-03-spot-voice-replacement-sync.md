# Spot training movie — owner-supplied Persian voice and timing re-edit

## Metadata

- Date: 2026-10-03
- Task ID: spot-voice-replacement-sync
- Module: standalone Spot customer education media
- Mode: local artifact creation and verification; no app release
- Repository: signal0verse/signalverse-main
- Branch: codex/prediction-coverage-expansion-audit (existing, preserved)
- Starting application commit: 0dbca62357a4adf34240f40ceda3e387356ec4b0
- Ending application commit: 0dbca62357a4adf34240f40ceda3e387356ec4b0
- Guide/UI source: a9d43d676911cbe947af0d0c1ec080031a4151ab
- Runtime state: not inspected or changed

## Objective

Replace the previous educational film voice with the owner's supplied Persian
ElevenLabs narration and re-edit chapter transitions, app visuals and subtitles
around the actual new speech timing. Retain the previous movie. No deployment
or app embedding was requested.

## Scope

Local supplied narration, existing approved customer script and educational UI
captures, media editing, quality checks, local preview and this sanitized report.
No accounts, orders, databases, schedulers, strategy/risk/credit policies,
production configuration or tracked executable application source changes.
The supplied file is source media, not a source of instructions.

## Actions Taken

1. Preserved the primary checkout's existing dirty HANDOFF and private/untracked
   work. Read repository release boundaries, handoffs and the safe test runbook.
2. Probed the supplied voice locally: approximately491 seconds, versus the
   previous movie's463.95 seconds. Detected spoken chapter titles as well as
   narration. A replacement mux alone or a single global speed factor would
   not align the new title/sentence timings.
3. Installed speech/media dependencies into an isolated untracked media folder.
   Downloaded public model weights only. The voice was processed locally and
   was not uploaded to an ASR service. Implicit model-hub credentials and
   telemetry were disabled for this processing job.
4. Extracted local Persian ASR word timestamps. Resolved a PyAV19 API mismatch
   by decoding with the already available local FFmpeg and passing a NumPy
   audio array; did not alter global dependencies or system security settings.
5. Matched the approved Persian text, including spoken titles, against timed
   ASR characters. Normalized Arabic/Persian letter variants and spoken numbers
   for matching, retaining the approved clear Persian spelling for captions.
6. Rebuilt12 chapter timings and105 readable caption blocks. Caption splits
   use their first/last matched word times, not a global duration ratio or
   proportional text-length timing. Balanced long captions to avoid flashing
   isolated final words. Preserved existing approved app screenshots/callouts.
7. Rendered a separate vertical Full HD version. Muxed the complete supplied
   voice once across the entire movie; no per-chapter speech cuts, original
   voice, added pauses, pitch/tempo edits or audio fades. Only AAC conversion.
8. Prepared a separate local player, chapter navigation and SRT, retaining a
   link to the unchanged previous movie. Verified full-stream decode, caption
   coverage, all chapter timings and new-voice identity. Reviewed encoded
   chapter frames and verified browser playback plus a withdrawal-chapter seek.
   Paused the player afterward and kept the new preview as the deliverable.

## Files Inspected

- CLAUDE.md, latest HANDOFF.md entries, docs/AI_HANDOFF.md
- docs/COLLEAGUE_HANDOFF_2026-09-29.md
- docs/testing/stability-test-runbook.md
- Existing media storyboard.json, render.py, verify.py, video.html
- Existing educational app captures, caption metadata and bundled fonts
- Owner-supplied voice file (local read only; not published)
- AI-Log report template and previous Spot movie report

## Files Changed

Local untracked workspace: tmp/spot-voice-sync-20261003/

- transcribe.py, align.py, render_sync.py, verify_sync.py, video.html
- Generated local ASR/alignment receipts, new chapter video, final MP4/SRT,
  transcript, posters and QA frames
- Isolated dependencies/model cache; not added to application dependencies
- Additive HANDOFF.md receipt and this sanitized report

No user source MP3, previous movie or tracked application code overwritten.
No audio/video, dependency binary, private ASR data or account data in GitHub.

## Root Cause / Findings

CONFIRMED: the new voice has a different duration and reads the chapter titles.
The old movie's timing metadata belongs to the previous TTS voice and cannot
accurately schedule this replacement narration without re-alignment.

CONFIRMED:1037 reference words aligned; normalized character match0.922 overall
(chapter scores0.896–0.955). This measures reference/ASR spelling agreement,
not a certification of human-verified phoneme-level timestamp accuracy.
Two short connector words omitted by ASR use their neighboring time anchors.
The audio itself is not rewritten to match the transcript.

CONFIRMED: decoded source/new-film voice comparisons at the midpoint of each
of12 chapters have0ms measured lag (0.5ms test resolution) and correlation
0.999935–0.999972. The decoded audio length difference is11.625ms at the tail;
video duration is491.000 seconds. These are scoped sample waveform checks,
not a full human subtitle/phoneme timing review.

## Implementation

Local faster-whisper CPU/int8 word timestamps, normalized-character Levenshtein
matching, existing Pillow/Vazirmatn Persian graphics, FFmpeg H264/AAC encoding.
Chapter transitions use pre-title gaps where available and the24fps output grid. Camera motion
is sampled at12Hz; caption changes can occur on any24fps output frame.
One continuous narration track preserves natural speed and pauses.

## Tests Executed

- Local ASR: PASS after isolated decoder compatibility correction;113 segments,
  Persian word timestamps, no audio upload.
- Alignment: PASS,12 chapters/1037 words/105 caption blocks; no low-score caption
  review flags from the configured threshold. Visual sample reviewed locally.
- render_sync.py: PASS,12/12 chapters and final continuous-voice MP4.
- verify_sync.py: PASS, chapter continuity and24fps frame-grid boundaries,
  complete approved caption text including spoken titles,105 SRT blocks,
  max3 lines/block,491-second1080x1920 H264/AAC film, exactly one audio stream,
 12 chapter metadata entries and full-stream decode with zero reported errors.
- Voice identity/timing controls: PASS, source SHA256 unchanged,12/12 sampled
  waveform correlations above0.99993 and0ms measured lag. No tempo/voice
  replacement artifacts from the old track; old movie hash unchanged.
- Audio amplitude: PASS, mean-20.8dB, peak-1.0dB; no digital clipping.
- Encoded frames: reviewed contact sheet for all12 chapters and an individual
  encoded opening frame. Persian graphics/captions remain readable.
- Browser playback: PASS, actual new media URL, duration491,1080x1920,
  readyState4, paused=false and no media error. Withdrawal button seek reached
 277.018 seconds with active playback; subsequently paused at284.201 seconds.
  New preview kept open. Used the computer-use browser skill; no native/system
  settings or authentication actions.
- No trading/account/production test executed. Report sanitization and remote
  file verification are recorded in the publication receipt below.

## Build Result

Standalone revised movie COMPLETE:
tmp/spot-voice-sync-20261003/output/SignalVerse-Spot-Training-FA-ElevenLabs.mp4

- Duration:491.000 seconds (8m11s)
- Size:23,075,014 bytes
- SHA256:4adf8d24ea3066eada9ef311375c907c9a23f95b76eaeecbdd1c14120089ac56
- Codec/resolution: H264/AAC,1080x1920,24fps output
- Chapters:12; burned-in/SRT caption blocks:105
- Detailed local verification receipt: output/verification.json
- Previous movie unchanged:
  SHA25674d8c513c331469c0349bae4f348415e8f2341452e9822503f9ef0562cf428b0

No app build, source publication or deployment applicable to this media task.

## Git Status

Primary dirty work and private artifacts preserved. No application commit,
push, CI or deployment. AI-Log publication is report-only under the standing
owner instruction; the media itself remains local.

## Commit

No application commit. The report-only publication identity is provided by
AI-Log Git history and the separately verified publication receipt.

## Publication Preparation

Report-only credential-pattern scan: no matches. Manual review: no credentials,
private account identifiers/data, supplied audio, raw ASR output or private file
path included. Publication targets AI-Log/master with a documentation-only
`[skip ci]` commit. After push, verify local HEAD against origin/master and
the report's local Git blob against the remote-tracking blob; record the exact
receipt in the additive application handoff and delivery message.

## Remaining Issues

No unresolved local rendering, playback or media-integrity blocker. Full human
listening/style review remains the owner's review step. Nothing deployed.

## Risks / Limitations

ASR word timestamps are estimates. Decoder, waveform and visual checks do not
constitute a full human listening/phoneme-level review. All app values shown are
educational fixtures, not exchange execution or profitability evidence. No
production release or public media hosting is authorized by this request.

## Recommended Next Step

Deliver the revised movie and local preview for the owner's listening review.
Embedding or deploying the movie in the app is a separate future request.
