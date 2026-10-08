import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { VERSION, STACK, PX_ART } from '../data'
import { CommandLine, Reveal } from './shared'
import Terminal from './Terminal'

export default function Hero() {
  const wrapRef = useRef(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start start', 'end start'],
  })
  const artY = useTransform(scrollYProgress, [0, 1], [0, 150])
  const artFade = useTransform(scrollYProgress, [0, 1], [0.34, 0.05])

  return (
    <section className="hero-wrap" id="top" ref={wrapRef}>
      <motion.div
        className="hero__art"
        aria-hidden="true"
        style={reduce ? undefined : { y: artY, opacity: artFade }}
      >
        <img src={PX_ART} alt="" />
      </motion.div>
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero">
        <Reveal delay={0.05}>
          <p className="hero__status">
            <i className="status-dot" aria-hidden="true" />
            <span>under development</span>
            <span className="hero__bar" aria-hidden="true">
              |
            </span>
            <span className="hero__ver">{VERSION}</span>
            <span className="hero__bar" aria-hidden="true">
              |
            </span>
            <span>python · groq · langgraph</span>
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <h1 className="hero__title">
            A coding agent,
            <br />
            forged from scratch.
          </h1>
        </Reveal>

        <div className="hero__cols">
          <div className="hero__lede">
            <Reveal delay={0.26}>
              <p>
                BOREAS-AGENT is a from-scratch Python harness for Groq models. It
                runs a LangGraph loop over four tools — bash, arXiv, DuckDuckGo
                web search, and a plan — bounded by per-turn limits, retries and
                compact output, all driven from a gold-on-black terminal.
              </p>
            </Reveal>

            <Reveal delay={0.36}>
              <div className="hero__install">
                <CommandLine cmd="pipx install boreas-agent" />
                <p className="hero__note">
                  Placeholder — the package is not on PyPI yet. Until then,
                  clone the repo and run it from source.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.44}>
              <ul className="hero__stack">
                {STACK.slice(0, 6).map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.34} className="hero__term">
            <Terminal />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
