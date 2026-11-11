import { VERSION, LINKS } from '../data'
import { Emblem, Fragment } from './shared'

export default function Footer() {
  return (
    <footer className="footer">
      <Fragment name="footer" className="frag--footer" />

      <div className="footer__in">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="brand">
              <Emblem size={30} />
              <span className="brand__word">
                BOREAS<span className="brand__sub">-AGENT</span>
              </span>
            </span>
            <p className="footer__tag">
              A modular, from-scratch coding-agent harness built with LangGraph and Python.
Designed for tool-use loops, enforced policies, compact formatting, and a clean terminal experience.
            </p>
          </div>

          <nav className="footer__col" aria-label="Page">
            <p className="footer__k">page</p>
            <a href="#features">features</a>
            <a href="#loop">how it works</a>
            <a href="#install">install</a>
          </nav>

          <nav className="footer__col" aria-label="Elsewhere">
            <p className="footer__k">elsewhere</p>
            <a href={LINKS.docs}>documentation</a>
            <a href={LINKS.github} target="_blank" rel="noreferrer noopener">
              github
            </a>
          </nav>
        </div>

        <div className="footer__base">
          <span>{VERSION} — under development</span>
          <span className="footer__base-note">
            © 2026 Kanaad Limaye. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  )
}
