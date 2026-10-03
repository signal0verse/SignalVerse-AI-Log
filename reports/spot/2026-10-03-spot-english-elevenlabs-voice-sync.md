# English Spot film — owner-supplied voice synchronization

## Metadata

- Date: 2026-10-03 (owner/client date).
- Module: standalone Spot customer-training media.
- Mode: local educational media only, not Demo/Real execution.
- Repository: SignalVerse-Main.
- Branch: codex/prediction-coverage-expansion-audit (existing checkout).
- Starting/ending application HEAD: `0dbca62357a4adf34240f40ceda3e387356ec4b0`, unchanged.
- Publication destination: SignalVerse-AI-Log/master, this sanitized report only.

## Objective

Replace the original English synthetic narration with the owner's supplied
English MP3 and synchronize images, captions and chapter navigation to that
natural recording. Preserve the existing English/Persian films.

## Scope

Only read the supplied MP3 and existing locally generated English education
storyboard/screens/assets. Generate a separate local movie, English SRT/VTT,
timing manifest, QA evidence and standalone browser player. No application
integration, production deployment or trading-policy change was requested.
No voice, dialogue, subtitle or screenshots are uploaded with this report.

## Actions Taken

1. Preserved the dirty checkout and prior education candidate.
2. Read collaboration boundaries and safe-test guidance; no legacy trading
   or production-connected test was run.
3. Transcribed the source locally with the already cached CPU/int8 Whisper
   model. Offline mode/exact local model path prevent model downloads; audio
   was never uploaded. Duration decoded from the source: 653.5575625 seconds.
4. Aligned the approved reference paragraphs to timestamped English words,
   including numeric/currency normalization. Reviewed doubtful spans and used
   a second local, no-VAD pass for the exit paragraph, restoring a sentence
   missed by the first recognition pass.
5. Retimed all 22 visual scenes, 12 chapters and 133 caption blocks. UI status
   transitions and practical-note highlights follow the new phrase anchors.
   All WAIT-detail scenes remain inside chapter three.
6. Rendered the film from the existing English educational app pictures,
   retaining the established layout. The whole supplied recording is used
   continuously from t=0, without cutting, tempo/pitch changes, per-scene audio
   splices or inserted pauses. Terminal frame-grid padding is 0.025770833s.
7. Verified the full encoded movie and source/audio preservation, reviewed
   encoded WAIT/reasons/color-transition samples, and used the computer-use
   skill to verify actual browser chapter seek/play/pause. Saved the visible
   final browser screenshot and kept the new local player open as a deliverable.

## Files Inspected

- AGENTS.md, CLAUDE.md, latest HANDOFF.md, docs/AI_HANDOFF.md,
  docs/testing/stability-test-runbook.md.
- Existing `tmp/spot-english-20261003/storyboard.json`, renderer, verifier,
  player and generated education screenshots.
- Existing local voice-alignment scripts and model cache, plus supplied MP3.
- AI-Log report template and current remote report history.

## Files Changed

- New local-only workspace `tmp/spot-english-voice-sync-20261003/`: local ASR,
  refinement/alignment/render/verification scripts, generated media/QA and
  `video.html`.
- This sanitized report and an additive HANDOFF.md receipt.
- No application source, policy, SQL, workflow or production configuration.

## Root Cause / Findings

- CONFIRMED: new source duration differs from the old 685.916667-second English
  film; swapping only its audio would leave the previous scene/caption clock.
- CONFIRMED: first-pass VAD recognition skipped part of an exit sentence;
  the no-VAD local recheck recovered it. All approved reference text remains.
- CONFIRMED: normalized reference/ASR character match is 0.9949908369.
  One proper-name reference token is bounded/interpolated; three brand-name
  occurrences and minor function-word recognition differences are retained
  using approved spelling. This is not a claim of perfect word-level forced
  alignment or independent human listening to every spoken word.

## Implementation

Separate movie `output/SignalVerse-Spot-Training-EN-ElevenLabs.mp4`, associated
SRT/VTT, 12 embedded MP4 chapters and a newly timed clickable HTML timeline.
1080x1920, 24 fps, H.264/AAC mono 44.1kHz. Total frame-grid duration:
653.583333333 seconds. Voice speed stays natural. Previous files are not
overwritten. All screenshots contain synthetic education fixtures, not private
accounts or actual order results.

## Tests Executed

- `align.py`: PASS; 22 scenes/12 chapters/133 caption blocks; chronological
  frame-grid scene ranges and approved reference spelling.
- `render.py --prepare`: PASS; all 22 scene layouts and three status-transition
  review pictures generated. Contact sheet and full-size score/reasons/status
  samples visually reviewed; text remains readable and inside its boxes.
- `verify.py --text-only`: PASS; exact approved caption text after whitespace
  normalization, 1,620 reference words, bounded/nonoverlapping cues, contiguous
  chapters, source MP3 unchanged, eight prior artifacts match recorded hashes.
- `verify.py` full run: PASS; all 15,686 video frames and audio decoded with
  zero errors; 12 embedded chapters read back within 1ms; 25 encoded pictures
  extracted. 44 audio anchors have minimum correlation 0.9999340554 and maximum
  measured lag 0ms; all 66 ten-second track blocks correlate >=0.9999505367 with
  the decoded supplied MP3. Source intact; eight older artifacts unchanged.
- Font/layout checks: PASS; all characters supported, all 22 titles within
  two lines, all 66 note labels/bodies fit one line, captions fit three lines.
- Node22 VM parse of player module: PASS without evaluating it or accessing
  network. Only the expected experimental-VM warning from Node was printed.
- Browser actual player: PASS; duration653.583333,1080x1920,readyState4,
  rate1,errornull; chapter3 and chapter8 seek/play and Pause confirmed,12
  visible chapter buttons, no console errors or warnings. Final screenshot
  saved locally; final state paused in chapter8 at464.358907s.

## Build Result

Final media render PASS in535.5s. Movie33,869,826bytes,SHA256
`30f21e5151e76ac3952962b164a18ec7809ab890904d158377f3fa07c79a6e0d`.
English SRT15,267bytes,SHA256
`f88fcbdc4237519c5ead77a4850729e08c4aac1d0c4fbb9e54d2e5674ba4d197`.
Application build not run: no application code was changed. This is not an
official CI or production acceptance result.

## Git Status

Primary application HEAD unchanged. Existing unrelated dirty/untracked work and
retained education candidate preserved. The report checkout was fast-forwarded
from dcd8c5b to bf5ab058, preserving the colleague's report. No app commit/push.

## Commit

Report-only `[skip ci]` commit, no application commit. The exact report commit
and independently verified remote-content receipt are recorded in the additive
local HANDOFF entry and final delivery, rather than a self-referential commit
hash inside the committed report. Only this sanitized report is published;
all source voice, dialogue, subtitles, screenshots and movies remain local.

## Remaining Issues

Local requested movie/voice synchronization is completed and verified. The
supplied voice version has not been integrated into the application or deployed
on VPS; no fresh production-runtime observation is claimed.

## Risks / Limitations

ASR word timing is an estimate; approved spelling is used rather than treating
recognition output as authoritative narration. AAC transcode is for browser
compatibility, not bit-for-bit compressed-audio identity; decoded waveform
comparisons validate alignment. Education screenshots are not evidence of
private-account execution, profitability or production release.

## Recommended Next Step

Review the standalone supplied-voice English movie. Any app integration/release
requires a separate request and the existing narrow release boundaries.
