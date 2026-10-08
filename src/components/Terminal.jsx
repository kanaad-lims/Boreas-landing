import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { SESSION } from '../data'

const CPS = { prompt: 62, tool: 68, out: 54, warn: 54, ok: 60, done: 60 }

/**
 * Types the session one character at a time, then loops after a pause.
 * Output lines are indented under the tool call they belong to.
 */
function useSession() {
  const reduce = useReducedMotion()
  const [line, setLine] = useState(reduce ? SESSION.length : 0)
  const [chars, setChars] = useState(0)

  useEffect(() => {
    if (reduce) return undefined

    if (line >= SESSION.length) {
      const id = setTimeout(() => {
        setLine(0)
        setChars(0)
      }, 4200)
      return () => clearTimeout(id)
    }

    const cur = SESSION[line]

    if (chars < cur.text.length) {
      const id = setTimeout(
        () => setChars((c) => Math.min(c + 1, cur.text.length)),
        1000 / (CPS[cur.kind] ?? 30),
      )
      return () => clearTimeout(id)
    }

    const id = setTimeout(
      () => {
        setLine((l) => l + 1)
        setChars(0)
      },
      cur.pause ?? 280,
    )
    return () => clearTimeout(id)
  }, [line, chars, reduce])

  return { line, chars, done: line >= SESSION.length, reduce }
}

function Row({ entry, shown, caret }) {
  const indent =
    entry.kind === 'out' || entry.kind === 'warn' || entry.kind === 'ok'

  let pre = null
  if (entry.kind === 'prompt') {
    pre = (
      <>
        <span className="t-cmd">boreas</span>
        <span className="t-arrow">❯</span>
      </>
    )
  } else if (entry.kind === 'tool') {
    pre = <span className="t-tag">{entry.tag}</span>
  } else if (entry.kind === 'out') {
    pre = <span className="t-mark">└</span>
  } else if (entry.kind === 'warn') {
    pre = <span className="t-mark t-mark--warn">!</span>
  } else if (entry.kind === 'ok') {
    pre = <span className="t-mark t-mark--ok">✓</span>
  } else if (entry.kind === 'done') {
    pre = <span className="t-mark t-mark--done">◆</span>
  }

  return (
    <div className={`t-row t-row--${entry.kind}${indent ? ' is-indent' : ''}`}>
      <span className="t-pre">{pre}</span>
      <span className="t-txt">
        {shown}
        {caret && <i className="t-caret" aria-hidden="true" />}
      </span>
    </div>
  )
}

export default function Terminal({ compact = false }) {
  const { line, chars, done, reduce } = useSession()
  const bodyRef = useRef(null)

  useEffect(() => {
    const el = bodyRef.current
    if (el && !reduce) el.scrollTop = el.scrollHeight
  }, [line, chars, reduce])

  return (
    <div
      className={`term${compact ? ' term--compact' : ''}`}
      role="img"
      aria-label="A terminal session: BOREAS-AGENT writes a todo, runs pytest, searches the web, retries, and finishes with all tests passing."
    >
      <div className="term__bar">
        <span className="term__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="term__title">boreas-agent — session 0x1f</span>
        <span className="term__badge">gold on black</span>
      </div>

      <div className="term__body" ref={bodyRef}>
        {SESSION.slice(0, Math.min(line + 1, SESSION.length)).map((entry, i) => (
          <Row
            key={`${i}-${entry.kind}-${entry.tag ?? ''}`}
            entry={entry}
            shown={entry.text.slice(0, i === line ? chars : entry.text.length)}
            caret={i === line && !done && !reduce}
          />
        ))}
        {done && !reduce && (
          <div className="t-row t-row--prompt">
            <span className="t-pre">
              <span className="t-cmd">boreas</span>
              <span className="t-arrow">❯</span>
            </span>
            <span className="t-txt">
              <i className="t-caret" aria-hidden="true" />
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
