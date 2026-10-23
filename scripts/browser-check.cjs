/* Hidden Chrome QA with the DevTools protocol; no extra dependencies. */
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const assert = require('node:assert/strict')
const root = path.resolve(__dirname, '..')
const appUrl = process.argv[2] || 'http://127.0.0.1:8081/'
const artifacts = path.join(root, '.qa')
fs.mkdirSync(artifacts, { recursive: true })
const chrome = spawn(
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=9225',
    '--remote-allow-origins=http://127.0.0.1:9225',
    `--user-data-dir=${path.join(artifacts, 'chrome-profile')}`,
    'about:blank',
  ],
  { windowsHide: true, stdio: 'ignore' }
)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
let ws,
  serial = 0
const pending = new Map(),
  issues = []
async function send(method, params = {}) {
  const id = ++serial
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      pending.delete(id)
      reject(new Error(`Timed out: ${method}`))
    }, 20000)
    pending.set(id, { resolve, reject, timer })
    ws.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  })
  if (result.exceptionDetails)
    throw new Error(
      result.exceptionDetails.text + ': ' + result.exceptionDetails.exception?.description
    )
  return result.result.value
}
async function waitFor(expression) {
  for (let i = 0; i < 100; i++) {
    if (await evaluate(expression)) return
    await delay(150)
  }
  throw new Error('Wait failed: ' + expression)
}
async function clickText(label, scope = 'document') {
  const found = await evaluate(
    `(() => {const el = [...${scope}.querySelectorAll('button,a')].find(e => e.textContent.trim() === ${JSON.stringify(
      label
    )} || e.getAttribute('role') === 'tab' && e.childNodes[0]?.textContent.trim() === ${JSON.stringify(
      label
    )}); if (!el) return false; el.click(); return true})()`
  )
  assert(found, `Missing clickable control: ${label}`)
  await delay(200)
}
async function route(name) {
  await evaluate(`location.hash = '/${name}'`)
  await waitFor(
    `document.querySelector('h1')?.textContent === ${JSON.stringify(
      {
        dashboard: 'Dashboard',
        calendar: 'Leave calendar',
        employees: 'Employees',
        leave: 'Leave planning',
        movement: 'Movement monitoring',
        staffing: 'Staffing overview',
        reports: 'HR reports',
      }[name]
    )}`
  )
}
async function select(label, value) {
  await evaluate(
    `(() => {const el=document.querySelector('select[aria-label=${JSON.stringify(
      label
    )}]'); if(!el) throw Error('Missing select'); el.value=${JSON.stringify(
      value
    )}; el.dispatchEvent(new Event('change',{bubbles:true}));})()`
  )
  await delay(200)
}
async function main() {
  let tabs
  for (let i = 0; i < 60; i++) {
    try {
      tabs = await (await fetch('http://127.0.0.1:9225/json')).json()
      break
    } catch {
      await delay(200)
    }
  }
  if (!tabs) throw new Error('Chrome debugging endpoint did not start')
  ws = new WebSocket(tabs.find((t) => t.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true })
    ws.addEventListener('error', reject, { once: true })
  })
  ws.addEventListener('message', (event) => {
    const msg = JSON.parse(event.data)
    if (msg.id) {
      const item = pending.get(msg.id)
      if (!item) return
      clearTimeout(item.timer)
      pending.delete(msg.id)
      msg.error ? item.reject(new Error(msg.error.message)) : item.resolve(msg.result)
    } else if (msg.method === 'Runtime.exceptionThrown')
      issues.push(
        msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text
      )
    else if (
      msg.method === 'Runtime.consoleAPICalled' &&
      ['error', 'warning'].includes(msg.params.type)
    )
      issues.push(msg.params.args.map((a) => a.value || a.description).join(' '))
  })
  await send('Page.enable')
  await send('Runtime.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await send('Page.navigate', { url: appUrl })
  await waitFor("document.querySelector('h1')?.textContent === 'Dashboard'")
  await waitFor("!document.querySelector('iframe#webpack-dev-server-client-overlay')")
  const counts = await evaluate(
    "[...document.querySelectorAll('.stat-value')].map(e=>Number(e.textContent))"
  )
  assert.deepEqual(counts, [451, 388, 43, 12, 5, 4])
  console.log('PASS Dashboard totals', counts.join(', '))
  await delay(500)
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
  fs.writeFileSync(path.join(artifacts, 'dashboard.png'), Buffer.from(shot.data, 'base64'))
  for (const name of ['calendar', 'employees', 'leave', 'movement', 'staffing', 'reports']) {
    await route(name)
    console.log('PASS Route', name)
  }
  await route('employees')
  await evaluate("document.querySelector('tbody tr').click()")
  await waitFor("!!document.querySelector('[role=dialog]')")
  assert(
    (await evaluate("document.querySelector('[role=dialog]').textContent")).includes('Maria Santos')
  )
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape' })
  await waitFor("!document.querySelector('[role=dialog]')")
  console.log('PASS Employee profile and Escape')
  await route('leave')
  await clickText('Review / Approve')
  await waitFor("!!document.querySelector('[role=dialog]')")
  await clickText('Approve leave', "document.querySelector('[role=dialog]')")
  await waitFor("!document.querySelector('[role=dialog]')")
  await route('dashboard')
  assert.equal(
    (
      await evaluate("[...document.querySelectorAll('.stat-value')].map(e=>Number(e.textContent))")
    )[5],
    3
  )
  console.log('PASS Approval syncs dashboard')
  await route('movement')
  await clickText('Mark as departed')
  await waitFor("!!document.querySelector('[role=dialog]')")
  await clickText('Mark as departed', "document.querySelector('[role=dialog]')")
  await waitFor("!document.querySelector('[role=dialog]')")
  await route('dashboard')
  assert.equal(
    (
      await evaluate("[...document.querySelectorAll('.stat-value')].map(e=>Number(e.textContent))")
    )[1],
    387
  )
  console.log('PASS Departure syncs availability')
  await route('movement')
  await clickText('Overdue')
  await clickText('Record follow-up')
  await waitFor("!!document.querySelector('[role=dialog]')")
  await clickText('Save follow-up')
  await waitFor("!document.querySelector('[role=dialog]')")
  console.log('PASS Follow-up dialog')
  await clickText('Mark as returned')
  await waitFor("!!document.querySelector('[role=dialog]')")
  assert(
    (await evaluate("document.querySelector('[role=dialog]').textContent")).includes(
      'Returned late'
    )
  )
  await clickText('Mark as returned', "document.querySelector('[role=dialog]')")
  await waitFor("!document.querySelector('[role=dialog]')")
  await route('dashboard')
  assert.equal(
    (
      await evaluate("[...document.querySelectorAll('.stat-value')].map(e=>Number(e.textContent))")
    )[4],
    4
  )
  console.log('PASS Late return syncs dashboard')
  await route('leave')
  await clickText('Extensions')
  await clickText('Review extension')
  await waitFor("!!document.querySelector('[role=dialog]')")
  await clickText('Approve extension')
  await waitFor("!document.querySelector('[role=dialog]')")
  console.log('PASS Extension approval dialog')
  await route('movement')
  await clickText('Overdue')
  await select('Set final status', 'awol')
  await waitFor(
    "document.querySelector('[role=dialog]')?.textContent.includes('Set final status to AWOL?')"
  )
  await clickText('Confirm AWOL')
  await waitFor("!document.querySelector('[role=dialog]')")
  await route('dashboard')
  assert.equal(
    (
      await evaluate("[...document.querySelectorAll('.stat-value')].map(e=>Number(e.textContent))")
    )[4],
    3
  )
  console.log('PASS AWOL confirmation syncs status')
  await route('reports')
  await select('Report type', 'Extensions')
  assert(await evaluate("document.querySelectorAll('tbody tr').length > 0"))
  await clickText('PDF')
  assert(
    (await evaluate("document.querySelector('.toast-stack').textContent")).includes(
      'Prototype: export simulated'
    )
  )
  const downloads = path.join(artifacts, 'downloads')
  fs.mkdirSync(downloads, { recursive: true })
  await send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: downloads })
  await clickText('Export CSV')
  for (let i = 0; i < 40 && !fs.existsSync(path.join(downloads, 'extensions.csv')); i++)
    await delay(100)
  assert(fs.readFileSync(path.join(downloads, 'extensions.csv'), 'utf8').includes('employee'))
  console.log('PASS Reports filter, simulated PDF, and real CSV download')
  await route('movement')
  await select('Demo role', 'Farm Admin')
  assert.equal(await evaluate('location.hash'), '#/movement')
  assert.deepEqual(
    await evaluate(
      '[...document.querySelector(\'select[aria-label="Selected farm"]\').options].map(o=>o.text)'
    ),
    ['Farm 2', 'Farm 3']
  )
  assert.equal(
    await evaluate('!!document.querySelector(\'select[aria-label="Set final status"]\')'),
    false
  )
  console.log('PASS Role limits and current route preserved')
  await route('calendar')
  await waitFor("!!document.querySelector('.timeline-grid')")
  await evaluate(
    '[...document.querySelectorAll(\'button[aria-label="Dismiss notification"]\')].forEach(e=>e.click())'
  )
  const calendar = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
  })
  fs.writeFileSync(path.join(artifacts, 'calendar.png'), Buffer.from(calendar.data, 'base64'))
  const target = await evaluate(
    `(() => {const names=[...document.querySelectorAll('.timeline-name')].filter(e=>e.tagName==='BUTTON');const cells=[...document.querySelectorAll('.timeline-cell')];const cell=cells.find(c=>c.dataset.employee===names[23]?.nextElementSibling?.dataset.employee && !c.querySelector('.timeline-bar')); const candidate=cell || cells.find(c=>!c.querySelector('.timeline-bar') && Number(c.dataset.employee?.slice(-4))>100); if(!candidate)return null;candidate.scrollIntoView({block:'center',inline:'center'}); const r=candidate.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`
  )
  if (target) {
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: target.x, y: target.y })
    await send('Input.dispatchMouseEvent', {
      type: 'mousePressed',
      x: target.x,
      y: target.y,
      button: 'left',
      clickCount: 1,
    })
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: target.x + 130,
      y: target.y,
      buttons: 1,
    })
    await send('Input.dispatchMouseEvent', {
      type: 'mouseReleased',
      x: target.x + 130,
      y: target.y,
      button: 'left',
      clickCount: 1,
    })
    await waitFor(
      "document.querySelector('[role=dialog]')?.textContent.includes('Confirm leave dates')"
    )
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape' })
    console.log('PASS Drag-to-plan opens confirmation')
  }
  await route('dashboard')
  await send('Emulation.setDeviceMetricsOverride', {
    width: 820,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await delay(200)
  assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true)
  console.log('PASS Tablet has no page overflow')
  const tablet = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
  })
  fs.writeFileSync(path.join(artifacts, 'tablet.png'), Buffer.from(tablet.data, 'base64'))
  assert.deepEqual(issues, [])
  console.log('PASS No browser console warnings or errors')
}
main()
  .then(() => console.log('Browser checks passed.'))
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    try {
      if (ws?.readyState === WebSocket.OPEN) await send('Browser.close')
    } catch {
      chrome.kill()
    }
    ws?.close()
    chrome.kill()
    setTimeout(() => process.exit(process.exitCode || 0), 250)
  })
