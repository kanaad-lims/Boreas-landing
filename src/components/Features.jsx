import { TOOLS, GUARANTEES } from '../data'
import { Fragment, SectionHead } from './shared'

const ICONS = {
  bash: <path d="M3 4l5 4-5 4M9 12h4" />,
  arxiv: <path d="M3 2h7l3 3v9H3zM6 8h4M6 11h4" />,
  web: <path d="M8 2a6 6 0 100 12A6 6 0 008 2zM2 8h12M8 2c2 2.4 2 9.6 0 12M8 2C6 4.4 6 11.6 8 14" />,
  plan: <path d="M2 3h4v4H2zM2 9h4v4H2zM8 5h6M8 11h6" />,
}

/** One entry in the ruled sheet: an illuminated glyph, then the tool. */
function Plate({ tool }) {
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
            {ICONS[tool.id]}
          </svg>
        </span>
        <p className="plate__tool">{tool.tool}</p>
        <h3 className="plate__title">{tool.title}</h3>
        <p className="plate__text">{tool.body}</p>
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
        title="Four tools"
        lede="No plugin marketplace, no thirty-tool sprawl. BOREAS-AGENT carries four tools on a single LangGraph loop — chosen because a coding agent needs to run things, look things up, and remember what it was doing."
      />

      <div className="sheet">
        <div className="plates">
          {TOOLS.map((t) => (
            <Plate key={t.id} tool={t} />
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
