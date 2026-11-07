# Changes in this fork

## Local downloads and player controls

- Added an MP4 button beside the play button, including in full screen, with a configurable default MP4 resolution and immediate download.
- Added a transcript button beside the play button that immediately downloads Markdown, plus a configurable default transcript language. The transcript panel can also download Markdown.
- Added a local Windows download service using yt-dlp rather than the unavailable upstream download providers. Videos and audio go to Windows Downloads; MP4s attempt to include the YouTube thumbnail as cover art.
- Reset download status when navigating between videos and prevent an earlier download from overwriting a new video's status.
- Added a Windows launcher that downloads and verifies local copies of Node.js, yt-dlp, FFmpeg and FFprobe. No system-wide installation of those tools is needed.
- Removed the on-page development badge. The local install/update page and Tampermonkey menu provide updates instead.

The original YouTube Tools project and its contributors provide the underlying features and userscript. This fork's local setup is limited to 64-bit Windows and requires the service to be running for video and audio downloads.
