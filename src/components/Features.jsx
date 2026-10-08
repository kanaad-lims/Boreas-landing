import { CAPABILITIES, GUARANTEES } from '../data'
import { Fragment, SectionHead } from './shared'

const ICONS = {
  memory: <path d="M3 2h7l3 3v9H3zM6 8h4M6 11h4" />,
  sandbox: <path d="M4 4h16v16H4zM9 11h6v5H9zM10 11V9a2 2 0 014 0v2" />,
  subagents: <path d="M12 4v6M12 10L6 14M12 10l6 4" />,
  compaction: <path d="M4 4h16M6 8h12M8 12h8M10 16h4M11 20h2" />,
}

/** One entry in the ruled sheet: an illuminated glyph, then the capability. */
function Plate({ capability }) {
  return (
    <article className="plate">
      <div className="plate__body">
        <span className="plate__glyph" aria-hidden="true">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
            strokeLinejoin="miter"
            shapeRendering="crispEdges"
          >
            {ICONS[capability.id]}
          </svg>
        </span>
        <p className="plate__tool">{capability.scope}</p>
        <h3 className="plate__title">{capability.title}</h3>
        <p className="plate__text">{capability.body}</p>
      </div>
    </article>
  )
}

export default function Features() {
  return (
    <section className="sec" id="features">
      <Fragment name="features" className="frag--features" />

      <SectionHead
        folio="i"
        id="features-title"
        title="Architecture"
        lede="No plugin marketplace, no fixed tool list. Four architectural scopes define the harness — persistent memory, sandboxed execution, sub-agent delegation, and continuous compaction. Tools (bash, arXiv, web, plan, and whatever comes next) live inside these boundaries."
      />

      <div className="sheet">
        <div className="plates">
          {CAPABILITIES.map((c) => (
            <Plate key={c.id} capability={c} />
          ))}
        </div>

        <div className="guarantees">
          {GUARANTEES.map((g) => (
            <div className="guar" key={g.k}>
              <p className="guar__k">{g.k}</p>
              <p className="guar__v">{g.v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
