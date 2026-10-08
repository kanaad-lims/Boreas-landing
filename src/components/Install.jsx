import { CommandLine, Fragment, SectionHead } from './shared'

const ENV = [
  '# every knob is an environment variable',
  'export GROQ_API_KEY=gsk_live_...',
  '',
  '# model, turn limits and retries are',
  '# read from the environment at start-up',
]

export default function Install() {
  return (
    <section className="sec" id="install">
      <Fragment name="install" className="frag--install" />

      <SectionHead
        folio="iii"
        id="install-title"
        title="Install"
        lede="One command to install, one to launch. Distribution moves to PyPI with the next release — until then, install from source."
      />

      <div className="install">
        <div className="install__main">
          <div className="term">
            <div className="term__bar">
              <span className="term__dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="term__title">install</span>
              <span className="term__badge">pipx</span>
            </div>
            <div className="term__body">
              <CommandLine cmd="pipx install boreas-agent" note="from PyPI, coming soon" />
              <CommandLine cmd="boreas" note="launch the agent" />
            </div>
          </div>

          <div className="install__alt">
            <p className="install__alt-k">until it ships</p>
            <CommandLine cmd="python -m boreas" note="run from a checkout" />
          </div>
        </div>

        <div className="install__side">
          <p className="install__side-k">configure</p>
          <pre className="install__env">
            <code>
              {ENV.map((l, i) => (
                <span className={l.startsWith('#') ? 'c-com' : 'c-put'} key={i}>
                  {l || '\u00a0'}
                  {'\n'}
                </span>
              ))}
            </code>
          </pre>
          <ul className="install__reqs">
            <li>
              <span>runtime</span> python
            </li>
            <li>
              <span>models</span> groq, via env
            </li>
            <li>
              <span>interface</span> rich + prompt_toolkit
            </li>
            <li>
              <span>status</span> v0.1.0, under development
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
