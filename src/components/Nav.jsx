import { VERSION, LINKS } from '../data'
import { Wordmark } from './shared'
import { useScrolled } from '../useScrolled'

const NAV = [
  { href: '#features', label: 'features' },
  { href: '#loop', label: 'how it works' },
  { href: '#install', label: 'install' },
  { href: '#docs', label: 'docs' },
]

export default function Nav() {
  const stuck = useScrolled(24)

  return (
    <header className={`nav${stuck ? ' is-stuck' : ''}`}>
      <a className="nav__brand" href="#top" aria-label="BOREAS-AGENT home">
        <Wordmark />
      </a>

      <nav className="nav__links" aria-label="Sections">
        {NAV.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
      </nav>

      <div className="nav__meta">
        <span className="chip chip--status">
          <i className="chip__dot" aria-hidden="true" />
          under development
        </span>
        <span className="chip">{VERSION}</span>
        <a
          className="nav__gh"
          href={LINKS.github}
          target="_blank"
          rel="noreferrer noopener"
        >
          github
        </a>
      </div>
    </header>
  )
}
