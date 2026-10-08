import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import emblem from '../assets/hero.png'
import { FRAGMENTS } from '../data'

/**
 * A decorative old-master panel.
 *
 * Pure atmosphere: no caption, no number, no link to the copy beside it.
 * It sits behind the content and is never allowed to touch text — audit.mjs
 * fails the build if its box intersects a text box.
 */
export function Fragment({ name, className = '', eager = false }) {
  const art = FRAGMENTS[name]
  if (!art) return null

  return (
    <div className={`frag${className ? ` ${className}` : ''}`} aria-hidden="true">
      <img
        src={art.src}
        alt=""
        loading={eager ? undefined : 'lazy'}
        style={{ filter: `sepia(0.9) saturate(1.12) brightness(${art.grade})` }}
      />
    </div>
  )
}

/** The mark, masked to gold — the source PNG is a dark violet on alpha. */
export function Emblem({ size = 26, className = '' }) {
  return (
    <span
      className={`emblem ${className}`}
      aria-hidden="true"
      style={{
        width: size,
        height: Math.round(size * 1.045),
        WebkitMaskImage: `url(${emblem})`,
        maskImage: `url(${emblem})`,
      }}
    />
  )
}

export function Wordmark({ size = 26 }) {
  return (
    <span className="brand">
      <Emblem size={size} />
      <span className="brand__word">
        BOREAS<span className="brand__sub">-AGENT</span>
      </span>
    </span>
  )
}

export function Copy({ value, label = 'copy' }) {
  const [hit, setHit] = useState(false)

  useEffect(() => {
    if (!hit) return undefined
    const id = setTimeout(() => setHit(false), 1600)
    return () => clearTimeout(id)
  }, [hit])

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setHit(true)
    } catch {
      /* clipboard blocked — the command is visible on screen anyway */
    }
  }

  return (
    <button type="button" className="copy" onClick={onCopy} aria-label={`Copy ${value}`}>
      <span className="copy__glyph" aria-hidden="true">
        {hit ? '✓' : '[]'}
      </span>
      <span className="copy__label">{hit ? 'copied' : label}</span>
    </button>
  )
}

/** A single command line shown on a terminal ground. */
export function CommandLine({ cmd, note }) {
  return (
    <div className="cmdline">
      <span className="cmdline__sigil" aria-hidden="true">
        $
      </span>
      <code className="cmdline__cmd">{cmd}</code>
      <Copy value={cmd} />
      {note && <span className="cmdline__note">{note}</span>}
    </div>
  )
}

/** Folio marker — vertical, in the margin, like a printed sheet. */
export function Folio({ n }) {
  return (
    <div className="folio" aria-hidden="true">
      <span>fol. {n}</span>
    </div>
  )
}

export function SectionHead({ folio, title, lede, id }) {
  return (
    <div className="sec-head">
      <Folio n={folio} />
      <div className="sec-head__text">
        <h2 id={id}>{title}</h2>
        {lede && <p className="lede">{lede}</p>}
      </div>
    </div>
  )
}

/** One orchestrated page-load sequence — the only entrance animation on the page. */
export function Reveal({ children, delay = 0, as = 'div', className = '' }) {
  const reduce = useReducedMotion()
  const M = motion[as] ?? motion.div
  return (
    <M
      className={`reveal${className ? ` ${className}` : ''}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  )
}
