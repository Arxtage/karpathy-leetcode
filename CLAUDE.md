# Karpathy LeetCode - Project Guidelines

## Content Creation: Video Segments

When creating or updating video segment timestamps for a lecture:

1. **Always fetch the timed transcript** using `youtube-transcript-api` (`pip install youtube-transcript-api`):
   ```python
   from youtube_transcript_api import YouTubeTranscriptApi
   ytt_api = YouTubeTranscriptApi()
   transcript = ytt_api.fetch('VIDEO_ID')
   ```
2. **Read through the transcript** to identify natural topic boundaries — look for phrases like "now let's", "so now we're going to", "okay so", "next", or clear topic shifts.
3. **Never cut mid-sentence or mid-explanation.** Each segment should start at the beginning of a new topic and end when that topic wraps up naturally (usually right before the next topic intro).
4. **Segment duration target**: 6-10 minutes preferred. If a segment absolutely cannot be split without breaking a concept, it can be longer — but always try to keep segments under 15 minutes.
5. **Map exercises to segments** based on which concepts the segment covers. An exercise's `segmentId` must match a segment that teaches the prerequisite knowledge for that exercise.

## Exercise Descriptions

- Describe **what** the function/class should do (behavior, inputs, outputs), not **how** to implement it.
- Don't include implementation formulas, code snippets, or step-by-step algorithms in descriptions.
- The student should figure out the *how* themselves. Use hints (progressively revealed) for guidance.

## Architecture

- Content is JSON files in `content/` — loaded server-side via `src/lib/content/loader.ts`
- Python execution via Pyodide in a Web Worker (`public/pyodide-worker.js`)
- Progress stored in localStorage
- All exercises must be self-contained (include prerequisite classes in starterCode/solutionCode)
- Test code uses `try/assert/print("PASS: ...")/except/print("FAIL: ...")` pattern
