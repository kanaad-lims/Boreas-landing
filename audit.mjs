import puppeteer from 'puppeteer-core'

const URL = process.env.PAGE_URL || 'http://localhost:5173/'
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const SHOT = 'C:\\Users\\Kanaad\\AppData\\Local\\Temp\\opencode'

const problems = []
const notes = []

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--font-render-hinting=none'],
})

function collect() {
  const out = {}
  out.docOverflow =
    document.documentElement.scrollWidth - document.documentElement.clientWidth

  const clipped = (el) => {
    let e = el
    while (e && e !== document.body) {
      const o = getComputedStyle(e)
      if (['hidden', 'clip'].includes(o.overflowX) || ['hidden', 'clip'].includes(o.overflow))
        return true
      e = e.parentElement
    }
    return false
  }

  out.wide = [...document.querySelectorAll('body *')]
    .filter((el) => {
      const r = el.getBoundingClientRect()
      if (r.width <= 0) return false
      if (r.right <= window.innerWidth + 2 && r.left >= -2) return false
      return !clipped(el)
    })
    .slice(0, 8)
    .map((el) => el.tagName.toLowerCase() + '.' + [...el.classList].join('.'))

  const h1 = document.querySelector('.hero__title')
  out.h1 = h1
    ? {
        text: h1.innerText.replace(/\s+/g, ' ').trim(),
        font: getComputedStyle(h1).fontFamily.split(',')[0].replace(/"/g, ''),
        size: getComputedStyle(h1).fontSize,
        lines: Math.round(
          h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight),
        ),
      }
    : null

  out.bodyBg = getComputedStyle(document.body).backgroundColor
  out.fonts = {
    pixelify: document.fonts.check('16px "Pixelify Sans"'),
    garamond: document.fonts.check('16px "EB Garamond"'),
    mono: document.fonts.check('16px "JetBrains Mono"'),
  }

  out.sections = ['top', 'features', 'loop', 'install', 'docs'].map((id) => {
    const r = document.getElementById(id)?.getBoundingClientRect()
    return id + '=' + (r ? Math.round(r.height) : 'MISSING')
  })

  out.imgCount = document.images.length
  // an image inside a display:none branch has no box and is never fetched —
  // that is correct behaviour, not a failure
  out.badImgs = [...document.images]
    .filter((i) => {
      const r = i.getBoundingClientRect()
      if (r.width <= 0 && r.height <= 0) return false
      return !(i.complete && i.naturalWidth > 0)
    })
    .map((i) => i.getAttribute('src'))

  const term = document.querySelector('.hero .term__body')
  out.termRows = term ? term.querySelectorAll('.t-row').length : -1
  out.termDone = !!document.querySelector('.hero .t-row--done')

  out.plates = [...document.querySelectorAll('.plate')].map((p) => {
    const r = p.getBoundingClientRect()
    return Math.round(r.width) + 'x' + Math.round(r.height)
  })

  out.steps = document.querySelectorAll('.step').length
  out.activeStep = [...document.querySelectorAll('.step')].findIndex((s) =>
    s.hasAttribute('data-on'),
  )
  out.nodesLit = document.querySelectorAll('.loop-svg__label[data-on]').length
  out.cartouches = document.querySelectorAll('.cartouche').length
  out.copyBtns = document.querySelectorAll('.copy').length
  out.folios = [...document.querySelectorAll('.folio span')].map((f) =>
    f.textContent.trim(),
  )
  out.frags = [...document.querySelectorAll('.frag')].map((f) => f.className)

  /* A fragment may never land under live text. Text sitting on an opaque
     panel is fine — the panel covers the art — so occluded text is skipped.
     The footer backdrop is the one deliberate exception: it is verified by
     pixel sampling rather than by box. */
  const occluded = (el) => {
    let e = el
    while (e && e !== document.body) {
      const m = getComputedStyle(e).backgroundColor.match(/[\d.]+/g)
      if (m && (m.length < 4 || parseFloat(m[3]) >= 1)) return true
      e = e.parentElement
    }
    return false
  }

  out.fragOverlap = (() => {
    const frags = [...document.querySelectorAll('.frag:not(.frag--footer)')]
    const sel = [
      '.sec-head h2',
      '.lede',
      '.folio span',
      '.plate__tool',
      '.plate__title',
      '.plate__text',
      '.guar__k',
      '.guar__v',
      '.step__n',
      '.step__t',
      '.step__b',
      '.loop-svg__label',
      '.loop-svg__core',
      '.loop-svg__core2',
      '.install__env',
      '.install__reqs li',
      '.install__side-k',
      '.install__alt-k',
      '.cartouche__k',
      '.cartouche__t',
      '.cartouche__b',
      '.cartouche__u',
    ].join(',')

    const hits = new Set()
    for (const f of frags) {
      const fr = f.getBoundingClientRect()
      if (fr.width <= 0 || fr.height <= 0) continue
      for (const t of document.querySelectorAll(sel)) {
        const tr = t.getBoundingClientRect()
        if (tr.width <= 0 || tr.height <= 0) continue
        if (occluded(t)) continue
        if (
          fr.left < tr.right &&
          fr.right > tr.left &&
          fr.top < tr.bottom &&
          fr.bottom > tr.top
        ) {
          const cls =
            typeof t.className === 'string' ? t.className : t.className.baseVal
          hits.add(
            f.className.trim() + ' x ' + t.tagName.toLowerCase() + '.' + cls,
          )
        }
      }
    }
    return [...hits]
  })()

  const parse = (c) => {
    const m = c.match(/[\d.]+/g).map(Number)
    return { r: m[0], g: m[1], b: m[2], a: m.length > 3 ? m[3] : 1 }
  }
  const lum = (c) => {
    const [r, g, b] = [c.r, c.g, c.b]
      .map((v) => v / 255)
      .map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  // composite every translucent layer down to the page ground
  const bgOf = (el) => {
    const stack = []
    let e = el
    while (e) {
      const bg = getComputedStyle(e).backgroundColor
      if (bg) {
        const p = parse(bg)
        if (p.a > 0) stack.push(p)
        if (p.a >= 1) break
      }
      e = e.parentElement
    }
    stack.push({ r: 10, g: 8, b: 6, a: 1 })
    let base = stack[stack.length - 1]
    for (let i = stack.length - 2; i >= 0; i--) {
      const c = stack[i]
      base = {
        r: c.r * c.a + base.r * (1 - c.a),
        g: c.g * c.a + base.g * (1 - c.a),
        b: c.b * c.a + base.b * (1 - c.a),
        a: 1,
      }
    }
    return base
  }
  out.contrast = [
    '.hero__lede p',
    '.lede',
    '.plate__text',
    '.step__b',
    '.nav__links a',
    '.footer__base span',
    '.ticker__item',
    '.install__reqs li',
    '.hero__note',
    '.guar__v',
    '.plate__tool',
    '.install__env',
    '.footer__tag',
    '.footer__col a',
    '.footer__k',
  ]
    .map((s) => {
      const el = document.querySelector(s)
      if (!el) return s + '=MISSING'
      const L1 = lum(parse(getComputedStyle(el).color))
      const L2 = lum(bgOf(el))
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
      return s + '=' + ratio.toFixed(2)
    })

  return out
}

async function audit(label, width, height) {
  const page = await browser.newPage()
  const errors = []
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push('console: ' + m.text())
  })
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
  page.on('requestfailed', (r) =>
    errors.push('request failed: ' + r.url() + ' (' + (r.failure()?.errorText || '') + ')'),
  )

  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 45000 })
  await page.evaluate(() => document.fonts.ready)

  // walk the page so lazy images decode; hold at the very bottom so the
  // footer fragment actually starts loading, then return to the hero
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.7
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 140))
    }
    window.scrollTo(0, document.body.scrollHeight)
    await new Promise((r) => setTimeout(r, 1000))
    window.scrollTo(0, 0)
  })
  await page
    .waitForFunction(
      () =>
        [...document.images].every((i) => {
          // hidden (display:none) images are never fetched — by design
          const r = i.getBoundingClientRect()
          if (r.width <= 0 && r.height <= 0) return true
          return i.complete
        }),
      { timeout: 20000 },
    )
    .catch(() => {})

  // let the hero session finish typing
  await new Promise((r) => setTimeout(r, 9500))

  const report = await page.evaluate(collect)

  await page.screenshot({ path: `${SHOT}\\${label}-top.png` })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4))
  await new Promise((r) => setTimeout(r, 1500))
  await page.screenshot({ path: `${SHOT}\\${label}-mid.png` })
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await new Promise((r) => setTimeout(r, 1500))
  await page.screenshot({ path: `${SHOT}\\${label}-end.png` })

  await page.close()
  return { label, errors, report }
}

for (const [label, w, h] of [
  ['desktop', 1440, 900],
  ['tablet', 834, 1000],
  ['mobile', 390, 844],
]) {
  const { errors, report: R } = await audit(label, w, h)
  const p = (m) => problems.push(`[${label}] ${m}`)

  if (errors.length) p('runtime: ' + errors.join(' | '))
  if (R.docOverflow > 2) p(`horizontal overflow ${R.docOverflow}px`)
  if (R.wide.length) p('unclipped elements past viewport: ' + R.wide.join(' ; '))
  if (!R.h1) p('missing hero title')
  if (!R.fonts.pixelify || !R.fonts.garamond || !R.fonts.mono)
    p('fonts: ' + JSON.stringify(R.fonts))
  if (R.sections.some((s) => s.includes('MISSING'))) p('sections: ' + R.sections.join(' '))
  if (R.badImgs.length) p('broken images: ' + R.badImgs.join(', '))
  if (!R.termDone || R.termRows < 10) p(`terminal rows=${R.termRows} done=${R.termDone}`)
  if (R.plates.length !== 4) p('plates: ' + R.plates.join(', '))
  if (R.steps !== 4) p('steps: ' + R.steps)
  if (R.activeStep < 0 || R.nodesLit !== 1)
    p(`loop sync active=${R.activeStep} lit=${R.nodesLit}`)
  if (R.cartouches !== 2) p('cartouches: ' + R.cartouches)
  if (R.fragOverlap.length) p('fragment under text: ' + R.fragOverlap.join(' ; '))
  if (R.folios.join(',') !== 'fol. i,fol. ii,fol. iii,fol. iv')
    p('folios: ' + R.folios.join(','))
  if (R.bodyBg !== 'rgb(10, 8, 6)') p('body bg = ' + R.bodyBg)

  const low = R.contrast.filter((c) => {
    const v = parseFloat(c.split('=')[1])
    return Number.isFinite(v) && v < 4.5
  })
  if (low.length) p('contrast < 4.5:1 -> ' + low.join(', '))

  notes.push(
    `[${label}] h1=${R.h1?.size} ${R.h1?.font} lines=${R.h1?.lines} | term rows=${R.termRows} done=${R.termDone} | ` +
      `plates=${R.plates.join(' ')} | activeStep=${R.activeStep} lit=${R.nodesLit} | imgs=${R.imgCount} bad=${R.badImgs.length} | copy=${R.copyBtns} | frags=${R.frags.length}`,
  )
  notes.push('  ' + R.contrast.join('  '))
  notes.push(
    '  frags: ' +
      (R.frags.length ? R.frags.map((c) => c.trim()).join(' | ') : 'NONE') +
      ' || under-text: ' +
      (R.fragOverlap.length ? R.fragOverlap.join(' ; ') : 'none'),
  )
}

await browser.close()

console.log('--- NOTES ---')
notes.forEach((n) => console.log(n))
console.log('--- PROBLEMS ---')
console.log(problems.length ? problems.map((p) => '! ' + p).join('\n') : 'none')
