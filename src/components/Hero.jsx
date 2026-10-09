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
            One from All,
            <br />
            All from One.
          </h1>
        </Reveal>

        <div className="hero__cols">
          <div className="hero__lede">
            <Reveal delay={0.26}>
              <p>
                BOREAS-AGENT is a coding harness developed from scratch in Python with a LangGraph orchestrator loop in the middle. Combined with the best features from open-source harnesses thus, truly living up to the phrase - One from All, All from One.
                Explore possibilities in Features section.
              </p>
            </Reveal>

            <Reveal delay={0.36}>
              <div className="hero__install">
                <CommandLine cmd="pipx install boreas-agent" />
                <p className="hero__note">
                  Package yet to be released. Stay tuned!
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
