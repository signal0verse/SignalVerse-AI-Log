# Futures YouTube descriptions now use the Telegram bot entry

## Metadata

- Date: 2026-10-05, Asia/Kuala_Lumpur
- Task: Owner requests Telegram bot ID instead of the website for app entry in YouTube copy.
- Module: Customer education publishing text only
- Application source commit or release: none

## Objective and scope

Replace only the customer entry line in Persian/English YouTube descriptions with the explicitly supplied official bot @SignalVerse_AI_bot and its matching clickable link. Existing titles, educational content, voice/video/cover files and actual chapter times must remain unchanged. The deployment pause awaiting two YouTube URLs remains active.

## Actions and files changed

Edited output/futures-youtube-metadata-20261005/fa-introduction.txt and en-introduction.txt using a surgical text patch. Replaced the previous website entry line with the language-specific Telegram entry label, @SignalVerse_AI_bot and https://t.me/SignalVerse_AI_bot. Mechanically regenerated fa-description.txt and en-description.txt from these introductions and the unchanged per-language chapter JSON. No App/API/worker, Telegram token/webhook or server change; no bot/account lookup or deployment performed.

## Findings and checks

The user-supplied ID matches the official production bot identified by project instructions. This is publishing copy, not a Telegram runtime deployment, so no credentials/getMe/webhook operations were needed or run.

Local exporter and readback assertions PASS: one exact bot ID and one exact t.me link in each of the four changed text files; old website domain absent. Each final description retains 24 chapters, 00:00 first, edition-specific timestamps and brief Demo last. Titles remain the same 39-character strings. App entry link selection is not proof of a real account trade or YouTube save.

## Build and Git status

No source build or financial/API test bootstrap needed or executed. Prior unrelated dirty/untracked work preserved. Metadata exports remain local outside Git. Only this sanitized report is published to SignalVerse-AI-Log master and verified against all remote bytes when successful. Application code not pushed; VPS unchanged.

## Remaining issues and next step

Owner can replace the app-entry lines in existing YouTube descriptions, or copy the updated complete downloads. No YouTube UI/account operation performed. Continue waiting for the owner's Persian and English video URLs before in-app integration and deployment.
