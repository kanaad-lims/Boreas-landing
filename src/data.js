import knight from './assets/web/knight.jpg'
import vision from './assets/web/vision.jpg'
import painter from './assets/web/painter.jpg'
import tinker from './assets/web/tinker.jpg'

import pxTinker from './assets/web/px-tinker.png'

/**
 * Fill these in when the repo and docs site are live.
 * Everything else on the page reads from this module.
 */
export const LINKS = {
  docs: '#',
  github: '#',
}

export const VERSION = 'v0.1.0'

/** Core capabilities — framed as lasting architecture, not a tool list.
 *  These four scopes will grow as the project does; the individual tools
 *  (bash, arXiv, web, plan, and whatever comes next) live inside them. */
export const CAPABILITIES = [
  {
    id: 'memory',
    title: 'Persistent Memory',
    scope: 'memory',
    body: 'Conversation state, codebase facts, and decisions survive across sessions — stored, retrieved, and merged without manual context management.',
  },
  {
    id: 'sandbox',
    title: 'Sandboxing',
    scope: 'sandbox',
    body: 'Every tool runs in an isolated environment with explicit allow-lists: filesystem, network, and process boundaries are enforced, not trusted.',
  },
  {
    id: 'subagents',
    title: 'Sub-Agent Spawning',
    scope: 'subagents',
    body: 'The loop can delegate to focused sub-agents for parallel research, refactoring, or verification — each with its own context and budget.',
  },
  {
    id: 'compaction',
    title: 'Compaction & Context Engineering',
    scope: 'compaction',
    body: 'Tool output, history, and retrieved knowledge are continuously summarized, pruned, and re-ranked so the context window stays signal-dense.',
  },
]

/**
 * Old-master panels slipped into the page at scattered points.
 *
 * They mean nothing. No caption, no number, no plate label, and no relation
 * to whatever copy sits beside them — they are varnish and candlelight, and
 * that is the whole job. They are deliberately never lined up: each one sits
 * on a different section, a different edge, a different scale and angle.
 *
 * `grade` exists because the sources arrive at wildly different exposures —
 * one is nearly white, one is dark blue. `sepia(0.9)` varnishes them onto a
 * single warm ramp, the way centuries of old glaze yellow a painting, and
 * `brightness` lands each one on the same mid-tone so the page reads as one
 * collection rather than four found images.
 */
export const FRAGMENTS = {
  features: { src: knight, grade: 1.25 },
  loop: { src: painter, grade: 1.25 },
  install: { src: vision, grade: 1.15 },
  footer: { src: tinker, grade: 1.0 },
}

/** The LangGraph routing cycle — an ordered sequence, hence folio numerals. */
export const STEPS = [
  {
    n: 'i',
    title: 'Plan',
    body: 'Before acting, the model writes a todo. It is the only thing that survives a long task intact.',
  },
  {
    n: 'ii',
    title: 'Act',
    body: 'One tool per turn — bash, arXiv, DuckDuckGo, or the plan tool itself. Never two at once.',
  },
  {
    n: 'iii',
    title: 'Observe',
    body: 'The result returns compacted and clipped to the turn budget: headers, counts, and the lines that matter.',
  },
  {
    n: 'iv',
    title: 'Repeat',
    body: 'The graph routes back to the model. It retries a failed call, then stops when the todo is done or the limits run out.',
  },
]

export const GUARANTEES = [
  {
    k: 'per-turn limits',
    v: 'A turn is a budget. Output past the line is clipped, so one runaway command cannot eat the whole context window.',
  },
  {
    k: 'retries',
    v: 'A failed call is retried, then re-planned from the step that broke, before the harness gives up on it.',
  },
  {
    k: 'compact results',
    v: 'Tool output is formatted down to signal — structure kept, padding thrown away, tokens spent on meaning.',
  },
]

/** The ticker strip: what the harness is actually made of. */
export const STACK = [
  'groq models',
  'langgraph tool loop',
  'bash',
  'arxiv search',
  'duckduckgo web search',
  'planning / todo',
  'rich + prompt_toolkit',
  'per-turn limits',
  'retries',
  'compact results',
]

/** The hero session. Rendered one character at a time. */
export const SESSION = [
  { kind: 'prompt', text: 'refactor the parser and prove it works', pause: 320 },
  { kind: 'tool', tag: 'plan', text: 'todo written — 4 steps', pause: 200 },
  { kind: 'tool', tag: 'bash', text: 'pytest tests/test_parser.py -q', pause: 180 },
  { kind: 'out', text: '2 failed, 11 passed in 0.31s', pause: 360 },
  { kind: 'warn', text: 'retry 1/3 — re-planning from step 2', pause: 420 },
  { kind: 'tool', tag: 'web', text: 'duckduckgo: pytest assertion rewriting', pause: 180 },
  { kind: 'tool', tag: 'arxiv', text: 'arxiv: parser combinators in practice', pause: 180 },
  { kind: 'tool', tag: 'bash', text: 'python -m pytest -q', pause: 200 },
  { kind: 'ok', text: '13 passed in 0.42s', pause: 340 },
  { kind: 'done', text: '6 turns, 1 retry, output clipped to 1.2k tokens', pause: 3600 },
]

/** The pixelated plate used as the hero's atmospheric backdrop. */
export const PX_ART = pxTinker
