import { VERSION, LINKS } from '../data'

const NAV = [
  ['overview', 'Overview'], ['architecture', 'Architecture'],
  ['tool-loop', 'Tool loop'], ['tools', 'Tools & limits'],
  ['policies', 'Policies'], ['skills', 'Skills'],
  ['quick-start', 'Quick start'], ['repl', 'REPL commands'],
  ['observability', 'Observability & evals'], ['project-layout', 'Project layout'],
  ['roadmap', 'Roadmap'], ['contributing', 'Contributing'],
]

const TOOLS = [
  ['bash', 'Host shell; unsandboxed and requires [y/N] approval per call.', '30 s default timeout'],
  ['arxiv_search', 'Search arXiv and return compact abstracts.', '3 calls/turn; 10 results/call; abstract ≤300 chars; output ≤1,500 chars'],
  ['web_search', 'DuckDuckGo general web search with compact snippets.', '3 calls/turn; 10 results/call; snippet 300 chars; output ≤1,500 chars'],
  ['write_todos', 'Create a multi-step task plan.', 'Exactly one in_progress item at a time'],
  ['read_skill', 'Load a skill definition into context.', '3 calls/turn; skill bodies ≤2,000 chars'],
  ['/browser', 'Manual Playwright page open/search REPL command; not a model tool.', 'No model-tool limit stated'],
]

const ROADMAP = [
  ['Tool-use tightening', 'Global cap removed; per-tool limits and retries active.'],
  ['/ commands', 'Planned.'], ['Sandbox & permissions', 'Planned.'],
  ['Context compaction', 'Planned.'], ['Memory', 'Planned.'],
  ['Sub-agents', 'Planned.'], ['Evals & benchmarks', 'After harness stability.'],
  ['Packaging', 'Later.'],
]

function Code({ children }) {
  return <pre className="docs-code"><code>{children}</code></pre>
}

export default function DocsPage() {
  return (
    <div className="docs-page">
      <a className="docs-skip" href="#docs-content">Skip to documentation</a>
      <header className="docs-topbar">
        <a className="docs-wordmark" href="/" aria-label="BOREAS-AGENT home">BOREAS-AGENT</a>
        <span className="docs-version">{VERSION} · documentation</span>
        <a className="docs-home" href="/">Back to site</a>
      </header>

      <div className="docs-layout">
        <aside className="docs-sidebar">
          <p className="docs-sidebar__label">On this page</p>
          <nav aria-label="Documentation sections">
            {NAV.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          </nav>
          <a className="docs-sidebar__source" href={LINKS.github} target="_blank" rel="noreferrer noopener">View source ↗</a>
        </aside>

        <main className="docs-content" id="docs-content">
          <section className="docs-intro" id="overview">
            <p className="docs-kicker">BOREAS-AGENT / FIELD GUIDE</p>
            <h1>Documentation</h1>
            <p className="docs-lede">An experimental, from-scratch coding-agent harness built with Python and LangGraph. This guide describes the current implementation and marks planned work separately.</p>
            <div className="docs-callout"><strong>Current status</strong><span>Version {VERSION} is a working foundation, not a polished product. Groq is the current inference provider; additional providers are planned.</span></div>
          </section>

          <section className="docs-section" id="architecture">
            <p className="docs-kicker">01 / STRUCTURE</p>
            <h2>Architecture</h2>
            <p>LangGraph’s StateGraph drives the model–tool loop. Provider access, tool registration, policy checks, compact presenters, and observability are kept in separate modules.</p>
            <div className="docs-architecture">
              <span>USER MESSAGE</span><b>↓</b>
              <span>agent.py · LangGraph StateGraph</span><b>↓</b>
              <div><span>llm.py · Groq model</span><i>↔</i><span>tools/registry.py · tools</span></div>
              <b>↓</b><span>policies/checks.py · presenters/</span><b>↓</b>
              <span>FINAL ANSWER</span>
            </div>
            <p>The current default is <code>qwen/qwen3.8-27b</code> through Groq. The provider abstraction lives in <code>llm.py</code>; other providers are planned.</p>
          </section>

          <section className="docs-section" id="tool-loop">
            <p className="docs-kicker">02 / EXECUTION</p>
            <h2>The tool loop</h2>
            <ol className="docs-steps">
              <li><strong>Start a turn.</strong> The user message enters the graph with fresh turn state.</li>
              <li><strong>Request a model response.</strong> The model answers directly or returns tool calls.</li>
              <li><strong>Check and execute.</strong> <code>run_tools</code> applies policy checks, dispatches registered tools, formats results, and returns tool messages.</li>
              <li><strong>Continue or finish.</strong> The graph returns to the model until it answers without tool calls or a limit is reached.</li>
              <li><strong>Record the turn.</strong> LangSmith and local JSONL record activity without affecting the answer.</li>
            </ol>
          </section>

          <section className="docs-section" id="tools">
            <p className="docs-kicker">03 / CURRENT REGISTRY</p>
            <h2>Tools & limits</h2>
            <p>These are the tools and limits documented for the current build. Bash executes on the host and is not sandboxed.</p>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <thead><tr><th>Tool</th><th>Purpose / behavior</th><th>Documented limit</th></tr></thead>
                <tbody>{TOOLS.map(([name, purpose, limit]) => <tr key={name}><th scope="row"><code>{name}</code></th><td>{purpose}</td><td>{limit}</td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <section className="docs-section" id="policies">
            <p className="docs-kicker">04 / GUARDRAILS</p>
            <h2>Policies & safeguards</h2>
            <ul className="docs-list">
              <li>There is no global tool-call cap; individual tools have their own limits.</li>
              <li>A turn stops after at most 8 model calls, with a graceful message.</li>
              <li>Identical failed calls are retried at most 3 times; after that, arguments must change.</li>
              <li>Successful duplicate calls are blocked and the earlier result is reused.</li>
              <li>Every tool response is clipped to 5,000 characters before it returns to the model.</li>
              <li>Each bash call asks for <code>[y/N]</code> approval; execution is currently unsandboxed.</li>
            </ul>
          </section>

          <section className="docs-section" id="skills">
            <p className="docs-kicker">05 / PROMPT GUIDANCE</p>
            <h2>Skills</h2>
            <p>Skills are Markdown files with front matter. When a trigger matches, the loader adds the skill’s guidance to the system prompt. Skills provide instructions, not tools.</p>
            <div className="docs-table-wrap">
              <table className="docs-table">
                <thead><tr><th>Skill</th><th>Trigger examples</th><th>Guidance</th></tr></thead>
                <tbody>
                  <tr><th><code>arxiv-research</code></th><td>paper, arxiv, literature, survey</td><td>Multi-paper arXiv workflows</td></tr>
                  <tr><th><code>web-research</code></th><td>search, web, browse, lookup</td><td>Iterative web search</td></tr>
                  <tr><th><code>task-planning</code></th><td>plan, todo, breakdown, steps</td><td>Explicit planning with <code>write_todos</code></td></tr>
                  <tr><th><code>system-design</code></th><td>diagram, architecture, flowchart, design</td><td>ASCII system-design notation and example trace</td></tr>
                  <tr><th><code>shell-usage</code></th><td>bash, command, shell, terminal</td><td>Safe shell patterns and approval reminders</td></tr>
                </tbody>
              </table>
            </div>
            <p>Skill files live at <code>skills/&lt;name&gt;/SKILL.md</code>.</p>
          </section>

          <section className="docs-section" id="quick-start">
            <p className="docs-kicker">06 / SETUP</p>
            <h2>Quick start</h2>
            <p>Python 3.10 or newer is required. The README recommends Conda for the virtual environment.</p>
            <Code>{[
              'git clone https://github.com/kanaad-lims/AgentHarness.git',
              'cd AgentHarness', '', 'conda create -n boreas python=3.10 -y',
              'conda activate boreas', 'pip install -r requirements.txt', '',
              '# Only needed for /browser', 'playwright install', '',
              'cp .env.example .env', '# Add GROQ_API_KEY to .env',
              '# Optional: GROQ_MODEL=qwen/qwen3.8-27b', '', 'python agent.py',
            ].join('\n')}</Code>
            <p>Set <code>GROQ_API_KEY</code>; <code>GROQ_MODEL</code> is optional.</p>
          </section>

          <section className="docs-section" id="repl">
            <p className="docs-kicker">07 / INTERACTIVE SESSION</p>
            <h2>REPL commands</h2>
            <p>Type a request naturally; the agent decides whether to call tools.</p>
            <dl className="docs-commands">
              <div><dt><code>/help</code></dt><dd>Show available commands.</dd></div>
              <div><dt><code>/tools</code></dt><dd>List tools and schemas.</dd></div>
              <div><dt><code>/model</code></dt><dd>Show the current model.</dd></div>
              <div><dt><code>/browser open &lt;url&gt;</code></dt><dd>Open a page directly with Playwright.</dd></div>
              <div><dt><code>/bye</code></dt><dd>Exit the REPL.</dd></div>
            </dl>
          </section>

          <section className="docs-section" id="observability">
            <p className="docs-kicker">08 / TRACE & EVALUATE</p>
            <h2>Observability & evals</h2>
            <h3>Tracing</h3>
            <p>The local JSONL sink is always on and appends turn envelopes to <code>runs/turns.jsonl</code>. Optional LangSmith tracing uses <code>LANGSMITH_API_KEY</code> and <code>LANGSMITH_PROJECT</code>; the project defaults to <code>boreas-agent</code>.</p>
            <h3>Deterministic evaluations</h3>
            <p>Run the evaluator against a recorded session:</p>
            <Code>python -m evals.run runs/turns.jsonl</Code>
            <p>Metrics cover budget compliance, unknown tool calls, source URLs in factual search-backed answers, and whether failures are recovered or declared. Output includes pass rates and p50/p95 token, latency, and verdict distributions.</p>
          </section>

          <section className="docs-section" id="project-layout">
            <p className="docs-kicker">09 / REPOSITORY MAP</p>
            <h2>Project layout</h2>
            <Code>{[
              'agent.py                 graph loop and entry point',
              'llm.py                   Groq client and request wrapper',
              'config.py                settings and defaults',
              'tools/                   registry and tool implementations',
              'presenters/              compact tool-result formatting',
              'policies/                policy checks',
              'prompts/                 control strings and limit messages',
              'cli/                     Rich UI and prompt_toolkit session',
              'skills/                  skill loader and definitions',
              'observability/           LangSmith + JSONL recording',
              'evals/                   deterministic evaluation runner',
              'tests/                   unit and golden-turn tests',
            ].join('\n')}</Code>
          </section>

          <section className="docs-section" id="roadmap">
            <p className="docs-kicker">10 / PLANNED WORK</p>
            <h2>Roadmap</h2>
            <p>The following items are plans, not claims about current functionality.</p>
            <ul className="docs-roadmap">{ROADMAP.map(([name, status]) => <li key={name}><strong>{name}</strong><span>{status}</span></li>)}</ul>
            <p>Additional providers—including OpenAI, Anthropic, and local models via Ollama or vLLM—are also planned.</p>
          </section>

          <section className="docs-section" id="contributing">
            <p className="docs-kicker">11 / TAKE PART</p>
            <h2>Contributing</h2>
            <p>Issues and pull requests are welcome. The README highlights provider implementations, new skills, tool additions, policy refinements, and evaluation metrics.</p>
            <p>Run tests before submitting:</p>
            <Code>python -m pytest -q</Code>
            <p>License: MIT. The repository is available on <a href={LINKS.github} target="_blank" rel="noreferrer noopener">GitHub</a>.</p>
          </section>

          <footer className="docs-footer"><span>BOREAS-AGENT · {VERSION}</span><a href="/">Return to the landing page ↑</a></footer>
        </main>
      </div>
    </div>
  )
}
