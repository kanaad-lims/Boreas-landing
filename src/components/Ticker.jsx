import { STACK } from '../data'

/** A status line that never stops reporting what the harness is made of. */
export default function Ticker() {
  const group = (
    <div className="ticker__group" aria-hidden="true">
      {STACK.map((s) => (
        <span className="ticker__item" key={s}>
          <span className="ticker__sigil">›</span>
          {s}
        </span>
      ))}
    </div>
  )

  return (
    <div className="ticker">
      <div className="ticker__track">
        {group}
        {group}
      </div>
      <span className="sr-only">{STACK.join(', ')}.</span>
    </div>
  )
}
