import { LINKS } from '../data'
import { SectionHead } from './shared'

const CARDS = [
  {
    href: LINKS.docs,
    k: 'documentation',
    title: 'Read the docs',
    url: 'docs / boreas-agent',
    body: 'Architecture, current tools and limits, setup instructions, and the project roadmap.',
  },
  {
    href: LINKS.github,
    k: 'source',
    title: 'Fork the source',
    url: 'github / boreas-agent',
    body: 'The harness is written from scratch in Python. Read it, break it, open an issue.',
  },
]

export default function Connect() {
  return (
    <section className="sec" id="docs">
      <SectionHead
        folio="iv"
        id="docs-title"
        title="Docs & source"
        lede="Read how the harness works, get it running locally, and see what is planned next."
      />

      <div className="connect">
        {CARDS.map((c) => (
          <a
            className="cartouche"
            href={c.href}
            key={c.k}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer noopener"
          >
            <span className="cartouche__k">{c.k}</span>
            <span className="cartouche__t">{c.title}</span>
            <span className="cartouche__b">{c.body}</span>
            <span className="cartouche__u">{c.url}</span>
          </a>
        ))}
      </div>
    </section>
  )
}
