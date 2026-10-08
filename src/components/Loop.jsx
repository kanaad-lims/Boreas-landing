import { useEffect, useState } from 'react'
import {
  motion,
  animate,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { STEPS } from '../data'
import { Fragment, SectionHead } from './shared'

const CX = 180
const CY = 160
const R = 92
const rad = (d) => (d * Math.PI) / 180
const px = (a) => CX + R * Math.cos(rad(a))
const py = (a) => CY + R * Math.sin(rad(a))

const NODES = [
  { label: 'PLAN', a: -90, tx: 180, ty: 54, anchor: 'middle' },
  { label: 'ACT', a: 0, tx: 288, ty: 165, anchor: 'start' },
  { label: 'OBSERVE', a: 90, tx: 180, ty: 279, anchor: 'middle' },
  { label: 'REPEAT', a: 180, tx: 74, ty: 165, anchor: 'end' },
]

const CHEVRONS = [-45, 45, 135, 225]

function Diagram({ active, prog }) {
  const reduce = useReducedMotion()

  const cx = useTransform(prog, (p) => px(p * 360 - 90))
  const cy = useTransform(prog, (p) => py(p * 360 - 90))

  return (
    <svg
      className="loop-svg"
      viewBox="0 0 360 320"
      role="img"
      aria-label="A four-stage cycle: plan, act, observe, repeat."
    >
      <defs>
        <filter id="boreas-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="boreas-halo">
          <stop offset="0%" stopColor="#e9b44c" stopOpacity="0.13" />
          <stop offset="52%" stopColor="#e9b44c" stopOpacity="0.055" />
          <stop offset="100%" stopColor="#e9b44c" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* light behind the loop so it reads against the void */}
      <circle cx={CX} cy={CY} r={152} fill="url(#boreas-halo)" />

      {/* the route */}
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="#5c461f"
        strokeWidth="1.3"
      />
      <circle
        cx={CX}
        cy={CY}
        r={R}
        fill="none"
        stroke="#8a6a2e"
        strokeWidth="1.3"
        strokeDasharray="3 6"
      />

      {/* direction marks */}
      {CHEVRONS.map((a) => (
        <path
          key={a}
          d="M-4 -4.5 L1.5 0 L-4 4.5"
          fill="none"
          stroke="#b08a3a"
          strokeWidth="2"
          strokeLinecap="square"
          strokeLinejoin="miter"
          transform={`translate(${px(a)} ${py(a)}) rotate(${a + 90})`}
        />
      ))}

      {/* stage nodes */}
      {NODES.map((n, i) => {
        const on = active === i
        return (
          <g key={n.label}>
            <circle
              cx={px(n.a)}
              cy={py(n.a)}
              r={on ? 9 : 6}
              fill={on ? '#ffe7b4' : '#0a0806'}
              stroke={on ? '#ffe7b4' : '#a67f34'}
              strokeWidth="2"
              style={{ transition: 'r .4s ease, fill .4s ease' }}
              filter={on ? 'url(#boreas-glow)' : undefined}
            />
            <text
              x={n.tx}
              y={n.ty}
              textAnchor={n.anchor}
              className="loop-svg__label"
              data-on={on || undefined}
            >
              {n.label}
            </text>
          </g>
        )
      })}

      {/* centre legend */}
      <text x={CX} y={CY - 5} textAnchor="middle" className="loop-svg__core">
        langgraph
      </text>
      <text x={CX} y={CY + 17} textAnchor="middle" className="loop-svg__core2">
        tool loop
      </text>

      {/* the packet */}
      {!reduce && (
        <motion.circle
          r="6"
          fill="#ffe7b4"
          filter="url(#boreas-glow)"
          cx={cx}
          cy={cy}
        />
      )}
    </svg>
  )
}

export default function Loop() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const prog = useMotionValue(0)

  useEffect(() => {
    if (reduce) return undefined
    const controls = animate(prog, 1, {
      duration: 9,
      ease: 'linear',
      repeat: Infinity,
    })
    return () => controls.stop()
  }, [prog, reduce])

  useMotionValueEvent(prog, 'change', (v) => {
    setActive(Math.max(0, Math.min(3, Math.floor(v * 4))))
  })

  return (
    <section className="sec sec--tint" id="loop">
      <Fragment name="loop" className="frag--loop" />

      <SectionHead
        folio="ii"
        id="loop-title"
        title="Plan. Act. Observe. Repeat."
        lede="Everything BOREAS-AGENT does happens inside one LangGraph turn. The model proposes, a tool answers, the answer comes back clipped — and the graph routes round again until the todo is finished or the limits say stop."
      />

      <div className="loop-grid">
        <div className="loop-grid__viz">
          <Diagram active={active} prog={prog} />
        </div>

        <ol className="steps">
          {STEPS.map((s, i) => (
            <li className="step" key={s.n} data-on={active === i || undefined}>
              <span className="step__n">{s.n}</span>
              <div>
                <h3 className="step__t">{s.title}</h3>
                <p className="step__b">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
