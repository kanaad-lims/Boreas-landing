import puppeteer from 'puppeteer-core'

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const SHOT = 'C:\\Users\\Kanaad\\AppData\\Local\\Temp\\opencode'

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 3000))

for (const id of ['features', 'loop', 'install', 'docs', 'footer']) {
  const sel = id === 'footer' ? 'footer' : `#${id}`
  await page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'start' }), sel)
  await new Promise((r) => setTimeout(r, 1500))

  const info = await page.evaluate((s) => {
    const sec = document.querySelector(s)
    const sr = sec.getBoundingClientRect()
    const frags = [...document.querySelectorAll(s + ' .frag, ' + s + ' > .frag')]
      .map((f) => {
        const r = f.getBoundingClientRect()
        const cs = getComputedStyle(f)
        return `${f.className.split('--')[1] || '?'} x${Math.round(r.left)}-${Math.round(r.right)} y${Math.round(r.top)}-${Math.round(r.bottom)} op=${cs.opacity} img=${!!f.querySelector('img').complete}`
      })
    return `section ${sr.width}x${sr.height} top=${Math.round(sr.top)}\n  ` + frags.join('\n  ')
  }, sel)
  console.log(`=== ${id} ===`)
  console.log(info)

  await page.screenshot({ path: `${SHOT}\\v2-${id}.png` })
}

await browser.close()
console.log('done')