# Farm Leave & Movement Management System — Complete source

Every implemented frontend file is included in full below. Existing backend files, environment files, and unused scaffold files are intentionally excluded. All data is fictional and held in memory.

## Commands

```sh
npm install
# Only if Vue Router is missing from another scaffold:
npm install vue-router@4
npm run serve
# Production verification:
npm run build
node scripts/verify-prototype.cjs
```

## Folder: Project root

### .gitignore

```text
.DS_Store
node_modules
/dist
/.qa


# local env files
.env.local
.env.*.local

# Log files
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### README.md

````markdown
# Farm HR Management

An interactive, frontend-only Vue 3 prototype for leave planning, movement monitoring, staffing, and HR reports. All 451 employees and their records are fictional. Data lives in Vue's reactive memory and resets on reload.

## Run locally

```sh
npm install
npm run serve
```

Open the Local URL printed by Vue CLI. On Windows PowerShell, use `npm.cmd` if execution policy prevents `npm.ps1` from running. Vue Router 4 is already installed; for a fresh scaffold, add it with `npm install vue-router@4`.

```sh
npm run build
node scripts/verify-prototype.cjs
```

The seven routes are lazy-loaded and use hash history so the production build works with ordinary static hosting. The application does not call the existing backend directory or read `src/.env`.

## Demonstration walkthrough

1. Start on Dashboard with All Farms: 451 employees, 388 on site, 43 on leave, 12 returning soon, 5 overdue, and 4 pending approvals. Extended (2) and AWOL (1) are also off site. Scheduled and Returned Late employees are on site.
2. Click a farm's availability row to filter the workspace. Farms 2 and 4 start below their suggested minimums.
3. Choose Calendar and a farm. Drag across an empty employee row to plan leave. Drag future leave to move its dates. Click a locked bar to see history. Press Enter on a row's first date for the keyboard alternative.
4. Review pending requests under Leave. Review extension requests to compare current and requested return dates; approval applies the change.
5. Under Movement, record a departure, return, follow-up, or extension. HR can set AWOL after a confirmation. Late event entry is tagged automatically.
6. Switch the demo role in the topbar to Farm Admin. Only Farms 2 and 3 are available. Requests are endorsed to HR by default, and AWOL controls are hidden. Switching roles and farms keeps the current route.
7. Open demo settings to change approval or staffing behavior live, or reset the in-memory demo.
8. Use Reports to change report type, date range, farm, leave type, and status. CSV export downloads the complete filtered rows. Excel and PDF intentionally show `Prototype: export simulated`.

## Rules and conventions

Business defaults live in `src/utils/constants.js`. HR approves by default; HR may also enable Farm Admin approval. Staffing may warn or block. Overlap is blocking, while an insufficient balance is a warning. Annual leave is reserved on approval; requests do not consume balance. Sundays and sample holidays are excluded.

Leave date ranges are inclusive: the displayed expected return date is the final reserved leave day. Availability resumes after that day in forecasts, or immediately when an actual return is recorded. Overdue employees remain off site until an actual return or approved extension resolves the record. Forecasts use approved leave and recorded movement; unrecorded departures do not remove an employee from today's actual on-site count.

Mock data is seeded and date-relative. Employee balances include the recorded approved leave and a small fictional historical usage allowance. This is a demonstration, with no persistence, authentication, backend, API calls, or database.

## Source and checks

`SOURCE_FILES.md` contains every implemented source file in full, grouped by folder, with file headings and code fences. The ICO is provided losslessly as base64 with a restore command. Regenerate it with `node scripts/generate-source.cjs` after editing.

`scripts/verify-prototype.cjs` verifies exact totals, seeded records, balance arithmetic, role restrictions, endorsement and approval, synchronized movements, extension dates, audit history, locked leave, and rule warnings using the existing Babel toolchain.

`scripts/browser-check.cjs` is a local Chrome DevTools smoke test. It defaults to `http://127.0.0.1:8081/`; pass another URL as its first argument to match the Local URL printed by Vue CLI. It runs Chrome in hidden headless mode, checks navigation and workflows, and writes screenshots into the ignored `.qa` directory. It requires Chrome at the standard Windows install location.
````

### babel.config.js

```javascript
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ]
}
```

### jsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5",
    "module": "esnext",
    "baseUrl": "./",
    "moduleResolution": "node",
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  }
}
```

### package.json

```json
{
  "name": "vacation_tracker",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "core-js": "^3.8.3",
    "vue": "^3.2.13",
    "vue-router": "^4.6.4"
  },
  "devDependencies": {
    "@babel/core": "^7.12.16",
    "@babel/eslint-parser": "^7.12.16",
    "@vue/cli-plugin-babel": "~5.0.0",
    "@vue/cli-plugin-eslint": "~5.0.0",
    "@vue/cli-service": "~5.0.0",
    "eslint": "^7.32.0",
    "eslint-plugin-vue": "^8.0.3"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true,
      "vue/setup-compiler-macros": true
    },
    "extends": [
      "plugin:vue/vue3-essential",
      "eslint:recommended"
    ],
    "parserOptions": {
      "parser": "@babel/eslint-parser"
    },
    "rules": {}
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not dead",
    "not ie 11"
  ]
}
```

## Folder: public/

### public/favicon.ico

Binary ICO, represented in full as base64. Restore in PowerShell:

```powershell
[IO.File]::WriteAllBytes("public/favicon.ico", [Convert]::FromBase64String((Get-Content favicon.base64 -Raw)))
```

Save the following complete base64 string as `favicon.base64`:

```base64
AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAgBAAAAAAAAAAAAAAAAAAAAAAAAA/Si8AP0ovAD9KLwA/Si8AP0ovAD9KLwA/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KLwA/Si8AP0ovAD9KLwA/Si8AP0ovAD9KLwA/Si8AP0ovAD9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ovAD9KLwA/Si8AP0ovAD9KLwA/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ovAD9KLwA/Si8AP0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ovAD9KLwA/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si8AP0ovAD9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KLwA/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//6u/o/+rv6P8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL//q7+j/6u/o/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//6u/o/+rv6P8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL//q7+j/6u/o/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//6u/o/+rv6P8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL//q7+j/6u/o/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL//q7+j/P0ov/+rv6P/q7+j/P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL//q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL//q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P8/Si//P0ov/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/P0ov/z9KL/8/Si//6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/z9KL/8/Si//P0ov/z9KL//q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P8/Si//P0ov/z9KL/8/Si//P0ov/z9KL//q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/6u/o/+rv6P/q7+j/P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P/q7+j/P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/+rv6P8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/+rv6P/q7+j/6u/o/+rv6P/q7+j/6u/o/z9KL/8/Si//P0ov/z9KL/8/Si//P0ovAD9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL//q7+j/6u/o/+rv6P/q7+j/P0ov/z9KL/8/Si//P0ov/z9KLwA/Si8AP0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ovAD9KLwA/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si8AP0ovAD9KLwA/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ovAD9KLwA/Si8AP0ovAD9KLwA/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KLwA/Si8AP0ovAD9KLwA/Si8AP0ovAD9KLwA/Si8AP0ovAD9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ov/z9KL/8/Si//P0ovAD9KLwA/Si8AP0ovAD9KLwA/Si8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
```

### public/index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
    <meta name="theme-color" content="#2F4A3F" />
    <meta
      name="description"
      content="Farm HR Management — leave planning, movement monitoring, and staffing prototype."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
      rel="stylesheet"
    />
    <title>Farm HR Management</title>
  </head>
  <body>
    <noscript>
      <strong>
        We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without
        JavaScript enabled. Please enable it to continue.
      </strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

## Folder: scripts/

### scripts/browser-check.cjs

```javascript
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
```

### scripts/create-favicon.cjs

```javascript
const fs = require('node:fs')
const path = require('node:path')
const size = 32,
  pixels = Buffer.alloc(size * size * 4),
  mask = Buffer.alloc(size * 4)
for (let y = 0; y < size; y++)
  for (let x = 0; x < size; x++) {
    const edgeX = Math.max(6 - x, x - 25, 0),
      edgeY = Math.max(6 - y, y - 25, 0)
    const alpha = edgeX * edgeX + edgeY * edgeY > 36 ? 0 : 255
    let color = [47, 74, 63]
    const left = (x - 11 + (y - 12)) ** 2 / 80 + (x - 11 - (y - 12)) ** 2 / 22 < 1
    const right = (x - 22 - (y - 9)) ** 2 / 75 + (x - 22 + (y - 9)) ** 2 / 18 < 1
    const stem = x >= 16 && x <= 17 && y >= 13 && y <= 26
    if (left || right || stem) color = [232, 239, 234]
    const index = ((size - 1 - y) * size + x) * 4
    pixels[index] = color[2]
    pixels[index + 1] = color[1]
    pixels[index + 2] = color[0]
    pixels[index + 3] = alpha
  }
const header = Buffer.alloc(22),
  bitmap = Buffer.alloc(40)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(1, 4)
header[6] = size
header[7] = size
header.writeUInt16LE(1, 10)
header.writeUInt16LE(32, 12)
header.writeUInt32LE(40 + pixels.length + mask.length, 14)
header.writeUInt32LE(22, 18)
bitmap.writeUInt32LE(40, 0)
bitmap.writeInt32LE(size, 4)
bitmap.writeInt32LE(size * 2, 8)
bitmap.writeUInt16LE(1, 12)
bitmap.writeUInt16LE(32, 14)
bitmap.writeUInt32LE(pixels.length + mask.length, 20)
fs.writeFileSync(
  path.resolve(__dirname, '../public/favicon.ico'),
  Buffer.concat([header, bitmap, pixels, mask])
)
console.log('Created the Farm HR sprout favicon.')
```

### scripts/format-source.cjs

```javascript
const fs = require('node:fs')
const path = require('node:path')
const prettier = require('prettier')
const root = path.resolve(__dirname, '..')
function list(directory) {
  return fs
    .readdirSync(path.join(root, directory), { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory() ? list(`${directory}/${entry.name}`) : [`${directory}/${entry.name}`]
    )
}
async function main() {
  const files = [
    'src/App.vue',
    'src/main.js',
    'public/index.html',
    'README.md',
    ...list('src/assets/css'),
    ...list('src/components').filter((p) => !p.endsWith('/HelloWorld.vue')),
    ...list('src/utils'),
    ...list('src/router'),
    ...list('src/views').filter((p) => p.endsWith('View.vue')),
    ...list('scripts'),
  ]
  for (const file of files) {
    const full = path.join(root, file),
      before = fs.readFileSync(full, 'utf8')
    const after = await prettier.format(before, {
      filepath: full,
      singleQuote: true,
      semi: false,
      trailingComma: 'es5',
      printWidth: 100,
      htmlWhitespaceSensitivity: 'ignore',
    })
    if (after !== before) fs.writeFileSync(full, after)
  }
  console.log(`Formatted ${files.length} prototype files.`)
}
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
```

### scripts/generate-source.cjs

````javascript
const fs = require('node:fs')
const path = require('node:path')
const root = path.resolve(__dirname, '..')
function files(directory) {
  return fs.readdirSync(path.join(root, directory), { withFileTypes: true }).flatMap((entry) => {
    const name = `${directory}/${entry.name}`
    return entry.isDirectory() ? files(name) : [name]
  })
}
const selected = [
  'public/favicon.ico',
  'public/index.html',
  ...files('src/assets/css'),
  ...files('src/assets/fonts'),
  ...files('src/assets/image'),
  ...files('src/components').filter((p) => !p.endsWith('/HelloWorld.vue')),
  ...files('src/router'),
  ...files('src/utils'),
  ...files('src/views').filter((p) => !p.endsWith('/dashboard.vue')),
  'src/App.vue',
  'src/main.js',
  'package.json',
  'babel.config.js',
  'vue.config.js',
  'jsconfig.json',
  '.gitignore',
  'README.md',
  ...files('scripts'),
].sort()
let result = '# Farm Leave & Movement Management System — Complete source\n\n'
result +=
  'Every implemented frontend file is included in full below. Existing backend files, environment files, and unused scaffold files are intentionally excluded. All data is fictional and held in memory.\n\n'
result +=
  '## Commands\n\n```sh\nnpm install\n# Only if Vue Router is missing from another scaffold:\nnpm install vue-router@4\nnpm run serve\n# Production verification:\nnpm run build\nnode scripts/verify-prototype.cjs\n```\n\n'
let folder = null
for (const file of selected) {
  const next = path.posix.dirname(file)
  if (next !== folder) {
    folder = next
    result += `## Folder: ${folder === '.' ? 'Project root' : folder + '/'}\n\n`
  }
  result += `### ${file}\n\n`
  if (file.endsWith('.ico')) {
    result +=
      'Binary ICO, represented in full as base64. Restore in PowerShell:\n\n```powershell\n[IO.File]::WriteAllBytes("public/favicon.ico", [Convert]::FromBase64String((Get-Content favicon.base64 -Raw)))\n```\n\nSave the following complete base64 string as `favicon.base64`:\n\n```base64\n' +
      fs.readFileSync(path.join(root, file)).toString('base64') +
      '\n```\n\n'
  } else {
    const ext = path.extname(file)
    const lang =
      {
        '.vue': 'vue',
        '.js': 'javascript',
        '.cjs': 'javascript',
        '.css': 'css',
        '.html': 'html',
        '.json': 'json',
        '.md': 'markdown',
      }[ext] || 'text'
    const source = fs.readFileSync(path.join(root, file), 'utf8').trimEnd()
    const fence = source.includes('```') ? '````' : '```'
    result += `${fence}${lang}\n${source}\n${fence}\n\n`
  }
}
fs.writeFileSync(path.join(root, 'SOURCE_FILES.md'), result)
console.log(
  `Wrote ${selected.length} complete files to SOURCE_FILES.md (${Buffer.byteLength(result)} bytes)`
)
````

### scripts/verify-prototype.cjs

```javascript
/* Run with node scripts/verify-prototype.cjs. Uses the existing Babel toolchain. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const vm = require('node:vm')
const babel = require('@babel/core')
const cache = new Map()
function load(file) {
  const filename = path.resolve(__dirname, '..', 'src', 'utils', file + '.js')
  if (cache.has(filename)) return cache.get(filename).exports
  const module = { exports: {} }
  cache.set(filename, module)
  const source = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    configFile: false,
    babelrc: false,
    plugins: ['@babel/plugin-transform-modules-commonjs'],
  }).code
  const run = vm.runInThisContext(`(function(require,module,exports){${source}\n})`, { filename })
  run(
    (specifier) =>
      specifier.startsWith('.') ? load(path.basename(specifier, '.js')) : require(specifier),
    module,
    module.exports
  )
  return module.exports
}
const dates = load('dateUtils'),
  rules = load('leaveUtils'),
  data = load('mockData'),
  app = load('store')
const { store, stats, visibleEmployees, visibleLeaves, allowedFarms } = app
function reset() {
  app.resetDemo()
  store.role = 'HR'
  store.selectedFarm = 'all'
  store.settings.approvalMode = 'hr_approves'
  store.settings.staffingMode = 'warning'
}
function test(name, action) {
  reset()
  action()
  console.log('PASS', name)
}
test('Seeded data, exact counts, balances, and farm availability', () => {
  assert.deepEqual(data.generateMockData(), data.generateMockData())
  assert.equal(stats.value.employees, 451)
  assert.equal(stats.value.leave, 43)
  assert.equal(stats.value.returning, 12)
  assert.equal(stats.value.overdue, 5)
  assert.equal(stats.value.pending, 4)
  assert.equal(store.employees.filter((e) => e.status === 'Extended').length, 2)
  assert.equal(store.employees.filter((e) => e.status === 'Returned Late').length, 2)
  assert.equal(store.employees.filter((e) => e.status === 'AWOL').length, 1)
  assert.equal(store.leaves.filter((l) => l.extension?.status === 'Pending').length, 3)
  for (const e of store.employees) {
    assert.equal(e.entitlement, e.usedDays + e.remainingBalance)
    assert(e.remainingBalance >= 0)
  }
  assert.equal(store.employees.filter((e) => e.farm === 2 && rules.isOnSite(e)).length, 39)
  assert.equal(store.employees.filter((e) => e.farm === 4 && rules.isOnSite(e)).length, 45)
  assert(store.history.some((h) => h.recordedLate))
  assert(
    store.history.some(
      (h) => h.action === 'Extension approved' && h.oldValues.end !== h.newValues.end
    )
  )
  assert(store.history.every((h) => h.timestamp.slice(0, 10) <= dates.today()))
  for (const f of store.farms)
    assert.equal(
      rules.dailyHeadcount(store, f.id, dates.today()),
      store.employees.filter((e) => e.farm === f.id && rules.isOnSite(e)).length
    )
})
test('Farm Admin sees only assigned farms and cannot approve or set AWOL', () => {
  app.setRole('Farm Admin')
  assert.deepEqual(
    allowedFarms.value.map((f) => f.id),
    [2, 3]
  )
  assert.equal(store.selectedFarm, 2)
  assert(visibleEmployees.value.every((e) => e.farm === 2))
  const leave = visibleLeaves.value.find((l) => l.approval === 'Pending')
  app.approveLeave(leave)
  assert.equal(leave.approval, 'Endorsed')
  const overdue = visibleLeaves.value.find(
    (l) => app.employeeFor(l.employeeId).status === 'Overdue'
  )
  if (overdue) {
    app.setAwol(overdue)
    assert.equal(app.employeeFor(overdue.employeeId).status, 'Overdue')
  }
  store.settings.approvalMode = 'admin_approves'
  app.approveLeave(leave)
  assert.equal(leave.approval, 'Approved')
})
test('New leave reserves balance; depart and return update counts and history', () => {
  const employee = store.employees.find(
    (e) => e.status === 'On Site' && !store.leaves.some((l) => l.employeeId === e.id)
  )
  const before = employee.remainingBalance,
    onsite = stats.value.onsite
  const draft = {
    employeeId: employee.id,
    type: 'Annual Leave',
    start: dates.today(),
    end: dates.addDays(dates.today(), 2),
  }
  assert.equal(app.saveLeave(draft), true)
  const leave = store.leaves[0]
  assert.equal(leave.approval, 'Approved')
  assert.equal(employee.remainingBalance, before - leave.days)
  app.recordDeparture(leave, dates.localDateTime())
  assert.equal(employee.status, 'Returning Soon')
  assert.equal(stats.value.onsite, onsite - 1)
  app.recordReturn(leave, dates.localDateTime())
  assert.equal(employee.status, 'On Site')
  assert.equal(stats.value.onsite, onsite)
  assert.equal(store.history.filter((h) => h.leaveId === leave.id).length, 3)
})
test('Extension date changes only after approval and keeps original dates', () => {
  const leave = store.leaves.find((l) => app.employeeFor(l.employeeId).status === 'Overdue'),
    oldEnd = leave.end,
    newEnd = dates.addDays(dates.today(), 7)
  app.requestExtension(leave, newEnd, 'Family emergency')
  assert.equal(leave.end, oldEnd)
  app.approveExtension(leave)
  assert.equal(leave.end, newEnd)
  assert.equal(leave.originalEnd, oldEnd)
  assert.equal(app.employeeFor(leave.employeeId).status, 'Extended')
  assert(
    store.history.some(
      (h) => h.leaveId === leave.id && h.oldValues?.end === oldEnd && h.newValues?.end === newEnd
    )
  )
})
test('Follow-ups, late returns, and AWOL are synchronized and audited', () => {
  const overdue = store.leaves.filter((l) => app.employeeFor(l.employeeId).status === 'Overdue')
  app.recordFollowUp(overdue[0], 'No answer', 'Try again tomorrow', '')
  assert(app.movementFor(overdue[0]).lastFollowUp)
  app.setAwol(overdue[0])
  assert.equal(app.employeeFor(overdue[0].employeeId).status, 'AWOL')
  assert.equal(stats.value.overdue, 4)
  app.recordReturn(overdue[1], dates.localDateTime())
  assert.equal(app.employeeFor(overdue[1].employeeId).status, 'Returned Late')
  assert.equal(stats.value.overdue, 3)
  assert(store.history.some((h) => h.action === 'Final status set to AWOL'))
})
test('Rescheduling future leaves keeps history, and departed leaves stay locked', () => {
  const leave = store.leaves.find((l) => l.status === 'Scheduled'),
    original = { start: leave.start, end: leave.end },
    balance = app.employeeFor(leave.employeeId).remainingBalance
  app.saveLeave({
    ...leave,
    start: dates.addDays(leave.start, 2),
    end: dates.addDays(leave.end, 2),
  })
  assert(
    store.history.some(
      (h) => h.action === 'Leave rescheduled' && h.oldValues.start === original.start
    )
  )
  assert.equal(
    app.employeeFor(leave.employeeId).remainingBalance,
    balance + dates.workingDays(original.start, original.end) - leave.days
  )
  const departed = store.leaves.find((l) => app.movementFor(l)?.departedAt),
    lockedStart = departed.start
  assert.equal(app.saveLeave({ ...departed, start: dates.today() }), false)
  assert.equal(departed.start, lockedStart)
})
test('Overlap, balance, staffing warnings and Sunday exclusions', () => {
  const leave = store.leaves.find(
    (l) => l.status === 'On Leave' && app.employeeFor(l.employeeId).farm === 2
  )
  const warnings = rules.leaveWarnings(store, {
    employeeId: leave.employeeId,
    type: 'Annual Leave',
    start: leave.start,
    end: dates.addDays(leave.end, 20),
  })
  for (const type of ['overlap', 'balance', 'staffing'])
    assert(warnings.some((w) => w.type === type))
  assert.equal(dates.workingDays('2026-10-25', '2026-10-25'), 0)
  assert.equal(dates.workingDays('2026-10-26', '2026-10-26'), 1)
})
test('Blocking staffing rule prevents saving, and role access cannot cross farms', () => {
  store.settings.staffingMode = 'block'
  const employee = store.employees.find(
    (e) =>
      e.farm === 2 && e.status === 'On Site' && !store.leaves.some((l) => l.employeeId === e.id)
  )
  const count = store.leaves.length
  assert.equal(
    app.saveLeave({
      employeeId: employee.id,
      type: 'Annual Leave',
      start: dates.today(),
      end: dates.addDays(dates.today(), 1),
    }),
    false
  )
  assert.equal(store.leaves.length, count)
  app.setRole('Farm Admin')
  const other = store.leaves.find((l) => app.employeeFor(l.employeeId).farm === 1)
  const before = store.history.length
  app.approveLeave(other)
  app.recordDeparture(other, dates.localDateTime())
  assert.equal(store.history.length, before)
})
test('Future leave preserves an active absence and approved balances cannot be reserved twice', () => {
  const active = store.leaves.find((l) => l.status === 'On Leave')
  const employee = app.employeeFor(active.employeeId)
  app.saveLeave({
    employeeId: employee.id,
    type: 'Sick Leave',
    start: dates.addDays(active.end, 10),
    end: dates.addDays(active.end, 12),
  })
  assert.equal(employee.status, 'On Leave')
  app.recordDeparture(
    store.leaves.find(
      (l) => l.status === 'Scheduled' && app.employeeFor(l.employeeId).status === 'Scheduled'
    ),
    dates.localDateTime()
  )
  const departed = store.leaves.find(
    (l) => app.movementFor(l)?.departedAt && app.employeeFor(l.employeeId).status === 'On Leave'
  )
  assert.equal(departed.status, 'On Leave')
  const pending = store.leaves.find((l) => l.approval === 'Pending')
  app.approveLeave(pending)
  const balance = app.employeeFor(pending.employeeId).remainingBalance
  app.approveLeave(pending)
  assert.equal(app.employeeFor(pending.employeeId).remainingBalance, balance)
})
const sfc = require('@vue/compiler-sfc')
const sourceRoot = path.resolve(__dirname, '../src')
const vueFiles = [
  path.join(sourceRoot, 'App.vue'),
  ...fs
    .readdirSync(path.join(sourceRoot, 'components'))
    .filter((f) => f.endsWith('.vue') && f !== 'HelloWorld.vue')
    .map((f) => path.join(sourceRoot, 'components', f)),
  ...fs
    .readdirSync(path.join(sourceRoot, 'views'))
    .filter((f) => f.endsWith('View.vue'))
    .map((f) => path.join(sourceRoot, 'views', f)),
]
for (const filename of vueFiles) {
  const { descriptor, errors } = sfc.parse(fs.readFileSync(filename, 'utf8'), { filename })
  assert.deepEqual(errors, [], filename)
  const script = sfc.compileScript(descriptor, { id: filename })
  const template = sfc.compileTemplate({
    source: descriptor.template.content,
    filename,
    id: filename,
    compilerOptions: { bindingMetadata: script.bindings },
  })
  assert.deepEqual(template.errors, [], filename)
}
console.log(`PASS All ${vueFiles.length} Vue scripts and templates compile`)
reset()
console.log('All prototype checks passed.')
process.exit(0)
```

## Folder: src/

### src/App.vue

```vue
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './components/AppSidebar.vue'
import AppTopbar from './components/AppTopbar.vue'
import AppIcon from './components/AppIcon.vue'
import BaseToast from './components/BaseToast.vue'
import BaseModal from './components/BaseModal.vue'
import BaseButton from './components/BaseButton.vue'
import LeaveFormModal from './components/LeaveFormModal.vue'
import ConfirmLeaveModal from './components/ConfirmLeaveModal.vue'
import DepartureModal from './components/DepartureModal.vue'
import ReturnModal from './components/ReturnModal.vue'
import ExtensionModal from './components/ExtensionModal.vue'
import FollowUpModal from './components/FollowUpModal.vue'
import HistoryDrawer from './components/HistoryDrawer.vue'
import EmployeeDetailModal from './components/EmployeeDetailModal.vue'
import ReviewLeaveModal from './components/ReviewLeaveModal.vue'
import { store, closeModal, setAwol, employeeFor } from './utils/store'
const route = useRoute()
const components = {
  leave: LeaveFormModal,
  confirmLeave: ConfirmLeaveModal,
  departure: DepartureModal,
  return: ReturnModal,
  extension: ExtensionModal,
  followup: FollowUpModal,
  history: HistoryDrawer,
  employee: EmployeeDetailModal,
  review: ReviewLeaveModal,
}
const modalComponent = computed(() => components[store.modal?.type])
const modalProps = computed(() => {
  const value = { ...store.modal }
  delete value.type
  return value
})
</script>
<template>
  <div class="app-shell">
    <AppSidebar />
    <div class="workspace">
      <AppTopbar />
      <main class="page-container">
        <div class="breadcrumb">
          <AppIcon name="farm" :size="12" />
          <span>Workspace</span>
          <AppIcon name="chevron" :size="10" />
          <span>{{ route.meta.title }}</span>
        </div>
        <RouterView />
        <footer class="page-footer">
          <span>
            Farm HR Management
            <span class="muted">·</span>
            Taking care of the people who grow with us.
          </span>
          <span>Fictional data · For demonstration purposes</span>
        </footer>
      </main>
    </div>
    <component
      :is="modalComponent"
      v-if="modalComponent"
      :key="store.modal.type + (store.modal.leave?.id || '')"
      v-bind="modalProps"
    />
    <BaseModal
      v-if="store.modal?.type === 'awol'"
      title="Set final status to AWOL?"
      :subtitle="employeeFor(store.modal.leave.employeeId)?.name"
      @close="closeModal"
    >
      <div class="notice danger">
        <AppIcon name="alert" />
        This employee will remain off site with a final status of AWOL. This HR decision is recorded
        in the audit trail.
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
        <BaseButton variant="danger" @click="setAwol(store.modal.leave)">Confirm AWOL</BaseButton>
      </template>
    </BaseModal>
    <BaseToast />
  </div>
</template>
```

## Folder: src/assets/css/

### src/assets/css/base.css

```css
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: var(--app-bg);
  color: var(--text);
  font: 14px/1.5 var(--font);
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
}
button,
input,
select,
textarea {
  font: inherit;
}
button,
a,
input,
select,
textarea {
  -webkit-tap-highlight-color: transparent;
}
button {
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
a {
  color: inherit;
  text-decoration: none;
}
h1,
h2,
h3,
h4,
p {
  margin: 0;
}
h1,
h2,
h3,
h4 {
  font-weight: 600;
  line-height: 1.35;
}
h1 {
  font-size: 28px;
  letter-spacing: -1px;
}
h2 {
  font-size: 17px;
  letter-spacing: -0.3px;
}
h3 {
  font-size: 15px;
}
small {
  font-size: 11px;
}
svg {
  flex-shrink: 0;
}
button:focus-visible,
a:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible,
[tabindex]:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}
::selection {
  background: var(--onsite-bg);
}
::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}
::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 8px;
}
input,
select,
textarea {
  color: var(--text);
}
input::placeholder {
  color: var(--muted);
}
input[type='date'],
input[type='datetime-local'] {
  min-width: 0;
}
fieldset {
  border: 0;
  padding: 0;
  margin: 0;
}
legend {
  font-weight: 600;
  margin-bottom: 12px;
}
hr {
  border: 0;
  border-top: 1px solid var(--border);
  margin: 20px 0;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}
```

### src/assets/css/components.css

```css
.icon {
  width: 19px;
  height: 19px;
  display: inline-block;
  vertical-align: middle;
}
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 37px;
  padding: 8px 14px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.15s;
}
.btn .icon {
  width: 15px;
  height: 15px;
}
.btn-primary {
  background: var(--primary);
  color: var(--surface);
  box-shadow: var(--shadow);
}
.btn-primary:hover {
  background: var(--primary-hover);
}
.btn-secondary {
  background: var(--surface);
  border-color: var(--border);
  color: var(--text);
}
.btn-secondary:hover {
  background: var(--soft);
}
.btn-ghost {
  background: transparent;
  color: var(--muted);
}
.btn-ghost:hover {
  background: var(--green-soft);
  color: var(--primary);
}
.btn-danger {
  background: var(--overdue-bg);
  color: var(--overdue-text);
}
.btn-small {
  min-height: 28px;
  padding: 4px 9px;
  font-size: 10px;
}
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--muted);
}
.icon-btn:hover {
  background: var(--soft);
}
.text-link {
  background: none;
  border: 0;
  padding: 0;
  color: var(--primary);
  font-size: 11px;
  font-weight: 500;
  display: inline-flex;
  gap: 5px;
  align-items: center;
  white-space: nowrap;
}
.text-link:hover {
  text-decoration: underline;
}
.text-link .icon {
  width: 13px;
  height: 13px;
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
}
.card-header {
  padding: 22px 23px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.card-header p {
  font-size: 11px;
  color: var(--muted);
  margin-top: 5px;
}
.card-body {
  padding: 0 23px 21px;
}
.card-footer {
  border-top: 1px solid var(--border);
  padding: 13px 23px;
  font-size: 10px;
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 17px 17px 14px;
  box-shadow: var(--shadow);
  transition: transform 0.15s;
}
.stat-card:hover {
  transform: translateY(-2px);
}
.stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}
.stat-title {
  font-size: 11px;
  color: var(--muted);
  font-weight: 500;
}
.stat-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: var(--green-soft);
  color: var(--primary);
}
.stat-icon .icon {
  width: 15px;
  height: 15px;
}
.stat-value {
  font-size: 29px;
  line-height: 1.5;
  font-weight: 600;
  letter-spacing: -1px;
  margin-top: 5px;
}
.stat-caption {
  font-size: 9px;
  color: var(--muted);
  display: flex;
  gap: 4px;
  align-items: center;
}
.stat-card.returning .stat-icon {
  background: var(--returning-bg);
  color: var(--returning-text);
}
.stat-card.leave .stat-icon,
.stat-card.pending .stat-icon {
  background: var(--leave-bg);
  color: var(--leave-text);
}
.stat-card.overdue .stat-icon {
  background: var(--overdue-bg);
  color: var(--overdue-text);
}
.stat-card.overdue .stat-value {
  color: var(--overdue-text);
}
.stat-card.returning .stat-value {
  color: var(--returning-text);
}
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 8px;
  border-radius: 5px;
  font-size: 9px;
  font-weight: 500;
  line-height: 1.4;
  white-space: nowrap;
  background: var(--green-soft);
  color: var(--muted);
}
.status-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
}
.status-onsite {
  background: var(--onsite-bg);
  color: var(--onsite-text);
}
.status-scheduled {
  background: var(--scheduled-bg);
  color: var(--scheduled-text);
}
.status-leave,
.status-pending {
  background: var(--leave-bg);
  color: var(--leave-text);
}
.status-returning {
  background: var(--returning-bg);
  color: var(--returning-text);
}
.status-overdue {
  background: var(--overdue-bg);
  color: var(--overdue-text);
}
.status-extended {
  background: var(--extended-bg);
  color: var(--extended-text);
}
.status-late {
  background: var(--late-bg);
  color: var(--late-text);
}
.status-awol {
  background: var(--awol-bg);
  color: var(--awol-text);
}
.muted {
  color: var(--muted);
}
.small {
  font-size: 11px;
}
.tiny {
  font-size: 10px;
}
.strong {
  font-weight: 600;
}
.eyebrow {
  text-transform: uppercase;
  letter-spacing: 1.3px;
  font-size: 9px;
  color: var(--muted);
  font-weight: 500;
}
.flex {
  display: flex;
  align-items: center;
  gap: 10px;
}
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.mt-16 {
  margin-top: 16px;
}
.mt-24 {
  margin-top: 24px;
}
.mb-16 {
  margin-bottom: 16px;
}
.badge-count {
  background: var(--green-soft);
  font-size: 10px;
  color: var(--muted);
  border-radius: 5px;
  padding: 2px 6px;
}
.warning-badge {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  font-size: 9px;
  color: var(--warning-text);
  background: var(--warning-bg);
  padding: 3px 7px;
  border-radius: 4px;
  white-space: nowrap;
}
.warning-badge .icon {
  width: 11px;
  height: 11px;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 500;
  font-size: 10px;
  color: var(--onsite-text);
  background: var(--onsite-bg);
  flex-shrink: 0;
}
.avatar.blue {
  color: var(--scheduled-text);
  background: var(--scheduled-bg);
}
.avatar.purple {
  color: var(--extended-text);
  background: var(--extended-bg);
}
.avatar.sand {
  color: var(--late-text);
  background: var(--late-bg);
}
.avatar.square {
  border-radius: 8px;
}
.person {
  display: flex;
  align-items: center;
  gap: 10px;
}
.person strong {
  font-weight: 500;
  font-size: 11px;
  display: block;
}
.person small {
  color: var(--muted);
  font-size: 9px;
  display: block;
  margin-top: 1px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 11px;
}
.field > span,
.field > label {
  font-weight: 500;
}
.input,
select,
textarea {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  padding: 9px 11px;
  font-size: 11px;
  min-height: 37px;
  width: 100%;
}
.field small {
  color: var(--muted);
  font-size: 10px;
  font-weight: 400;
}
.search-input {
  position: relative;
  min-width: 190px;
  flex: 1;
}
.search-input .icon {
  position: absolute;
  left: 11px;
  top: 11px;
  width: 15px;
  height: 15px;
  color: var(--muted);
}
.search-input input {
  padding-left: 34px;
}
.filter-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 22px;
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}
.filter-bar select {
  width: auto;
  max-width: 190px;
}
.filter-bar .search-input {
  max-width: 310px;
}
.filter-count {
  margin-left: auto;
  font-size: 10px;
  color: var(--muted);
}
.table-scroll {
  overflow: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  white-space: nowrap;
  font-size: 13px;
}
th {
  font-size: 9px;
  letter-spacing: 0.3px;
  color: var(--muted);
  background: var(--soft);
  font-weight: 500;
  padding: 12px 20px;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
td {
  padding: 13px 20px;
  border-bottom: 1px solid var(--border);
  font-size: 11px;
}
tbody tr:last-child td {
  border-bottom: 0;
}
tbody tr:hover {
  background: var(--soft);
}
tr.clickable {
  cursor: pointer;
}
.table-actions {
  display: flex;
  gap: 9px;
  align-items: center;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 52px 20px;
  gap: 12px;
  color: var(--muted);
}
.empty-state > .icon {
  width: 29px;
  height: 29px;
  color: var(--primary);
}
.empty-state h3 {
  color: var(--text);
  font-size: 14px;
}
.empty-state p {
  font-size: 12px;
  max-width: 340px;
}
.tabs {
  display: flex;
  gap: 25px;
  border-bottom: 1px solid var(--border);
  padding: 0 23px;
  overflow: auto;
}
.tab {
  padding: 16px 0 13px;
  border: 0;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  background: transparent;
  color: var(--muted);
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  font-weight: 600;
}
.tab.active .badge-count {
  background: var(--onsite-bg);
  color: var(--onsite-text);
}
.progress-track {
  height: 6px;
  border-radius: 10px;
  background: var(--green-soft);
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  border-radius: 10px;
  background: var(--primary);
}
.progress-fill.warning {
  background: var(--warning-text);
  opacity: 0.65;
}
.farm-row {
  display: grid;
  grid-template-columns: 89px 1fr 40px 100px;
  gap: 14px;
  align-items: center;
  padding: 12px 0;
  width: 100%;
  border: 0;
  background: none;
  text-align: left;
}
.farm-row:hover {
  background: var(--soft);
  border-radius: 6px;
}
.farm-row .farm-name {
  font-size: 11px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 9px;
}
.farm-row .farm-name .icon {
  width: 14px;
  height: 14px;
  color: var(--muted);
}
.farm-percentage {
  font-size: 11px;
  font-weight: 500;
  text-align: right;
}
.farm-headcount {
  font-size: 9px;
  color: var(--muted);
}
.farm-legend {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 9px;
  color: var(--muted);
  padding-top: 17px;
  border-top: 1px solid var(--border);
  margin-top: 9px;
}
.legend-dot {
  height: 6px;
  width: 6px;
  display: inline-block;
  border-radius: 50%;
  background: var(--primary);
  margin-right: 4px;
}
.legend-dot.warning {
  background: var(--warning-text);
}
.attention-groups {
  padding: 0 22px 10px;
  max-height: 425px;
  overflow: auto;
}
.attention-group + .attention-group {
  margin-top: 15px;
}
.attention-label {
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  font-weight: 500;
  color: var(--muted);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 5px;
}
.attention-label .icon {
  width: 13px;
  height: 13px;
}
.attention-label.danger {
  color: var(--overdue-text);
}
.attention-row {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}
.attention-row:last-child {
  border-bottom: 0;
}
.attention-row .avatar {
  width: 28px;
  height: 28px;
  font-size: 9px;
}
.attention-main {
  flex: 1;
  min-width: 0;
}
.attention-main strong {
  display: block;
  font-size: 10px;
  font-weight: 500;
}
.attention-main small {
  display: block;
  color: var(--muted);
  font-size: 9px;
  margin-top: 2px;
}
.activity-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.activity-row:last-child {
  border-bottom: 0;
}
.activity-symbol {
  width: 31px;
  height: 31px;
  border-radius: 8px;
  background: var(--green-soft);
  color: var(--primary);
  display: grid;
  place-items: center;
}
.activity-symbol .icon {
  width: 15px;
  height: 15px;
}
.activity-row p {
  font-size: 11px;
}
.activity-row small {
  font-size: 9px;
  color: var(--muted);
}
.activity-time {
  font-size: 9px;
  color: var(--muted);
  margin-left: auto;
  white-space: nowrap;
}
.insight-strip {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: var(--green-soft);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 17px 20px;
  font-size: 11px;
  margin-top: 21px;
}
.insight-strip > .icon {
  color: var(--primary);
  margin-top: 1px;
}
.insight-strip strong {
  display: block;
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 3px;
}
.insight-strip p {
  font-size: 10px;
  color: var(--muted);
}
.insight-strip .text-link {
  margin-left: auto;
  align-self: center;
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  backdrop-filter: blur(3px);
}
.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow-lg);
  width: 560px;
  max-width: 100%;
  max-height: 90vh;
  overflow: auto;
  outline: 0;
}
.modal.wide {
  width: 760px;
}
.modal.drawer {
  height: 100vh;
  max-height: 100vh;
  border-radius: 0;
  width: 520px;
  position: absolute;
  right: 0;
  top: 0;
}
.modal-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 20px;
  padding: 24px 26px 18px;
  border-bottom: 1px solid var(--border);
}
.modal-header h2 {
  font-size: 20px;
}
.modal-header p {
  font-size: 11px;
  color: var(--muted);
  margin-top: 5px;
}
.modal-body {
  padding: 23px 26px;
}
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
  padding: 17px 26px;
  border-top: 1px solid var(--border);
  background: var(--soft);
}
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 17px;
}
.form-summary {
  background: var(--soft);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 11px;
}
.form-summary strong {
  display: block;
  font-size: 20px;
  margin-top: 5px;
}
.notice {
  padding: 12px 14px;
  border-radius: var(--radius-sm);
  display: flex;
  gap: 9px;
  font-size: 11px;
  align-items: flex-start;
  background: var(--green-soft);
  color: var(--onsite-text);
}
.notice.warning {
  background: var(--warning-bg);
  color: var(--warning-text);
}
.notice.danger {
  background: var(--overdue-bg);
  color: var(--overdue-text);
}
.notice .icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.form-error {
  color: var(--overdue-text);
  font-size: 11px;
}
.toast-stack {
  position: fixed;
  bottom: 25px;
  right: 25px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 430px;
}
.toast {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--primary);
  border-radius: var(--radius-sm);
  padding: 15px 16px;
  box-shadow: var(--shadow-lg);
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  animation: toast-in 0.2s ease-out;
}
.toast > .icon {
  color: var(--primary);
}
.toast.error {
  border-left-color: var(--overdue-text);
}
.toast .icon-btn {
  border: 0;
  margin-left: 10px;
  width: 22px;
  height: 22px;
}
.history-entry {
  position: relative;
  margin-left: 9px;
  padding: 0 0 24px 22px;
  border-left: 1px solid var(--border);
}
.history-entry:before {
  content: '';
  position: absolute;
  left: -4px;
  top: 5px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--primary);
}
.history-entry h4 {
  font-size: 12px;
}
.history-entry p {
  font-size: 10px;
  color: var(--muted);
  margin-top: 5px;
}
.history-values {
  background: var(--soft);
  border: 1px solid var(--border);
  padding: 11px;
  margin-top: 10px;
  border-radius: 6px;
  font-size: 10px;
}
.history-values div + div {
  margin-top: 5px;
}
.history-values code {
  font: inherit;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.recorded-late {
  font-size: 8px;
  color: var(--late-text);
  background: var(--late-bg);
  border-radius: 4px;
  padding: 2px 5px;
  display: inline-block;
  margin-top: 4px;
}
.profile-header {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 22px;
}
.profile-header .avatar {
  width: 52px;
  height: 52px;
  font-size: 17px;
}
.profile-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  font-size: 12px;
}
.profile-grid dt {
  font-size: 10px;
  color: var(--muted);
  margin-bottom: 4px;
}
.profile-grid dd {
  margin: 0;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  font-size: 10px;
  color: var(--muted);
}
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
.mini-chart {
  display: flex;
  align-items: end;
  gap: 7px;
  height: 91px;
  padding-top: 10px;
}
.mini-chart-column {
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  font-size: 8px;
  color: var(--muted);
}
.mini-chart-bar {
  background: var(--primary);
  border-radius: 3px 3px 0 0;
  width: 100%;
  min-height: 3px;
  opacity: 0.75;
}
.mini-chart-bar.warning {
  background: var(--warning-text);
}
.staffing-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 16px 0;
}
.staffing-metrics strong {
  display: block;
  font-size: 21px;
  font-weight: 600;
}
.staffing-metrics span {
  font-size: 9px;
  color: var(--muted);
}
.staffing-caption {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  margin-top: 12px;
}
.report-metrics {
  grid-template-columns: repeat(4, 1fr);
}
.timeline-toolbar {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}
.segmented {
  display: flex;
  background: var(--soft);
  border: 1px solid var(--border);
  padding: 3px;
  border-radius: 7px;
}
.segmented button {
  border: 0;
  border-radius: 4px;
  padding: 5px 9px;
  font-size: 10px;
  color: var(--muted);
  background: transparent;
}
.segmented button.active {
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow);
}
.timeline-scroll {
  overflow: auto;
  max-height: 580px;
  user-select: none;
}
.timeline-grid {
  display: grid;
  min-width: max-content;
  position: relative;
}
.timeline-cell {
  height: 52px;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  position: relative;
  background: var(--surface);
}
.timeline-cell.weekend {
  background: var(--soft);
}
.timeline-cell.today-cell {
  box-shadow: inset 2px 0 var(--primary);
}
.timeline-cell.selected-cell {
  background: var(--onsite-bg);
}
.timeline-name {
  position: sticky;
  left: 0;
  z-index: 4;
  padding: 10px 14px;
  background: var(--surface);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  height: 52px;
  width: 210px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.timeline-name .avatar {
  height: 26px;
  width: 26px;
  font-size: 9px;
}
.timeline-name strong {
  font-size: 10px;
  font-weight: 500;
  display: block;
}
.timeline-name small {
  font-size: 8px;
  color: var(--muted);
  display: block;
}
.timeline-date {
  height: 49px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  text-align: center;
  padding: 7px 0;
  background: var(--soft);
  position: sticky;
  top: 0;
  z-index: 6;
  font-size: 11px;
}
.timeline-date small {
  display: block;
  color: var(--muted);
  font-size: 8px;
}
.timeline-date.current {
  color: var(--primary);
  background: var(--onsite-bg);
}
.timeline-name.heading {
  background: var(--soft);
  font-size: 10px;
  font-weight: 500;
  position: sticky;
  top: 0;
  z-index: 8;
  height: 49px;
}
.staffing-cell {
  height: 30px;
  text-align: center;
  font-size: 9px;
  padding: 8px 2px;
  background: var(--onsite-bg);
  color: var(--onsite-text);
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.staffing-cell.low {
  background: var(--warning-bg);
  color: var(--warning-text);
}
.timeline-name.staffing-name {
  height: 30px;
  font-size: 9px;
  color: var(--muted);
  background: var(--soft);
}
.timeline-bar {
  position: absolute;
  top: 14px;
  left: 2px;
  height: 24px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 7px;
  z-index: 3;
  font-size: 9px;
  white-space: nowrap;
  overflow: hidden;
  border: 1px solid currentColor;
  cursor: grab;
}
.timeline-bar.locked {
  cursor: default;
}
.timeline-bar.extension {
  background-image: repeating-linear-gradient(
    135deg,
    transparent,
    transparent 4px,
    var(--surface) 4px,
    var(--surface) 5px
  );
}
.timeline-bar .icon {
  width: 10px;
  height: 10px;
}
.timeline-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  padding: 14px 20px;
  border-top: 1px solid var(--border);
  font-size: 9px;
  color: var(--muted);
}
.timeline-help {
  font-size: 10px;
  color: var(--muted);
  padding: 0 20px 15px;
}
.return-marker {
  position: absolute;
  right: 4px;
  font-size: 11px;
  font-weight: 600;
}
.report-type {
  max-width: 230px;
}
.filter-date {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 10px;
}
.filter-date input {
  max-width: 138px;
}
.stack .field select {
  max-width: 100%;
}
@keyframes toast-in {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
@media (max-width: 650px) {
  .farm-row {
    grid-template-columns: 65px 1fr 34px;
    gap: 8px;
  }
  .farm-row > div:last-child {
    display: none;
  }
  .card-header {
    padding: 18px;
  }
  .card-body {
    padding: 0 18px 18px;
  }
  .filter-bar {
    padding: 13px;
    gap: 8px;
  }
  .filter-bar .search-input {
    max-width: none;
    width: 100%;
  }
  .filter-count {
    display: none;
  }
  .modal-backdrop {
    padding: 12px;
  }
  .modal-body,
  .modal-header,
  .modal-footer {
    padding: 20px;
  }
  .form-summary {
    gap: 8px;
  }
  .toast-stack {
    left: 15px;
    right: 15px;
    bottom: 15px;
  }
  .report-metrics {
    grid-template-columns: repeat(2, 1fr);
  }
  .insight-strip .text-link {
    display: none;
  }
  .card-footer {
    padding: 12px 18px;
  }
  .user-summary {
    display: none;
  }
  .tabs {
    gap: 20px;
    padding: 0 18px;
  }
  .filter-date {
    flex-wrap: wrap;
  }
}
.timeline-name:is(button) {
  border-top: 0;
  border-left: 0;
  text-align: left;
  color: var(--text);
  font-family: var(--font);
}
.brand-mark .icon {
  width: 36px;
  height: 36px;
}
td {
  font-size: 13px;
}
th {
  font-size: 10px;
}
.person strong {
  font-size: 12px;
}
.person small {
  font-size: 10px;
}
.status-badge {
  font-size: 10px;
}
.stat-title {
  font-size: 12px;
}
.stat-caption {
  font-size: 10px;
}
.farm-row .farm-name {
  font-size: 12px;
}
.farm-headcount {
  font-size: 10px;
}
.farm-percentage {
  font-size: 12px;
}
.attention-label {
  font-size: 10px;
}
.attention-main strong {
  font-size: 12px;
}
.attention-main small {
  font-size: 10px;
}
.text-link {
  font-size: 12px;
}
.btn {
  font-size: 12px;
}
.btn-small {
  font-size: 11px;
}
.input,
select,
textarea {
  font-size: 12px;
}
.card-header p {
  font-size: 12px;
}
.activity-row p {
  font-size: 12px;
}
.activity-row small {
  font-size: 10px;
}
.card-footer {
  font-size: 11px;
}
.page-header p {
  font-size: 13px;
}
.timeline-name strong {
  font-size: 11px;
}
.timeline-name small {
  font-size: 9px;
}
.timeline-bar {
  font-size: 10px;
}
```

### src/assets/css/layout.css

```css
.app-shell {
  min-height: 100vh;
}
.sidebar {
  width: var(--sidebar-width);
  position: fixed;
  inset: 0 auto 0 0;
  background: var(--sidebar);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  padding: 31px 18px 18px;
  z-index: 30;
}
.brand {
  display: flex;
  gap: 11px;
  align-items: center;
  padding: 0 12px 30px;
}
.brand-mark {
  width: 36px;
  height: 40px;
  display: grid;
  place-items: center;
}
.brand-title {
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
}
.brand-subtitle {
  font-size: 9px;
  letter-spacing: 1.65px;
  color: var(--sidebar-muted);
  margin-top: 2px;
}
.nav-label {
  font-size: 10px;
  color: var(--sidebar-muted);
  letter-spacing: 1.6px;
  padding: 21px 15px 12px;
}
.sidebar nav {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.nav-link {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 15px;
  border-radius: 7px;
  color: var(--sidebar-muted);
  font-size: 13px;
  transition: background 0.15s, color 0.15s;
}
.nav-link:hover,
.nav-link.router-link-active {
  background: var(--sidebar-active);
  color: var(--surface);
}
.nav-link.router-link-active {
  font-weight: 500;
}
.nav-count {
  margin-left: auto;
  font-size: 10px;
  padding: 1px 6px;
  min-width: 20px;
  text-align: center;
  border-radius: 5px;
  background: var(--sidebar-active);
  color: var(--sidebar-text);
}
.nav-count.alert {
  background: var(--leave-bg);
  color: var(--leave-text);
}
.sidebar-bottom {
  margin-top: auto;
}
.sidebar-note {
  border: 1px solid var(--sidebar-active);
  border-radius: 9px;
  padding: 16px;
  margin: 24px 9px;
  color: var(--sidebar-muted);
  font-size: 11px;
}
.sidebar-note strong {
  display: block;
  color: var(--sidebar-text);
  font-size: 12px;
  margin: 9px 0 5px;
}
.sidebar-footer {
  border-top: 1px solid var(--sidebar-active);
  padding: 17px 10px 0;
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 10px;
  color: var(--sidebar-muted);
}
.connection-dot {
  width: 6px;
  height: 6px;
  background: var(--sidebar-muted);
  border-radius: 50%;
}
.workspace {
  margin-left: var(--sidebar-width);
}
.topbar {
  height: 81px;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 36px;
  position: relative;
  z-index: 20;
}
.topbar-left,
.topbar-right {
  display: flex;
  align-items: center;
  gap: 18px;
}
.topbar .farm-control {
  display: flex;
  align-items: center;
  gap: 9px;
}
.topbar .farm-control select {
  border: 0;
  min-width: 135px;
  font-weight: 500;
  background: var(--surface);
  padding-left: 0;
}
.topbar-divider {
  height: 25px;
  width: 1px;
  background: var(--border);
}
.topbar-date {
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
}
.user-summary {
  display: flex;
  gap: 10px;
  align-items: center;
}
.user-summary strong {
  font-size: 12px;
  display: block;
  font-weight: 500;
}
.user-summary small {
  display: block;
  color: var(--muted);
  font-size: 10px;
}
.prototype-banner {
  background: var(--green-soft);
  border-bottom: 1px solid var(--border);
  min-height: 34px;
  padding: 8px 36px;
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--muted);
  font-size: 10px;
}
.prototype-banner .demo-pill {
  margin-left: auto;
  color: var(--primary);
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1.1px;
  font-weight: 600;
}
.page-container {
  max-width: 1660px;
  margin: 0 auto;
  padding: 31px 36px 24px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  color: var(--muted);
  margin-bottom: 18px;
}
.breadcrumb span:last-child {
  color: var(--text);
}
.page-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 25px;
}
.page-header p {
  color: var(--muted);
  font-size: 12px;
  margin-top: 7px;
}
.header-actions {
  display: flex;
  gap: 9px;
  align-items: center;
  flex-shrink: 0;
}
.grid {
  display: grid;
  gap: 20px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 23px;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(340px, 1fr);
  gap: 22px;
  align-items: start;
}
.two-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.three-column {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}
.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--muted);
  font-size: 10px;
  margin-top: 23px;
  gap: 16px;
}
.settings-wrap {
  position: relative;
}
.settings-popover {
  position: absolute;
  right: 0;
  top: 45px;
  background: var(--surface);
  padding: 22px;
  width: 315px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  z-index: 50;
}
.settings-popover h3 {
  margin-bottom: 18px;
}
.settings-popover .field {
  margin-bottom: 14px;
}
.settings-popover .btn {
  margin-top: 10px;
}
.mobile-brand {
  display: none;
}
@media (min-width: 1600px) {
  .page-container {
    padding-top: 38px;
  }
  .dashboard-grid {
    grid-template-columns: 1.35fr 1fr;
  }
  .stat-value {
    font-size: 34px !important;
  }
}
@media (max-width: 1200px) {
  :root {
    --sidebar-width: 205px;
  }
  .topbar {
    padding: 0 24px;
  }
  .page-container {
    padding: 26px 24px;
  }
  .prototype-banner {
    padding-left: 24px;
    padding-right: 24px;
  }
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .topbar-date {
    display: none;
  }
  .dashboard-grid {
    grid-template-columns: 1.1fr 1fr;
    gap: 16px;
  }
  .three-column {
    grid-template-columns: repeat(2, 1fr);
  }
  .sidebar {
    padding-left: 12px;
    padding-right: 12px;
  }
  .brand {
    padding-left: 8px;
    gap: 6px;
  }
  .brand-title {
    font-size: 14px;
  }
}
@media (max-width: 950px) {
  :root {
    --sidebar-width: 76px;
  }
  .sidebar {
    padding: 25px 10px 18px;
  }
  .brand {
    padding: 0 9px 25px;
  }
  .brand-copy,
  .nav-label,
  .nav-text,
  .sidebar-note,
  .sidebar-footer,
  .nav-count {
    display: none;
  }
  .nav-link {
    justify-content: center;
    padding: 14px 8px;
  }
  .sidebar nav {
    gap: 9px;
  }
  .topbar {
    gap: 10px;
    padding: 0 20px;
  }
  .topbar-right {
    gap: 10px;
  }
  .page-container {
    padding: 25px 20px;
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  .page-header {
    align-items: start;
  }
  .three-column {
    grid-template-columns: repeat(2, 1fr);
  }
  .role-label {
    display: none;
  }
}
@media (max-width: 650px) {
  .topbar {
    height: auto;
    min-height: 80px;
    flex-wrap: wrap;
    padding: 14px;
  }
  .topbar-left {
    gap: 9px;
  }
  .topbar-right .user-summary {
    display: none;
  }
  .topbar-divider {
    display: none;
  }
  .prototype-banner {
    padding: 8px 14px;
  }
  .demo-pill {
    display: none;
  }
  .page-container {
    padding: 22px 14px;
  }
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  h1 {
    font-size: 24px;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 9px;
  }
  .three-column,
  .two-column {
    grid-template-columns: 1fr;
  }
  .header-actions {
    flex-wrap: wrap;
  }
  .page-footer {
    align-items: start;
  }
  .page-footer span:last-child {
    display: none;
  }
  .topbar .farm-control select {
    min-width: 100px;
  }
  .breadcrumb {
    margin-bottom: 12px;
  }
}
```

### src/assets/css/variables.css

```css
:root {
  --app-bg: #f5f7f4;
  --surface: #ffffff;
  --sidebar: #2f4a3f;
  --sidebar-text: #e8efea;
  --sidebar-active: #3f6354;
  --primary: #4f8a6b;
  --primary-hover: #437a5d;
  --accent: #5b8db8;
  --text: #26332c;
  --muted: #6b7a72;
  --border: #e1e7e2;
  --onsite-bg: #e4f1e8;
  --onsite-text: #2e6b47;
  --scheduled-bg: #e3edf7;
  --scheduled-text: #2f5f8a;
  --leave-bg: #fff1d9;
  --leave-text: #8a5a12;
  --returning-bg: #e6eef9;
  --returning-text: #3a5fa0;
  --overdue-bg: #fbe4e1;
  --overdue-text: #a33a30;
  --extended-bg: #eee6f5;
  --extended-text: #6a4a8c;
  --late-bg: #f5ebdd;
  --late-text: #7a5a2e;
  --awol-bg: #f2d9d6;
  --awol-text: #7d241c;
  --warning-bg: #fff4dc;
  --warning-text: #8a5a12;
  --soft: #f8faf7;
  --green-soft: #edf3ed;
  --sidebar-muted: #b8cbbe;
  --overlay: rgba(20, 39, 28, 0.4);
  --shadow: 0 1px 3px rgba(38, 51, 44, 0.08);
  --shadow-lg: 0 18px 70px rgba(38, 51, 44, 0.16);
  --radius: 10px;
  --radius-sm: 8px;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --font: 'Inter', system-ui, 'Segoe UI', Arial, sans-serif;
  --sidebar-width: 236px;
}
```

## Folder: src/assets/fonts/

### src/assets/fonts/README.md

```markdown
Inter is loaded through Google Fonts in public/index.html. System UI, Segoe UI, and Arial are fallbacks; no font binaries are required.
```

## Folder: src/assets/image/

### src/assets/image/README.md

```markdown
The application uses its own inline SVG brand mark and icons. No image downloads are required.
```

## Folder: src/components/

### src/components/AppIcon.vue

```vue
<script setup>
defineProps({ name: String, size: { type: [Number, String], default: 19 } })
const paths = {
  dashboard: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
  calendar:
    'M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2z M7 3v4 M17 3v4 M3 10h18 M7 14h2 M12 14h2 M7 18h2',
  users:
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M16 3a4 4 0 0 1 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  leaf: 'M20 3C9 1 2 8 5 15c4 8 17 3 15-12z M4 21 16 9 M10 15v-5 M10 15h5',
  movement: 'M3 7h17 M15 2l5 5-5 5 M21 17H4 M9 12l-5 5 5 5',
  chart: 'M4 3v18h17 M8 16v-4 M13 16V7 M18 16v-7',
  report: 'M5 3h9l5 5v13H5z M14 3v6h5 M9 13h6 M9 17h6',
  farm: 'M3 10 12 3l9 7v11H3z M8 21v-8h8v8 M3 10h18 M10 7h4',
  chevron: 'm9 5 7 7-7 7',
  down: 'm6 9 6 6 6-6',
  left: 'm15 5-7 7 7 7',
  plus: 'M12 5v14 M5 12h14',
  close: 'm6 6 12 12 M6 18 18 6',
  search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
  check: 'm5 12 4 4L19 6',
  clock: 'M12 8v5l3 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  alert: 'm12 3 10 18H2z M12 9v5 M12 17h.01',
  info: 'M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
  settings:
    'M9 3h6l1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  download: 'M12 3v12 m-5-5 5 5 5-5 M4 16v5h16v-5',
  arrow: 'M4 12h16 m-5-5 5 5-5 5',
  history: 'M3 3v6h6 M3 9a9 9 0 1 1 0 6 M12 7v5l3 2',
  lock: 'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4 M12 14v3',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8 M10 20h4',
  sun: 'M12 2v2 M12 20v2 M2 12h2 M20 12h2 M5 5l2 2 M17 17l2 2 M5 19l2-2 M17 7l2-2 M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',
  shield: 'M12 2 3 6v6c0 6 9 10 9 10s9-4 9-10V6z m-5 10 3 3 5-6',
  mail: 'M3 5h18v14H3z m0 0 9 8 9-8',
  dots: 'M5 12h.01 M12 12h.01 M19 12h.01',
  sprout: 'M12 21V10 M12 15C4 15 2 11 3 5c7-1 10 3 9 10z M12 10c0-6 4-8 9-7 0 5-3 8-9 7',
}
</script>
<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.65"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] || paths.info" />
  </svg>
</template>
```

### src/components/AppSidebar.vue

```vue
<script setup>
import { pages } from '../router'
import { stats, store } from '../utils/store'
import AppIcon from './AppIcon.vue'
</script>
<template>
  <aside class="sidebar">
    <RouterLink to="/dashboard" class="brand" aria-label="Farm HR Management home">
      <span class="brand-mark"><AppIcon name="sprout" :size="36" /></span>
      <div class="brand-copy">
        <div class="brand-title">FARM HR</div>
        <div class="brand-subtitle">MANAGEMENT</div>
      </div>
    </RouterLink>
    <div class="nav-label">WORKSPACE</div>
    <nav aria-label="Main navigation">
      <RouterLink
        v-for="page in pages"
        :key="page.path"
        :to="page.path"
        class="nav-link"
        :title="page.meta.title"
      >
        <AppIcon :name="page.meta.icon" />
        <span class="nav-text">{{ page.meta.title }}</span>
        <span v-if="page.name === 'leave' && stats.pending" class="nav-count">
          {{ stats.pending }}
        </span>
        <span v-if="page.name === 'movement' && stats.overdue" class="nav-count alert">
          {{ stats.overdue }}
        </span>
      </RouterLink>
    </nav>
    <div class="sidebar-bottom">
      <div class="sidebar-note">
        <AppIcon name="sprout" />
        <strong>People first. Farms forward.</strong>
        A little less admin.
        <br />
        More room to grow.
      </div>
      <div class="sidebar-footer">
        <span class="connection-dot" />
        Frontend prototype
        <span style="margin-left: auto">v1.0</span>
      </div>
      <div class="sr-only">Current role: {{ store.role }}</div>
    </div>
  </aside>
</template>
```

### src/components/AppTopbar.vue

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { store, currentUser, resetDemo, toast } from '../utils/store'
import { formatDate, today } from '../utils/dateUtils'
import FarmSelector from './FarmSelector.vue'
import RoleSwitcher from './RoleSwitcher.vue'
import AppIcon from './AppIcon.vue'
import BaseButton from './BaseButton.vue'
const settingsOpen = ref(false),
  settingsEl = ref(null),
  resetConfirm = ref(false)
function outside(event) {
  if (!settingsEl.value?.contains(event.target)) {
    settingsOpen.value = false
    resetConfirm.value = false
  }
}
function escape(event) {
  if (event.key === 'Escape') settingsOpen.value = false
}
function handleReset() {
  resetDemo()
  settingsOpen.value = false
  resetConfirm.value = false
}
onMounted(() => {
  document.addEventListener('click', outside)
  document.addEventListener('keydown', escape)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', outside)
  document.removeEventListener('keydown', escape)
})
</script>
<template>
  <header class="topbar">
    <div class="topbar-left">
      <FarmSelector />
      <span class="topbar-divider" />
      <RoleSwitcher />
    </div>
    <div class="topbar-right">
      <span class="topbar-date">
        {{ formatDate(today(), { weekday: 'short', year: 'numeric' }) }}
      </span>
      <div ref="settingsEl" class="settings-wrap">
        <button
          class="icon-btn"
          aria-label="Demo settings"
          :aria-expanded="settingsOpen"
          @click="settingsOpen = !settingsOpen"
        >
          <AppIcon name="settings" />
        </button>
        <div v-if="settingsOpen" class="settings-popover">
          <h3>Demo settings</h3>
          <template v-if="store.role === 'HR'">
            <label class="field">
              <span>Leave approval</span>
              <select
                v-model="store.settings.approvalMode"
                @change="toast('Approval rule updated')"
              >
                <option value="hr_approves">HR approves</option>
                <option value="admin_approves">HR or Farm Admin approves</option>
              </select>
            </label>
            <label class="field">
              <span>Below minimum staffing</span>
              <select
                v-model="store.settings.staffingMode"
                @change="toast('Staffing rule updated')"
              >
                <option value="warning">Warn and allow</option>
                <option value="block">Block new leave</option>
              </select>
            </label>
          </template>
          <p v-else class="small muted">HR manages the suggested approval and staffing rules.</p>
          <p class="tiny muted">
            Working days exclude Sundays and sample holidays. Data resets on reload.
          </p>
          <BaseButton
            v-if="!resetConfirm"
            variant="ghost"
            icon="history"
            @click="resetConfirm = true"
          >
            Reset demo data
          </BaseButton>
          <div v-else class="mt-16">
            <p class="small">Discard changes to this demo?</p>
            <div class="flex mt-16">
              <BaseButton variant="danger" small @click="handleReset">Reset data</BaseButton>
              <BaseButton variant="ghost" small @click="resetConfirm = false">Cancel</BaseButton>
            </div>
          </div>
        </div>
      </div>
      <span class="topbar-divider" />
      <div class="user-summary">
        <span class="avatar square">{{ store.role === 'HR' ? 'CR' : 'RC' }}</span>
        <div>
          <strong>{{ currentUser }}</strong>
          <small>{{ store.role === 'HR' ? 'HR Administrator' : 'Farm Administrator' }}</small>
        </div>
      </div>
    </div>
  </header>
  <div class="prototype-banner">
    <AppIcon name="info" :size="12" />
    <span>Prototype: fictional data. Rules shown are suggested defaults.</span>
    <span class="demo-pill">Interactive demo</span>
  </div>
</template>
```

### src/components/BaseButton.vue

```vue
<script setup>
import AppIcon from './AppIcon.vue'
defineProps({
  variant: { type: String, default: 'primary' },
  icon: String,
  small: Boolean,
  type: { type: String, default: 'button' },
})
</script>
<template>
  <button :type="type" :class="['btn', 'btn-' + variant, { 'btn-small': small }]">
    <AppIcon v-if="icon" :name="icon" />
    <slot />
  </button>
</template>
```

### src/components/BaseModal.vue

```vue
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import AppIcon from './AppIcon.vue'
const props = defineProps({ title: String, subtitle: String, wide: Boolean, drawer: Boolean })
const emit = defineEmits(['close'])
const panel = ref(null)
let previousFocus
function handleKey(event) {
  if (event.key === 'Escape') emit('close')
  if (event.key === 'Tab') {
    const elements = [
      ...panel.value.querySelectorAll(
        'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea, a[href], [tabindex="0"]'
      ),
    ].filter((el) => el.offsetParent !== null)
    const first = elements[0],
      last = elements[elements.length - 1]
    if (!first) {
      event.preventDefault()
      panel.value.focus()
    } else if (
      event.shiftKey &&
      (document.activeElement === first || document.activeElement === panel.value)
    ) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }
}
onMounted(async () => {
  previousFocus = document.activeElement
  document.body.style.overflow = 'hidden'
  document.addEventListener('keydown', handleKey)
  await nextTick()
  panel.value.focus()
})
onBeforeUnmount(() => {
  document.body.style.overflow = ''
  document.removeEventListener('keydown', handleKey)
  previousFocus?.focus?.()
})
</script>
<template>
  <Teleport to="body">
    <div class="modal-backdrop" @mousedown.self="$emit('close')">
      <section
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-label="props.title"
        tabindex="-1"
        :class="['modal', { wide, drawer }]"
      >
        <header class="modal-header">
          <div>
            <h2>{{ title }}</h2>
            <p v-if="subtitle">{{ subtitle }}</p>
          </div>
          <button class="icon-btn" aria-label="Close dialog" @click="$emit('close')">
            <AppIcon name="close" />
          </button>
        </header>
        <div class="modal-body"><slot /></div>
        <footer v-if="$slots.footer" class="modal-footer"><slot name="footer" /></footer>
      </section>
    </div>
  </Teleport>
</template>
```

### src/components/BaseTable.vue

```vue
<script setup>
import AppIcon from './AppIcon.vue'
defineProps({
  columns: Array,
  rows: Array,
  rowKey: { type: String, default: 'id' },
  clickable: Boolean,
  empty: { type: String, default: 'No records match your current filters.' },
})
defineEmits(['row-click'])
</script>
<template>
  <div class="table-scroll">
    <table v-if="rows.length">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key" scope="col">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in rows"
          :key="row[rowKey]"
          :class="{ clickable }"
          :tabindex="clickable ? 0 : undefined"
          @click="clickable && $emit('row-click', row)"
          @keydown.enter="clickable && $emit('row-click', row)"
        >
          <td v-for="column in columns" :key="column.key">
            <slot :name="column.key" :row="row">{{ row[column.key] ?? '—' }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else class="empty-state">
      <AppIcon name="leaf" />
      <h3>All clear here</h3>
      <p>{{ empty }}</p>
    </div>
  </div>
</template>
```

### src/components/BaseTabs.vue

```vue
<script setup>
defineProps({ modelValue: String, tabs: Array })
defineEmits(['update:modelValue'])
function move(event) {
  const buttons = [...event.currentTarget.parentElement.querySelectorAll('[role=tab]')]
  const index = buttons.indexOf(event.currentTarget)
  buttons[(index + (event.key === 'ArrowLeft' ? -1 : 1) + buttons.length) % buttons.length]?.click()
  buttons[(index + (event.key === 'ArrowLeft' ? -1 : 1) + buttons.length) % buttons.length]?.focus()
}
</script>
<template>
  <div class="tabs" role="tablist" aria-label="View filters">
    <button
      v-for="tab in tabs"
      :key="tab.label || tab"
      role="tab"
      :aria-selected="modelValue === (tab.label || tab)"
      :class="['tab', { active: modelValue === (tab.label || tab) }]"
      @keydown.right.prevent="move"
      @keydown.left.prevent="move"
      @click="$emit('update:modelValue', tab.label || tab)"
    >
      {{ tab.label || tab }}
      <span v-if="tab.count !== undefined" class="badge-count">{{ tab.count }}</span>
    </button>
  </div>
</template>
```

### src/components/BaseToast.vue

```vue
<script setup>
import { store } from '../utils/store'
import AppIcon from './AppIcon.vue'
</script>
<template>
  <Teleport to="body">
    <div class="toast-stack" aria-live="polite" aria-atomic="false">
      <div v-for="item in store.toasts" :key="item.id" :class="['toast', item.type]" role="status">
        <AppIcon :name="item.type === 'error' ? 'alert' : 'check'" />
        <span>{{ item.message }}</span>
        <button
          class="icon-btn"
          aria-label="Dismiss notification"
          @click="store.toasts = store.toasts.filter((t) => t.id !== item.id)"
        >
          <AppIcon name="close" />
        </button>
      </div>
    </div>
  </Teleport>
</template>
```

### src/components/ConfirmLeaveModal.vue

```vue
<script setup>
import LeaveFormModal from './LeaveFormModal.vue'
defineProps({ draft: Object })
</script>
<template><LeaveFormModal :draft="draft" confirm /></template>
```

### src/components/DepartureModal.vue

```vue
<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import { closeModal, employeeFor, recordDeparture } from '../utils/store'
import { localDateTime, today, formatDate } from '../utils/dateUtils'
const props = defineProps({ leave: Object })
const actual = ref(localDateTime()),
  error = ref('')
const employee = computed(() => employeeFor(props.leave.employeeId))
function submit() {
  if (!actual.value || actual.value > localDateTime()) {
    error.value = 'Enter a departure time that is not in the future.'
    return
  }
  recordDeparture(props.leave, actual.value)
}
</script>
<template>
  <BaseModal
    title="Record departure"
    :subtitle="`${employee.name} · ${employee.id}`"
    @close="closeModal"
  >
    <form id="departure-form" class="modal-form" @submit.prevent="submit">
      <div class="notice">
        <AppIcon name="movement" />
        Scheduled leave: {{ formatDate(leave.start) }} – {{ formatDate(leave.end) }}
      </div>
      <label class="field">
        <span>Actual departure</span>
        <input
          v-model="actual"
          class="input"
          type="datetime-local"
          :max="localDateTime()"
          required
        />
        <small>Prefilled with the current local date and time.</small>
      </label>
      <div v-if="actual.slice(0, 10) < today()" class="notice warning">
        <AppIcon name="clock" />
        This event will be tagged “Recorded late”.
      </div>
      <p class="small muted">The employee’s status and farm availability update immediately.</p>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
      <BaseButton form="departure-form" type="submit" icon="check">Mark as departed</BaseButton>
    </template>
  </BaseModal>
</template>
```

### src/components/EmployeeDetailModal.vue

```vue
<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import StatusBadge from './StatusBadge.vue'
import { store, farmName, closeModal, openModal } from '../utils/store'
import { formatDate, formatTime } from '../utils/dateUtils'
const props = defineProps({ employee: Object })
const leaves = computed(() => store.leaves.filter((l) => l.employeeId === props.employee.id))
const movements = computed(() => store.movements.filter((m) => m.employeeId === props.employee.id))
const history = computed(() =>
  store.history
    .filter((h) => h.employeeId === props.employee.id)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
)
</script>
<template>
  <BaseModal
    title="Employee profile"
    subtitle="Maintained by HR and Farm Admin · No employee login"
    wide
    @close="closeModal"
  >
    <div class="profile-header">
      <span class="avatar">
        {{
          employee.name
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
        }}
      </span>
      <div>
        <h2>{{ employee.name }}</h2>
        <p class="small muted">{{ employee.id }} · {{ employee.position }}</p>
      </div>
      <StatusBadge :status="employee.status" />
    </div>
    <dl class="profile-grid">
      <div>
        <dt>Farm</dt>
        <dd>{{ farmName(employee.farm) }}</dd>
      </div>
      <div>
        <dt>Department</dt>
        <dd>{{ employee.department }}</dd>
      </div>
      <div>
        <dt>Annual entitlement</dt>
        <dd>{{ employee.entitlement }} days</dd>
      </div>
      <div>
        <dt>Remaining annual balance</dt>
        <dd>{{ employee.remainingBalance }} days · {{ employee.usedDays }} used</dd>
      </div>
    </dl>
    <hr />
    <h3 class="mb-16">Leave records</h3>
    <div v-if="!leaves.length" class="small muted">No leave records yet.</div>
    <div v-for="leave in leaves" :key="leave.id" class="activity-row">
      <div>
        <p>{{ leave.type }} · {{ formatDate(leave.start) }} – {{ formatDate(leave.end) }}</p>
        <small>{{ leave.days }} working days</small>
      </div>
      <StatusBadge :status="leave.approval" />
      <button class="text-link" @click="openModal('history', { leave })">History</button>
    </div>
    <hr />
    <h3 class="mb-16">Movement history</h3>
    <div v-if="!movements.length" class="small muted">No movements recorded yet.</div>
    <div v-for="movement in movements" :key="movement.id" class="activity-row">
      <div>
        <p>Departed {{ formatTime(movement.departedAt) }}</p>
        <small>
          {{
            movement.returnedAt
              ? `Returned ${formatTime(movement.returnedAt)}`
              : 'Return not yet recorded'
          }}
        </small>
        <span v-if="movement.recordedLate" class="recorded-late">Recorded late</span>
      </div>
    </div>
    <hr />
    <h3 class="mb-16">Recent audit trail</h3>
    <div v-for="entry in history.slice(0, 5)" :key="entry.id" class="activity-row">
      <div>
        <p>{{ entry.action }}</p>
        <small>{{ entry.actor }} · {{ formatTime(entry.timestamp) }}</small>
        <p v-if="entry.oldValues?.end" class="tiny muted">
          Return: {{ formatDate(entry.oldValues.end) }} → {{ formatDate(entry.newValues?.end) }}
        </p>
      </div>
    </div>
    <template #footer>
      <BaseButton variant="secondary" icon="history" @click="openModal('history', { employee })">
        Full audit trail
      </BaseButton>
      <BaseButton @click="openModal('leave', { draft: { employeeId: employee.id } })">
        Plan leave
      </BaseButton>
    </template>
  </BaseModal>
</template>
```

### src/components/EmployeeTimeline.vue

```vue
<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'
import AppIcon from './AppIcon.vue'
import StatusBadge from './StatusBadge.vue'
import { store, openModal, movementFor } from '../utils/store'
import { addDays, dateRange, daysBetween, today, formatDate } from '../utils/dateUtils'
import { dailyHeadcount } from '../utils/leaveUtils'
import { STATUSES } from '../utils/constants'
const props = defineProps({ employees: Array, start: String, range: Number, farmId: Number })
const dates = computed(() => dateRange(props.start, addDays(props.start, props.range - 1)))
const dayWidth = computed(() => (props.range === 14 ? 65 : 42))
const gridStyle = computed(() => ({
  gridTemplateColumns: `210px repeat(${props.range}, ${dayWidth.value}px)`,
}))
const farm = computed(() => store.farms.find((f) => f.id === props.farmId))
const counts = computed(() => dates.value.map((d) => dailyHeadcount(store, props.farmId, d)))
const drag = ref(null)
const rowLeaves = computed(() =>
  Object.fromEntries(
    props.employees.map((e) => [
      e.id,
      store.leaves.filter(
        (l) =>
          l.employeeId === e.id &&
          l.approval !== 'Revision Requested' &&
          l.start <= dates.value[dates.value.length - 1] &&
          l.end >= props.start
      ),
    ])
  )
)
function barAt(employee, date) {
  return (rowLeaves.value[employee.id] || []).filter(
    (l) => (l.start < props.start ? props.start : l.start) === date
  )
}
function locked(leave) {
  return (
    !!movementFor(leave)?.departedAt ||
    leave.start < today() ||
    ['AWOL', 'Completed'].includes(leave.status)
  )
}
function barWidth(leave) {
  return (
    Math.max(
      1,
      daysBetween(
        leave.start < props.start ? props.start : leave.start,
        leave.end > dates.value[dates.value.length - 1]
          ? dates.value[dates.value.length - 1]
          : leave.end
      ) + 1
    ) *
      dayWidth.value -
    5
  )
}
function leaveStatus(leave) {
  return ['Pending', 'Endorsed'].includes(leave.approval)
    ? 'Pending'
    : movementFor(leave)?.returnedAt
    ? 'Completed'
    : leave.status
}
function tooltip(employee, leave) {
  return `${employee.name} · ${leave.type}\n${formatDate(leave.start)} – ${formatDate(
    leave.end
  )} · ${leaveStatus(leave)}\n${
    locked(leave)
      ? '🔒 Locked: departure or completion already recorded'
      : 'Drag to move · Dates and history are retained'
  }`
}
function begin(employee, date, event) {
  if (event.button !== 0) return
  drag.value = { employeeId: employee.id, anchor: date, current: date, leave: null }
}
function beginMove(employee, leave, date, event) {
  event.stopPropagation()
  if (event.button !== 0) return
  if (locked(leave)) {
    openModal('history', { leave })
    return
  }
  drag.value = { employeeId: employee.id, anchor: date, current: date, leave }
}
function enter(employee, date) {
  if (drag.value?.employeeId === employee.id) drag.value.current = date
}
function movePointer(event) {
  if (!drag.value) return
  const grid = document.querySelector('.timeline-grid')
  if (!grid) return
  const index = Math.max(
    0,
    Math.min(
      props.range - 1,
      Math.floor((event.clientX - grid.getBoundingClientRect().left - 210) / dayWidth.value)
    )
  )
  drag.value.current = dates.value[index]
}
function selected(employee, date) {
  const d = drag.value
  if (!d || d.employeeId !== employee.id) return false
  if (d.leave) {
    const offset = daysBetween(d.anchor, d.current)
    return date >= addDays(d.leave.start, offset) && date <= addDays(d.leave.end, offset)
  }
  return (
    date >= (d.anchor < d.current ? d.anchor : d.current) &&
    date <= (d.anchor > d.current ? d.anchor : d.current)
  )
}
function finish() {
  const d = drag.value
  if (!d) return
  drag.value = null
  if (d.leave) {
    const offset = daysBetween(d.anchor, d.current)
    if (!offset) return
    openModal('confirmLeave', {
      draft: {
        ...d.leave,
        start: addDays(d.leave.start, offset),
        end: addDays(d.leave.end, offset),
      },
    })
  } else
    openModal('confirmLeave', {
      draft: {
        employeeId: d.employeeId,
        start: d.anchor < d.current ? d.anchor : d.current,
        end: d.anchor > d.current ? d.anchor : d.current,
        type: 'Annual Leave',
      },
    })
}
function cancel(event) {
  if (event.key === 'Escape') drag.value = null
}
onMounted(() => {
  document.addEventListener('mouseup', finish)
  document.addEventListener('mousemove', movePointer)
  document.addEventListener('keydown', cancel)
})
onBeforeUnmount(() => {
  document.removeEventListener('mouseup', finish)
  document.removeEventListener('mousemove', movePointer)
  document.removeEventListener('keydown', cancel)
})
</script>
<template>
  <div>
    <div class="timeline-scroll">
      <div class="timeline-grid" :style="gridStyle">
        <div class="timeline-name heading">
          EMPLOYEE
          <span class="badge-count">{{ employees.length }}</span>
        </div>
        <div
          v-for="date in dates"
          :key="'header' + date"
          :class="['timeline-date', { current: date === today() }]"
        >
          <small>
            {{ formatDate(date, { weekday: 'short', day: undefined, month: undefined }) }}
          </small>
          {{ Number(date.slice(-2)) }}
        </div>
        <div class="timeline-name staffing-name">
          <AppIcon name="users" :size="12" />
          On site · min. {{ farm.minimum }}
        </div>
        <div
          v-for="(date, index) in dates"
          :key="'staff' + date"
          :class="['staffing-cell', { low: counts[index] < farm.minimum }]"
          :title="`${date}: ${counts[index]} on site, minimum ${farm.minimum}`"
        >
          {{ counts[index] }}
        </div>
        <template v-for="employee in employees" :key="employee.id">
          <button class="timeline-name" @click="openModal('employee', { employee })">
            <span class="avatar">
              {{
                employee.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
              }}
            </span>
            <span>
              <strong>{{ employee.name }}</strong>
              <small>{{ employee.department }}</small>
            </span>
          </button>
          <div
            v-for="(date, di) in dates"
            :key="employee.id + date"
            :class="[
              'timeline-cell',
              {
                weekend: [0, 6].includes(new Date(date + 'T12:00:00').getDay()),
                'today-cell': date === today(),
                'selected-cell': selected(employee, date),
              },
            ]"
            :data-employee="employee.id"
            :data-date="date"
            :tabindex="di === 0 ? 0 : undefined"
            :aria-label="`Plan leave for ${employee.name} on ${formatDate(date)}`"
            @mousedown.prevent="begin(employee, date, $event)"
            @mouseenter="enter(employee, date)"
            @keydown.enter="
              openModal('confirmLeave', {
                draft: { employeeId: employee.id, start: date, end: date },
              })
            "
          >
            <div
              v-for="leave in barAt(employee, date)"
              :key="leave.id"
              :title="tooltip(employee, leave)"
              :aria-label="tooltip(employee, leave)"
              :class="[
                'timeline-bar',
                'status-' + (STATUSES[leaveStatus(leave)] || 'scheduled'),
                { locked: locked(leave), extension: leave.status === 'Extended' },
              ]"
              :style="{ width: barWidth(leave) + 'px' }"
              @mousedown.prevent="beginMove(employee, leave, date, $event)"
            >
              <AppIcon v-if="locked(leave)" name="lock" />
              <span>{{ leave.type }} · {{ leaveStatus(leave) }}</span>
              <span
                v-if="leave.end <= dates[dates.length - 1]"
                class="return-marker"
                title="Expected return day"
              >
                ↩
              </span>
            </div>
          </div>
        </template>
      </div>
      <div v-if="!employees.length" class="empty-state">
        <AppIcon name="users" />
        <h3>No employees match</h3>
        <p>Try another name, department, or status.</p>
      </div>
    </div>
    <div class="timeline-legend">
      <StatusBadge
        v-for="status in [
          'Scheduled',
          'On Leave',
          'Returning Soon',
          'Overdue',
          'Extended',
          'Pending',
        ]"
        :key="status"
        :status="status"
      />
      <span class="flex">
        <AppIcon name="lock" :size="12" />
        Movement recorded · locked
      </span>
      <span>↩ Expected return</span>
    </div>
    <p class="timeline-help">
      Drag across an empty row to plan leave. Drag a future leave to move it. Click a locked leave
      to see its history. Keyboard: focus a row’s first date and press Enter to plan.
    </p>
  </div>
</template>
```

### src/components/ExtensionModal.vue

```vue
<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import {
  store,
  canApprove,
  closeModal,
  employeeFor,
  requestExtension,
  approveExtension,
} from '../utils/store'
import { addDays, formatDate } from '../utils/dateUtils'
import { leaveWarnings } from '../utils/leaveUtils'
const props = defineProps({ leave: Object })
const requestedEnd = ref(
    props.leave.extension?.status === 'Pending'
      ? props.leave.extension.requestedEnd
      : addDays(props.leave.end, 3)
  ),
  reason = ref(props.leave.extension?.reason || ''),
  error = ref('')
const pending = computed(() => props.leave.extension?.status === 'Pending')
const warnings = computed(() => leaveWarnings(store, { ...props.leave, end: requestedEnd.value }))
const blocked = computed(() =>
  warnings.value.some(
    (w) =>
      ['invalid', 'overlap'].includes(w.type) ||
      (w.type === 'staffing' && store.settings.staffingMode === 'block')
  )
)
function submit() {
  if (pending.value && canApprove.value) {
    approveExtension(props.leave)
    return
  }
  if (!requestedEnd.value || requestedEnd.value <= props.leave.end) {
    error.value = 'Choose a date after the current return date.'
    return
  }
  requestExtension(props.leave, requestedEnd.value, reason.value)
}
</script>
<template>
  <BaseModal
    :title="pending ? 'Review extension request' : 'Request an extension'"
    :subtitle="employeeFor(leave.employeeId).name"
    @close="closeModal"
  >
    <form id="extension-form" class="modal-form" @submit.prevent="submit">
      <div class="form-summary">
        <div>
          <span class="muted">Original return date</span>
          <strong>
            <s>{{ formatDate(leave.end) }}</s>
          </strong>
        </div>
        <div>
          <span class="muted">Requested return</span>
          <strong>{{ formatDate(requestedEnd) }}</strong>
        </div>
      </div>
      <label class="field">
        <span>New expected return date</span>
        <input
          v-model="requestedEnd"
          class="input"
          type="date"
          :min="addDays(leave.end, 1)"
          :disabled="pending"
          required
        />
      </label>
      <label class="field">
        <span>
          Reason
          <span class="muted">(optional)</span>
        </span>
        <textarea
          v-model="reason"
          rows="3"
          :disabled="pending"
          placeholder="Add any useful context"
        />
      </label>
      <div v-for="warning in warnings" :key="warning.type" class="notice warning">
        <AppIcon name="alert" />
        {{ warning.message }}
      </div>
      <p class="tiny muted">
        The expected return date changes only after approval. The original date remains in history.
      </p>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Close</BaseButton>
      <BaseButton
        v-if="!pending || canApprove"
        :disabled="pending && blocked"
        form="extension-form"
        type="submit"
        icon="check"
      >
        {{ pending ? 'Approve extension' : 'Request extension' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
```

### src/components/FarmSelector.vue

```vue
<script setup>
import { store, allowedFarms } from '../utils/store'
import AppIcon from './AppIcon.vue'
</script>
<template>
  <label class="farm-control">
    <AppIcon name="farm" />
    <span class="sr-only">Selected farm</span>
    <select v-model="store.selectedFarm" aria-label="Selected farm">
      <option v-if="store.role === 'HR'" value="all">All Farms</option>
      <option v-for="farm in allowedFarms" :key="farm.id" :value="farm.id">{{ farm.name }}</option>
    </select>
  </label>
</template>
```

### src/components/FilterBar.vue

```vue
<script setup>
import AppIcon from './AppIcon.vue'
defineProps({
  modelValue: String,
  placeholder: { type: String, default: 'Search by name or employee ID…' },
  count: Number,
})
defineEmits(['update:modelValue'])
</script>
<template>
  <div class="filter-bar">
    <label class="search-input">
      <span class="sr-only">{{ placeholder }}</span>
      <AppIcon name="search" />
      <input
        class="input"
        type="search"
        :value="modelValue"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
      />
    </label>
    <slot />
    <span v-if="count !== undefined" class="filter-count">{{ count }} records</span>
  </div>
</template>
```

### src/components/FollowUpModal.vue

```vue
<script setup>
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import { closeModal, employeeFor, recordFollowUp } from '../utils/store'
import { today, addDays } from '../utils/dateUtils'
const props = defineProps({ leave: Object })
const reason = ref('Called, will return on'),
  note = ref(''),
  promisedDate = ref(addDays(today(), 1))
</script>
<template>
  <BaseModal
    title="Record a follow-up"
    :subtitle="employeeFor(leave.employeeId).name"
    @close="closeModal"
  >
    <form
      id="followup-form"
      class="modal-form"
      @submit.prevent="
        recordFollowUp(
          props.leave,
          reason,
          note,
          reason === 'Called, will return on' ? promisedDate : ''
        )
      "
    >
      <label class="field">
        <span>Contact outcome</span>
        <select v-model="reason">
          <option>Called, will return on</option>
          <option>No answer</option>
          <option>Family emergency</option>
          <option>Awaiting supporting documents</option>
        </select>
      </label>
      <label v-if="reason === 'Called, will return on'" class="field">
        <span>Promised return date</span>
        <input v-model="promisedDate" class="input" type="date" :min="today()" required />
      </label>
      <label class="field">
        <span>
          Note
          <span class="muted">(optional)</span>
        </span>
        <textarea v-model="note" rows="3" placeholder="Anything HR should know?" />
      </label>
      <p class="small muted">
        Your name, role, and the contact time are recorded automatically. A promised date does not
        extend approved leave.
      </p>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
      <BaseButton form="followup-form" type="submit" icon="check">Save follow-up</BaseButton>
    </template>
  </BaseModal>
</template>
```

### src/components/HistoryDrawer.vue

```vue
<script setup>
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import { store, closeModal, employeeFor } from '../utils/store'
import { formatTime } from '../utils/dateUtils'
const props = defineProps({ leave: Object, employee: Object })
const person = computed(() => props.employee || employeeFor(props.leave?.employeeId))
const entries = computed(() =>
  store.history
    .filter((h) =>
      props.leave ? h.leaveId === props.leave.id : h.employeeId === props.employee?.id
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
)
</script>
<template>
  <BaseModal
    title="Record history"
    :subtitle="`${person?.name || ''} · An automatic audit trail`"
    drawer
    @close="closeModal"
  >
    <div v-if="!entries.length" class="empty-state">
      <AppIcon name="history" />
      <p>No changes have been recorded yet.</p>
    </div>
    <article v-for="entry in entries" :key="entry.id" class="history-entry">
      <h4>{{ entry.action }}</h4>
      <p>{{ entry.actor }}</p>
      <p>{{ formatTime(entry.timestamp) }}</p>
      <span v-if="entry.recordedLate" class="recorded-late">Recorded late</span>
      <div v-if="entry.oldValues || entry.newValues" class="history-values">
        <div v-if="entry.oldValues">
          <span class="muted">Before</span>
          <code>{{ JSON.stringify(entry.oldValues, null, 1) }}</code>
        </div>
        <div v-if="entry.newValues">
          <span class="muted">After</span>
          <code>{{ JSON.stringify(entry.newValues, null, 1) }}</code>
        </div>
      </div>
    </article>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Close history</BaseButton>
    </template>
  </BaseModal>
</template>
```

### src/components/LeaveFormModal.vue

```vue
<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import {
  store,
  visibleEmployees,
  employeeFor,
  farmName,
  closeModal,
  saveLeave,
  canApprove,
} from '../utils/store'
import { LEAVE_TYPES } from '../utils/constants'
import { today, addDays, workingDays, daysBetween, formatDate } from '../utils/dateUtils'
import { leaveWarnings } from '../utils/leaveUtils'
const props = defineProps({ draft: { type: Object, default: () => ({}) }, confirm: Boolean })
const search = ref(''),
  attempted = ref(false)
const form = ref({
  employeeId:
    props.draft.employeeId ||
    visibleEmployees.value.find((e) => e.status === 'On Site')?.id ||
    visibleEmployees.value[0]?.id ||
    '',
  type: props.draft.type || 'Annual Leave',
  start: props.draft.start || addDays(today(), 2),
  end: props.draft.end || addDays(today(), 5),
  ...(props.draft.id ? { id: props.draft.id } : {}),
})
const employees = computed(() =>
  visibleEmployees.value.filter((e) =>
    `${e.name} ${e.id}`.toLowerCase().includes(search.value.toLowerCase())
  )
)
const employee = computed(() => employeeFor(form.value.employeeId))
const days = computed(() => workingDays(form.value.start, form.value.end))
const balance = computed(
  () =>
    (employee.value?.remainingBalance || 0) -
    (form.value.type === 'Annual Leave' ? days.value : 0) +
    (store.leaves.find(
      (l) => l.id === form.value.id && l.approval === 'Approved' && l.type === 'Annual Leave'
    )?.days || 0)
)
const warnings = computed(() => leaveWarnings(store, form.value))
const invalid = computed(
  () =>
    !employee.value ||
    !form.value.start ||
    !form.value.end ||
    form.value.end < form.value.start ||
    daysBetween(form.value.start, form.value.end) > 366 ||
    warnings.value.some(
      (w) =>
        ['invalid', 'overlap'].includes(w.type) ||
        (w.type === 'staffing' && store.settings.staffingMode === 'block')
    )
)
function save() {
  attempted.value = true
  if (!invalid.value) saveLeave(form.value)
}
</script>
<template>
  <BaseModal
    :title="
      confirm ? (form.id ? 'Move scheduled leave' : 'Confirm leave dates') : 'Plan a new leave'
    "
    :subtitle="
      confirm
        ? 'Review the dates and automatic checks before saving.'
        : 'A few details now. The rest stays in sync automatically.'
    "
    @close="closeModal"
  >
    <form id="leave-form" class="modal-form" @submit.prevent="save">
      <template v-if="!confirm">
        <label class="field">
          <span>Find employee</span>
          <input
            v-model="search"
            class="input"
            type="search"
            placeholder="Search name or employee ID"
          />
        </label>
        <label class="field">
          <span>Employee</span>
          <select v-model="form.employeeId" required>
            <option v-if="!employees.length" disabled value="">No matching employees</option>
            <option v-for="person in employees" :key="person.id" :value="person.id">
              {{ person.name }} · {{ person.id }}
            </option>
          </select>
        </label>
      </template>
      <div v-else class="person">
        <span class="avatar">
          {{
            employee?.name
              .split(' ')
              .map((n) => n[0])
              .slice(0, 2)
              .join('')
          }}
        </span>
        <div>
          <strong>{{ employee?.name }}</strong>
          <small>{{ employee?.id }} · {{ employee?.department }}</small>
        </div>
      </div>
      <div class="notice">
        <AppIcon name="farm" />
        <span>{{ farmName(employee?.farm) }} · Automatically assigned from employee record</span>
      </div>
      <label class="field">
        <span>Leave type</span>
        <select v-model="form.type">
          <option v-for="type in LEAVE_TYPES" :key="type">{{ type }}</option>
        </select>
      </label>
      <div class="two-column">
        <label class="field">
          <span>First day of leave</span>
          <input v-model="form.start" class="input" type="date" required />
        </label>
        <label class="field">
          <span>Expected return date</span>
          <input v-model="form.end" class="input" type="date" :min="form.start" required />
        </label>
      </div>
      <div class="form-summary">
        <div>
          <span class="muted">Working days</span>
          <strong>{{ days }}</strong>
        </div>
        <div>
          <span class="muted">Current balance</span>
          <strong>
            {{ employee?.remainingBalance || 0 }}
            <small>days</small>
          </strong>
        </div>
        <div>
          <span class="muted">Balance after leave</span>
          <strong>
            {{ balance }}
            <small>days</small>
          </strong>
        </div>
      </div>
      <p class="tiny muted">
        {{ formatDate(form.start) }} – {{ formatDate(form.end) }} · Sundays and configured holidays
        excluded. Expected return is included in leave-day calculations.
      </p>
      <div v-for="warning in warnings" :key="warning.type" class="notice warning">
        <AppIcon name="alert" />
        {{ warning.message }}
      </div>
      <div v-if="!warnings.length" class="notice">
        <AppIcon name="check" />
        Balance, dates, and farm staffing checks look good.
      </div>
      <p class="tiny muted">
        {{
          canApprove
            ? 'This leave will be approved when saved.'
            : 'This leave will be sent to HR for approval.'
        }}
        Every change is recorded in history.
      </p>
      <p v-if="invalid && attempted" role="alert" class="form-error">
        Choose valid dates within one year and resolve any blocking warnings.
      </p>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
      <BaseButton form="leave-form" type="submit" icon="check">
        {{ form.id ? 'Save changes' : 'Save leave' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
```

### src/components/NeedsAttentionPanel.vue

```vue
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue'
import {
  store,
  visibleLeaves,
  visibleEmployees,
  allowedFarms,
  employeeFor,
  openModal,
  movementFor,
  farmName,
} from '../utils/store'
import { today, formatDate, daysBetween } from '../utils/dateUtils'
import { isOnSite } from '../utils/leaveUtils'
const router = useRouter()
const groups = computed(() => {
  const leaves = visibleLeaves.value
  const make = (leave, detail, action, modal) => ({
    id: leave.id,
    name: employeeFor(leave.employeeId).name,
    detail: `${farmName(employeeFor(leave.employeeId).farm)} · ${detail}`,
    action,
    run: () => openModal(modal, { leave }),
  })
  return [
    {
      title: 'Overdue returns',
      icon: 'alert',
      danger: true,
      rows: leaves
        .filter(
          (l) =>
            employeeFor(l.employeeId).status === 'Overdue' &&
            movementFor(l) &&
            !movementFor(l).returnedAt
        )
        .map((l) =>
          make(l, `${daysBetween(l.end, today())} days overdue`, 'Follow up', 'followup')
        ),
    },
    {
      title: 'Departures today',
      icon: 'movement',
      rows: leaves
        .filter(
          (l) => l.approval === 'Approved' && l.start === today() && !movementFor(l)?.departedAt
        )
        .map((l) => make(l, 'Scheduled to leave today', 'Mark departed', 'departure')),
    },
    {
      title: 'Returning in the next 3 days',
      icon: 'calendar',
      rows: leaves
        .filter(
          (l) =>
            employeeFor(l.employeeId).status === 'Returning Soon' &&
            movementFor(l) &&
            !movementFor(l).returnedAt
        )
        .map((l) => make(l, `Expected ${formatDate(l.end)}`, 'Mark returned', 'return')),
    },
    {
      title: 'Pending approvals',
      icon: 'clock',
      rows: leaves
        .filter((l) => ['Pending', 'Endorsed'].includes(l.approval))
        .map((l) => make(l, `${l.type} · ${l.days} days`, 'Review', 'review')),
    },
    {
      title: 'Extension requests',
      icon: 'history',
      rows: leaves
        .filter((l) => l.extension?.status === 'Pending')
        .map((l) =>
          make(
            l,
            `Requesting return ${formatDate(l.extension.requestedEnd)}`,
            'Review',
            'extension'
          )
        ),
    },
    {
      title: 'Staffing warnings',
      icon: 'users',
      rows: allowedFarms.value
        .filter((f) => store.selectedFarm === 'all' || f.id === Number(store.selectedFarm))
        .filter(
          (f) =>
            visibleEmployees.value.filter((e) => e.farm === f.id && isOnSite(e)).length < f.minimum
        )
        .map((f) => ({
          id: `farm${f.id}`,
          name: f.name,
          detail: `Below minimum staffing of ${f.minimum}`,
          action: 'View staffing',
          run: () => {
            store.selectedFarm = f.id
            router.push('/staffing')
          },
        })),
    },
  ].filter((g) => g.rows.length)
})
const count = computed(() => groups.value.reduce((n, g) => n + g.rows.length, 0))
</script>
<template>
  <section class="card">
    <div class="card-header">
      <div>
        <h2 class="flex">
          Needs attention
          <span class="badge-count">{{ count }}</span>
        </h2>
        <p>A few things to keep your farms moving.</p>
      </div>
      <AppIcon name="bell" />
    </div>
    <div class="attention-groups">
      <div v-if="!count" class="empty-state">
        <AppIcon name="check" />
        <h3>You’re all caught up</h3>
        <p>No items need attention for this farm.</p>
      </div>
      <div v-for="group in groups" :key="group.title" class="attention-group">
        <div :class="['attention-label', { danger: group.danger }]">
          <AppIcon :name="group.icon" />
          {{ group.title }}
          <span class="badge-count">{{ group.rows.length }}</span>
        </div>
        <div v-for="row in group.rows.slice(0, 2)" :key="row.id" class="attention-row">
          <span class="avatar" :class="group.danger ? 'sand' : 'blue'">
            {{
              row.name
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')
            }}
          </span>
          <div class="attention-main">
            <strong>{{ row.name }}</strong>
            <small>{{ row.detail }}</small>
          </div>
          <button class="text-link" @click="row.run">
            {{ row.action }}
            <AppIcon name="chevron" />
          </button>
        </div>
        <RouterLink
          v-if="group.rows.length > 2"
          class="text-link tiny"
          :to="
            group.title === 'Pending approvals' || group.title === 'Extension requests'
              ? '/leave'
              : '/movement'
          "
        >
          View all {{ group.rows.length }}
          <AppIcon name="arrow" />
        </RouterLink>
      </div>
    </div>
    <div class="card-footer">
      <span>Updated automatically as you work</span>
      <RouterLink to="/movement" class="text-link">
        View movements
        <AppIcon name="arrow" />
      </RouterLink>
    </div>
  </section>
</template>
```

### src/components/ReturnModal.vue

```vue
<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import { closeModal, employeeFor, recordReturn, openModal, movementFor } from '../utils/store'
import { localDateTime, formatDate, today } from '../utils/dateUtils'
const props = defineProps({ leave: Object })
const actual = ref(localDateTime()),
  outcome = ref(localDateTime().slice(0, 10) > props.leave.end ? 'late' : 'returned'),
  error = ref('')
const employee = computed(() => employeeFor(props.leave.employeeId))
const returnLabel = computed(() =>
  actual.value.slice(0, 10) > props.leave.end ? 'Returned late' : 'Returned on time'
)
watch(actual, () => {
  if (['returned', 'late'].includes(outcome.value))
    outcome.value = actual.value.slice(0, 10) > props.leave.end ? 'late' : 'returned'
})
function submit() {
  if (outcome.value === 'extend') return openModal('extension', { leave: props.leave })
  if (outcome.value === 'missing') return openModal('followup', { leave: props.leave })
  if (
    !actual.value ||
    actual.value > localDateTime() ||
    actual.value < movementFor(props.leave)?.departedAt
  ) {
    error.value = 'Return time must be after departure and no later than now.'
    return
  }
  recordReturn(props.leave, actual.value)
}
</script>
<template>
  <BaseModal
    title="Record a return"
    :subtitle="`${employee.name} · Expected ${formatDate(leave.end)}`"
    @close="closeModal"
  >
    <form id="return-form" class="modal-form" @submit.prevent="submit">
      <label class="field">
        <span>Outcome</span>
        <select v-model="outcome">
          <option value="returned">Returned on time</option>
          <option value="late">Returned late</option>
          <option value="extend">Extend leave</option>
          <option value="missing">Still not returned</option>
        </select>
      </label>
      <template v-if="['returned', 'late'].includes(outcome)">
        <label class="field">
          <span>Actual return</span>
          <input
            v-model="actual"
            class="input"
            type="datetime-local"
            :max="localDateTime()"
            required
          />
        </label>
        <div class="notice" :class="{ warning: returnLabel === 'Returned late' }">
          <AppIcon name="info" />
          {{ returnLabel }} · Outcome is calculated from the actual return time.
        </div>
        <p v-if="actual.slice(0, 10) < today()" class="tiny muted">
          This event will be tagged “Recorded late”.
        </p>
      </template>
      <p v-else class="small muted">
        {{
          outcome === 'extend'
            ? 'Continue to request an extension. The current return date stays in place until approval.'
            : 'Continue to record a follow-up. The employee remains off site.'
        }}
      </p>
      <p v-if="error" class="form-error" role="alert">{{ error }}</p>
    </form>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
      <BaseButton form="return-form" type="submit" icon="check">
        {{ ['returned', 'late'].includes(outcome) ? 'Mark as returned' : 'Continue' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
```

### src/components/ReviewLeaveModal.vue

```vue
<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import AppIcon from './AppIcon.vue'
import {
  store,
  canApprove,
  closeModal,
  approveLeave,
  reviseLeave,
  employeeFor,
  farmName,
} from '../utils/store'
import { leaveWarnings } from '../utils/leaveUtils'
import { formatDate } from '../utils/dateUtils'
const props = defineProps({ leave: Object })
const note = ref(''),
  revising = ref(false)
const warnings = computed(() => leaveWarnings(store, props.leave))
const blocked = computed(() =>
  warnings.value.some(
    (w) =>
      ['invalid', 'overlap'].includes(w.type) ||
      (w.type === 'staffing' && store.settings.staffingMode === 'block')
  )
)
function approve() {
  if (!blocked.value) {
    approveLeave(props.leave)
    closeModal()
  }
}
</script>
<template>
  <BaseModal
    title="Review leave request"
    :subtitle="`${employeeFor(leave.employeeId).name} · ${farmName(
      employeeFor(leave.employeeId).farm
    )}`"
    @close="closeModal"
  >
    <div class="modal-form">
      <div class="form-summary">
        <div>
          <span class="muted">{{ leave.type }}</span>
          <strong>
            {{ leave.days }}
            <small>working days</small>
          </strong>
        </div>
        <div>
          <span class="muted">Dates</span>
          <p class="mt-16">{{ formatDate(leave.start) }} – {{ formatDate(leave.end) }}</p>
        </div>
      </div>
      <div v-for="warning in warnings" :key="warning.type" class="notice warning">
        <AppIcon name="alert" />
        {{ warning.message }}
      </div>
      <p v-if="!warnings.length" class="notice">
        <AppIcon name="check" />
        All automatic checks passed.
      </p>
      <label v-if="revising" class="field">
        <span>
          Revision note
          <span class="muted">(optional)</span>
        </span>
        <textarea v-model="note" rows="3" placeholder="What needs to change?" />
      </label>
    </div>
    <template #footer>
      <BaseButton variant="secondary" @click="closeModal">Cancel</BaseButton>
      <BaseButton
        v-if="canApprove"
        variant="ghost"
        @click="revising ? reviseLeave(leave, note) : (revising = true)"
      >
        {{ revising ? 'Send for revision' : 'Return for revision' }}
      </BaseButton>
      <BaseButton :disabled="blocked || (!canApprove && leave.endorsed)" @click="approve">
        {{ canApprove ? 'Approve leave' : leave.endorsed ? 'Endorsed' : 'Endorse to HR' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>
```

### src/components/RoleSwitcher.vue

```vue
<script setup>
import { store, setRole } from '../utils/store'
</script>
<template>
  <div class="flex">
    <span class="eyebrow role-label">Demo role</span>
    <label>
      <span class="sr-only">Demo role</span>
      <select :value="store.role" aria-label="Demo role" @change="setRole($event.target.value)">
        <option>HR</option>
        <option>Farm Admin</option>
      </select>
    </label>
  </div>
</template>
```

### src/components/StatCard.vue

```vue
<script setup>
import AppIcon from './AppIcon.vue'
defineProps({
  title: String,
  value: [String, Number],
  caption: String,
  icon: { type: String, default: 'users' },
  tone: String,
})
</script>
<template>
  <div :class="['stat-card', tone]">
    <div class="stat-top">
      <span class="stat-title">{{ title }}</span>
      <span class="stat-icon"><AppIcon :name="icon" /></span>
    </div>
    <div class="stat-value">{{ value }}</div>
    <div class="stat-caption">{{ caption }}</div>
  </div>
</template>
```

### src/components/StatusBadge.vue

```vue
<script setup>
import { STATUSES } from '../utils/constants'
defineProps({ status: String })
</script>
<template>
  <span :class="['status-badge', 'status-' + (STATUSES[status] || 'pending')]">
    <span class="status-dot" />
    {{ status }}
  </span>
</template>
```

## Folder: src/

### src/main.js

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/variables.css'
import './assets/css/base.css'
import './assets/css/layout.css'
import './assets/css/components.css'

createApp(App).use(router).mount('#app')
```

## Folder: src/router/

### src/router/index.js

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'
export const pages = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { title: 'Dashboard', icon: 'dashboard' },
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('../views/CalendarView.vue'),
    meta: { title: 'Calendar', icon: 'calendar' },
  },
  {
    path: '/employees',
    name: 'employees',
    component: () => import('../views/EmployeesView.vue'),
    meta: { title: 'Employees', icon: 'users' },
  },
  {
    path: '/leave',
    name: 'leave',
    component: () => import('../views/LeaveView.vue'),
    meta: { title: 'Leave', icon: 'leaf' },
  },
  {
    path: '/movement',
    name: 'movement',
    component: () => import('../views/MovementView.vue'),
    meta: { title: 'Movement', icon: 'movement' },
  },
  {
    path: '/staffing',
    name: 'staffing',
    component: () => import('../views/StaffingView.vue'),
    meta: { title: 'Staffing', icon: 'chart' },
  },
  {
    path: '/reports',
    name: 'reports',
    component: () => import('../views/ReportsView.vue'),
    meta: { title: 'Reports', icon: 'report' },
  },
]
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    ...pages,
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
router.afterEach((to) => {
  document.title = `${to.meta.title} · Farm HR`
})
export default router
```

## Folder: src/utils/

### src/utils/constants.js

```javascript
export const OVERDUE_AFTER_DAYS = 1
export const RETURNING_SOON_DAYS = 3
export const ANNUAL_LEAVE_DAYS = 15
export const APPROVAL_MODE = 'hr_approves'
export const STAFFING_MODE = 'warning'
export const EXCLUDED_WEEKDAYS = [0]
export const HOLIDAYS = ['2026-11-01', '2026-12-25', '2027-01-01']
export const FARM_COUNTS = [62, 58, 55, 60, 52, 57, 50, 57]
export const ASSIGNED_FARMS = [2, 3]
export const DEPARTMENTS = ['Field Operations', 'Livestock', 'Packing', 'Maintenance', 'Admin']
export const LEAVE_TYPES = ['Annual Leave', 'Sick Leave', 'Emergency Leave', 'Other/Unpaid']
export const ROLE_PERMISSIONS = {
  HR: { approve: true, setAwol: true },
  'Farm Admin': { approve: false, setAwol: false },
}
export const STATUSES = {
  'On Site': 'onsite',
  Scheduled: 'scheduled',
  'On Leave': 'leave',
  'Returning Soon': 'returning',
  Overdue: 'overdue',
  Extended: 'extended',
  'Returned Late': 'late',
  AWOL: 'awol',
  Pending: 'pending',
  Approved: 'onsite',
  Endorsed: 'scheduled',
  'Revision Requested': 'pending',
  Completed: 'onsite',
}
export const ABSENT_STATUSES = ['On Leave', 'Returning Soon', 'Overdue', 'Extended', 'AWOL']
```

### src/utils/dateUtils.js

```javascript
import { EXCLUDED_WEEKDAYS, HOLIDAYS } from './constants'
export function dateKey(value = new Date()) {
  const d =
    typeof value === 'string' ? new Date(value.length === 10 ? value + 'T12:00:00' : value) : value
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`
}
export const today = () => dateKey()
export function addDays(value, days) {
  const d = new Date(dateKey(value) + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return dateKey(d)
}
export function daysBetween(a, b) {
  return Math.round(
    (new Date(dateKey(b) + 'T12:00:00') - new Date(dateKey(a) + 'T12:00:00')) / 86400000
  )
}
export function dateRange(start, end) {
  const list = []
  for (let d = dateKey(start); d <= dateKey(end); d = addDays(d, 1)) list.push(d)
  return list
}
export function workingDays(start, end) {
  if (!start || !end || end < start) return 0
  return dateRange(start, end).filter(
    (d) => !EXCLUDED_WEEKDAYS.includes(new Date(d + 'T12:00:00').getDay()) && !HOLIDAYS.includes(d)
  ).length
}
export function formatDate(value, options = {}) {
  return value
    ? new Date(value.length === 10 ? value + 'T12:00:00' : value).toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        ...options,
      })
    : '—'
}
export function formatTime(value) {
  return new Date(value).toLocaleString('en-PH', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
export const overlaps = (a, b, c, d) => a <= d && c <= b
export const localDateTime = () => {
  const d = new Date()
  return `${dateKey(d)}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(
    2,
    '0'
  )}`
}
```

### src/utils/exportUtils.js

```javascript
import { toast } from './store'
export function exportCsv(rows, filename = 'farm-hr-report.csv') {
  if (!rows.length) {
    toast('No rows match these filters.', 'error')
    return
  }
  const escape = (value) => {
    let text = String(value ?? '')
    if (/^[=+@\-\t\r]/.test(text)) text = "'" + text
    return '"' + text.replace(/"/g, '""') + '"'
  }
  const columns = Object.keys(rows[0])
  const csv =
    '\uFEFF' +
    [
      columns.map(escape).join(','),
      ...rows.map((row) => columns.map((c) => escape(row[c])).join(',')),
    ].join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 500)
  toast('CSV report downloaded')
}
export const simulateExport = () => toast('Prototype: export simulated')
```

### src/utils/leaveUtils.js

```javascript
import { ABSENT_STATUSES, RETURNING_SOON_DAYS, OVERDUE_AFTER_DAYS } from './constants'
import { today, daysBetween, overlaps, workingDays, dateRange } from './dateUtils'
export const isOnSite = (e) => !ABSENT_STATUSES.includes(e.status)
export function deriveStatus(leave, movement) {
  if (movement?.returnedAt)
    return movement.returnedAt.slice(0, 10) > leave.end ? 'Returned Late' : 'On Site'
  if (movement?.status === 'AWOL') return 'AWOL'
  if (movement?.departedAt) {
    if (daysBetween(leave.end, today()) >= OVERDUE_AFTER_DAYS) return 'Overdue'
    if (leave.status === 'Extended') return 'Extended'
    if (daysBetween(today(), leave.end) <= RETURNING_SOON_DAYS) return 'Returning Soon'
    return 'On Leave'
  }
  return leave.approval === 'Approved' ? 'Scheduled' : 'On Site'
}
export function dailyHeadcount(data, farmId, date, proposed = null) {
  const employees = data.employees.filter((e) => e.farm === Number(farmId))
  return employees.filter((e) => {
    if (proposed?.employeeId === e.id && date >= proposed.start && date <= proposed.end)
      return false
    if (e.status === 'AWOL') return false
    return !data.leaves.some((l) => {
      if (l.employeeId !== e.id || l.id === proposed?.id || l.approval !== 'Approved') return false
      const movement = data.movements.find((m) => m.leaveId === l.id)
      if (movement?.departedAt) {
        if (date < movement.departedAt.slice(0, 10)) return false
        if (movement.returnedAt) return date < movement.returnedAt.slice(0, 10)
        if (l.end < today()) return true
        return date <= l.end
      }
      if (date <= today()) return false
      return overlaps(l.start, l.end, date, date)
    })
  }).length
}
export function leaveWarnings(data, draft) {
  const employee = data.employees.find((e) => e.id === draft.employeeId)
  if (!employee || !draft.start || !draft.end) return []
  const warnings = []
  if (draft.end < draft.start)
    return [{ type: 'invalid', message: 'End date must be on or after the start date.' }]
  const existing = data.leaves.find((l) => l.id === draft.id)
  const available =
    employee.remainingBalance +
    (existing?.approval === 'Approved' && existing.type === 'Annual Leave' ? existing.days : 0)
  if (draft.type === 'Annual Leave' && workingDays(draft.start, draft.end) > available)
    warnings.push({
      type: 'balance',
      message: 'This leave exceeds the available annual leave balance.',
    })
  if (
    data.leaves.some(
      (l) =>
        l.id !== draft.id &&
        l.employeeId === employee.id &&
        !['Revision Requested'].includes(l.approval) &&
        overlaps(l.start, l.end, draft.start, draft.end)
    )
  )
    warnings.push({
      type: 'overlap',
      message: 'These dates overlap an existing leave for this employee.',
    })
  const farm = data.farms.find((f) => f.id === employee.farm)
  if (
    dateRange(draft.start, draft.end).some(
      (d) => dailyHeadcount(data, farm.id, d, draft) < farm.minimum
    )
  )
    warnings.push({
      type: 'staffing',
      message: `${farm.name} would fall below its minimum of ${farm.minimum} on-site employees.`,
    })
  return warnings
}
```

### src/utils/mockData.js

```javascript
import { FARM_COUNTS, ANNUAL_LEAVE_DAYS, DEPARTMENTS } from './constants'
import { today, addDays, workingDays } from './dateUtils'

export function generateMockData() {
  let seed = 1729
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  const first = [
    'Maria',
    'Jose',
    'Ana',
    'Rafael',
    'Isabel',
    'Miguel',
    'Camille',
    'Paolo',
    'Sofia',
    'Gabriel',
    'Andrea',
    'Luis',
    'Patricia',
    'Carlo',
    'Jasmine',
    'Marco',
    'Elena',
    'Daniel',
    'Bianca',
    'Ramon',
    'Teresa',
    'Angelo',
    'Nina',
    'Emilio',
    'Liza',
    'Francis',
    'Joy',
    'Alvin',
    'Grace',
    'Noel',
  ]
  const last = [
    'Santos',
    'Reyes',
    'Cruz',
    'Garcia',
    'Mendoza',
    'Ramos',
    'Bautista',
    'Aquino',
    'Navarro',
    'Villanueva',
    'Castillo',
    'Fernandez',
    'Soriano',
    'Flores',
    'Dela Cruz',
    'Mercado',
    'Torres',
    'Rivera',
    'Gonzales',
    'Salazar',
    'Valdez',
    'Pascual',
    'Domingo',
    'Santiago',
    'Aguilar',
    'Tolentino',
    'De Leon',
    'Francisco',
    'Lim',
    'Manalo',
  ]
  const regions = [
    'San Pablo, Laguna',
    'Lipa, Batangas',
    'Tiaong, Quezon',
    'Tanauan, Batangas',
    'Los Baños, Laguna',
    'Lucban, Quezon',
    'Calamba, Laguna',
    'San Jose, Batangas',
  ]
  const farms = FARM_COUNTS.map((count, i) => ({
    id: i + 1,
    name: `Farm ${i + 1}`,
    location: regions[i],
    minimum: Math.ceil(count * 0.8),
  }))
  const employees = [],
    leaves = [],
    movements = [],
    history = []
  const absenceCounts = [6, 19, 5, 15, 5, 5, 4, 4]
  const absenceStatuses = [
    ...Array(43).fill('On Leave'),
    ...Array(12).fill('Returning Soon'),
    ...Array(5).fill('Overdue'),
    ...Array(2).fill('Extended'),
    'AWOL',
  ]
  // Seeded shuffle keeps every headline count exact while distributing statuses.
  for (let i = absenceStatuses.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[absenceStatuses[i], absenceStatuses[j]] = [absenceStatuses[j], absenceStatuses[i]]
  }
  let globalId = 0,
    absenceIndex = 0,
    scheduled = 0,
    pending = 0,
    completed = 0
  farms.forEach((farm, fi) => {
    for (let i = 0; i < FARM_COUNTS[fi]; i++) {
      globalId++
      const dept = DEPARTMENTS[i % DEPARTMENTS.length]
      const employee = {
        id: `F${farm.id}-${String(globalId).padStart(4, '0')}`,
        name: `${first[(globalId - 1) % first.length]} ${
          last[Math.floor((globalId - 1) / first.length) % last.length]
        }`,
        farm: farm.id,
        department: dept,
        position: {
          'Field Operations': 'Field associate',
          Livestock: 'Livestock caretaker',
          Packing: 'Packing associate',
          Maintenance: 'Maintenance technician',
          Admin: 'Farm coordinator',
        }[dept],
        entitlement: ANNUAL_LEAVE_DAYS,
        usedDays: Math.floor(random() * 7),
        remainingBalance: 0,
        status: 'On Site',
        currentMovement: null,
      }
      employee.remainingBalance = employee.entitlement - employee.usedDays
      let status,
        start,
        end,
        approval = 'Approved',
        movement = null
      if (i < absenceCounts[fi]) {
        status = absenceStatuses[absenceIndex++]
        start = addDays(
          today(),
          status === 'Overdue' || status === 'AWOL'
            ? -9 - Math.floor(random() * 3)
            : -2 - Math.floor(random() * 3)
        )
        end =
          status === 'Returning Soon'
            ? addDays(today(), 1 + Math.floor(random() * 3))
            : status === 'Overdue' || status === 'AWOL'
            ? addDays(today(), -2 - Math.floor(random() * 4))
            : addDays(today(), 5 + Math.floor(random() * 7))
        movement = {
          id: `M${globalId}`,
          employeeId: employee.id,
          departedAt: start + 'T07:30',
          returnedAt: null,
          status,
          lastFollowUp: status === 'Overdue' ? addDays(today(), -1) + 'T14:00' : null,
          followUpNote: 'Called; awaiting an update.',
          recordedLate: i === 0 && fi === 0,
        }
      } else if (i < absenceCounts[fi] + 3 && scheduled < 18) {
        status = 'Scheduled'
        start = addDays(today(), scheduled % 6)
        end = addDays(start, 4)
        scheduled++
      } else if (i === absenceCounts[fi] + 4 && pending < 4) {
        status = 'Pending'
        approval = 'Pending'
        start = addDays(today(), 8)
        end = addDays(start, 3)
        pending++
      } else if (i === absenceCounts[fi] + 5 && completed < 2) {
        status = 'Returned Late'
        start = addDays(today(), -20)
        end = addDays(today(), -15)
        completed++
        movement = {
          id: `M${globalId}`,
          employeeId: employee.id,
          departedAt: start + 'T08:00',
          returnedAt: addDays(end, 2) + 'T09:00',
          status,
          recordedLate: true,
        }
      }
      if (status) {
        const type =
          globalId % 11 === 0
            ? 'Sick Leave'
            : globalId % 13 === 0
            ? 'Emergency Leave'
            : globalId % 17 === 0
            ? 'Other/Unpaid'
            : 'Annual Leave'
        const leave = {
          id: `L${String(leaves.length + 1).padStart(4, '0')}`,
          employeeId: employee.id,
          type,
          start,
          end,
          originalEnd: end,
          approval,
          status,
          days: workingDays(start, end),
          extension: null,
          note: '',
          endorsed: false,
        }
        leaves.push(leave)
        if (approval === 'Approved' && type === 'Annual Leave') {
          employee.usedDays =
            Math.min(employee.usedDays, Math.max(0, ANNUAL_LEAVE_DAYS - leave.days)) + leave.days
          employee.remainingBalance = employee.entitlement - employee.usedDays
        }
        const createdOn = addDays(start, -3) < today() ? addDays(start, -3) : addDays(today(), -1)
        history.push({
          id: `H${history.length + 1}`,
          leaveId: leave.id,
          employeeId: employee.id,
          actor: 'Camille Reyes · HR',
          action: 'Leave created',
          timestamp: createdOn + 'T10:00',
          oldValues: null,
          newValues: { start, end, approval },
          recordedLate: false,
        })
        if (movement) {
          movement.leaveId = leave.id
          movements.push(movement)
          employee.currentMovement = movement.id
          history.push({
            id: `H${history.length + 1}`,
            leaveId: leave.id,
            employeeId: employee.id,
            actor: 'Rafael Cruz · Farm Admin',
            action: 'Departure recorded',
            timestamp: addDays(start, movement.recordedLate ? 2 : 0) + 'T08:15',
            oldValues: { status: 'Scheduled' },
            newValues: { status: 'On Leave', actualDeparture: movement.departedAt },
            recordedLate: movement.recordedLate,
          })
          if (movement.returnedAt)
            history.push({
              id: `H${history.length + 1}`,
              leaveId: leave.id,
              employeeId: employee.id,
              actor: 'Camille Reyes · HR',
              action: 'Return recorded',
              timestamp: addDays(movement.returnedAt, 2) + 'T10:30',
              oldValues: { status: 'On Leave' },
              newValues: { actualReturn: movement.returnedAt, status: 'Returned Late' },
              recordedLate: true,
            })
        }
        if (status === 'Extended') {
          leave.originalEnd = addDays(end, -4)
          history.push({
            id: `H${history.length + 1}`,
            leaveId: leave.id,
            employeeId: employee.id,
            actor: 'Camille Reyes · HR',
            action: 'Extension approved',
            timestamp: addDays(today(), -1) + 'T11:20',
            oldValues: { end: leave.originalEnd },
            newValues: { end },
            recordedLate: false,
          })
        }
        employee.status = ['Pending'].includes(status) ? 'On Site' : status
      }
      employees.push(employee)
    }
  })
  leaves
    .filter((l) => l.status === 'On Leave')
    .slice(0, 3)
    .forEach((l) => {
      l.extension = {
        originalEnd: l.end,
        requestedEnd: addDays(l.end, 3),
        status: 'Pending',
        reason: 'Additional time needed for a family commitment.',
      }
    })
  return { farms, employees, leaves, movements, history }
}
```

### src/utils/store.js

```javascript
import { reactive, computed } from 'vue'
import { generateMockData } from './mockData'
import { APPROVAL_MODE, STAFFING_MODE, ASSIGNED_FARMS } from './constants'
import { today, workingDays, daysBetween } from './dateUtils'
import { isOnSite, deriveStatus, leaveWarnings } from './leaveUtils'

export const store = reactive({
  ...generateMockData(),
  role: 'HR',
  selectedFarm: 'all',
  settings: { approvalMode: APPROVAL_MODE, staffingMode: STAFFING_MODE },
  modal: null,
  toasts: [],
})
export const allowedFarms = computed(() =>
  store.farms.filter((f) => store.role === 'HR' || ASSIGNED_FARMS.includes(f.id))
)
export const visibleEmployees = computed(() =>
  store.employees.filter(
    (e) =>
      allowedFarms.value.some((f) => f.id === e.farm) &&
      (store.selectedFarm === 'all' || e.farm === Number(store.selectedFarm))
  )
)
export const visibleLeaves = computed(() =>
  store.leaves.filter((l) => visibleEmployees.value.some((e) => e.id === l.employeeId))
)
export const canApprove = computed(
  () => store.role === 'HR' || store.settings.approvalMode === 'admin_approves'
)
export const currentUser = computed(() => (store.role === 'HR' ? 'Camille Reyes' : 'Rafael Cruz'))
export const stats = computed(() => ({
  employees: visibleEmployees.value.length,
  onsite: visibleEmployees.value.filter(isOnSite).length,
  leave: visibleEmployees.value.filter((e) => e.status === 'On Leave').length,
  returning: visibleEmployees.value.filter((e) => e.status === 'Returning Soon').length,
  overdue: visibleEmployees.value.filter((e) => e.status === 'Overdue').length,
  pending: visibleLeaves.value.filter((l) => ['Pending', 'Endorsed'].includes(l.approval)).length,
}))
export function setRole(role) {
  store.role = role
  if (!allowedFarms.value.some((f) => f.id === Number(store.selectedFarm)))
    store.selectedFarm = role === 'HR' ? 'all' : ASSIGNED_FARMS[0]
  toast(`Switched to ${role}`)
}
export const employeeFor = (id) => store.employees.find((e) => e.id === id)
export const movementFor = (leave) => store.movements.find((m) => m.leaveId === leave?.id)
export const farmName = (id) => store.farms.find((f) => f.id === Number(id))?.name || 'All farms'
export function toast(message, type = 'success') {
  const id = Date.now() + Math.random()
  store.toasts.push({ id, message, type })
  setTimeout(() => {
    store.toasts = store.toasts.filter((t) => t.id !== id)
  }, 4800)
}
export const openModal = (type, payload = {}) => {
  store.modal = { type, ...payload }
}
export const closeModal = () => {
  store.modal = null
}
export function audit(leave, action, oldValues, newValues, recordedLate = false) {
  store.history.unshift({
    id: `H${Date.now()}-${Math.random()}`,
    leaveId: leave?.id,
    employeeId: leave?.employeeId,
    actor: `${currentUser.value} · ${store.role}`,
    action,
    timestamp: new Date().toISOString(),
    oldValues,
    newValues,
    recordedLate,
  })
}
function authorized(leave) {
  return !!leave && visibleEmployees.value.some((e) => e.id === leave.employeeId)
}
function sync(leave) {
  const employee = employeeFor(leave.employeeId)
  const records = store.leaves.filter((l) => l.employeeId === employee.id)
  for (const record of records) {
    const movement = movementFor(record)
    if (movement?.returnedAt) record.status = 'Completed'
    else if (movement?.departedAt) {
      record.status = deriveStatus(record, movement)
      movement.status = record.status
    } else record.status = record.approval === 'Approved' ? 'Scheduled' : record.approval
  }
  const active = records.find((l) => movementFor(l)?.departedAt && !movementFor(l)?.returnedAt)
  const scheduled = records.find(
    (l) => l.approval === 'Approved' && !movementFor(l)?.departedAt && l.end >= today()
  )
  const lastReturned = records
    .filter((l) => movementFor(l)?.returnedAt)
    .sort((a, b) => movementFor(b).returnedAt.localeCompare(movementFor(a).returnedAt))[0]
  const current = active || scheduled || lastReturned
  employee.status = current ? deriveStatus(current, movementFor(current)) : 'On Site'
  employee.currentMovement = current ? movementFor(current)?.id || null : null
}
function blocked(draft) {
  if (
    !draft.start ||
    !draft.end ||
    draft.end < draft.start ||
    daysBetween(draft.start, draft.end) > 366
  ) {
    toast('Choose valid leave dates within one year.', 'error')
    return true
  }
  const warning = leaveWarnings(store, draft).find(
    (w) =>
      ['invalid', 'overlap'].includes(w.type) ||
      (w.type === 'staffing' && store.settings.staffingMode === 'block')
  )
  if (warning) {
    toast(warning.message, 'error')
    return true
  }
  return false
}
function reserveBalance(leave, direction = -1) {
  if (leave.type === 'Annual Leave') {
    const e = employeeFor(leave.employeeId)
    e.usedDays -= direction * leave.days
    e.remainingBalance += direction * leave.days
  }
}
export function saveLeave(draft) {
  if (!visibleEmployees.value.some((e) => e.id === draft.employeeId)) return false
  const existing = store.leaves.find((l) => l.id === draft.id)
  if (existing) {
    if (movementFor(existing)?.departedAt || existing.start < today()) {
      toast('This leave is locked.', 'error')
      return false
    }
    if (blocked(draft)) return false
    const old = { start: existing.start, end: existing.end, type: existing.type }
    if (existing.approval === 'Approved') reserveBalance(existing, 1)
    Object.assign(existing, {
      start: draft.start,
      end: draft.end,
      type: draft.type || existing.type,
      days: workingDays(draft.start, draft.end),
    })
    if (existing.approval === 'Approved') reserveBalance(existing)
    audit(existing, 'Leave rescheduled', old, {
      start: existing.start,
      end: existing.end,
      type: existing.type,
    })
    sync(existing)
  } else {
    if (blocked(draft)) return false
    const approval = canApprove.value ? 'Approved' : 'Pending'
    const leave = {
      ...draft,
      id: `L${Date.now()}`,
      approval,
      status: approval === 'Approved' ? 'Scheduled' : 'Pending',
      originalEnd: draft.end,
      days: workingDays(draft.start, draft.end),
      extension: null,
      endorsed: false,
    }
    store.leaves.unshift(leave)
    if (approval === 'Approved') reserveBalance(leave)
    audit(leave, 'Leave created', null, { start: leave.start, end: leave.end, approval })
    sync(leave)
  }
  toast(`Leave saved for ${employeeFor(draft.employeeId).name}`)
  closeModal()
  return true
}
export function approveLeave(leave) {
  if (!authorized(leave) || !['Pending', 'Endorsed'].includes(leave.approval)) return
  if (blocked(leave)) return
  if (!canApprove.value) {
    leave.endorsed = true
    leave.approval = 'Endorsed'
    audit(leave, 'Leave endorsed', { approval: 'Pending' }, { approval: 'Endorsed' })
    toast('Leave endorsed for HR review')
    return
  }
  const old = leave.approval
  leave.approval = 'Approved'
  leave.status = 'Scheduled'
  reserveBalance(leave)
  audit(leave, 'Leave approved', { approval: old }, { approval: 'Approved' })
  sync(leave)
  toast(`Leave approved for ${employeeFor(leave.employeeId).name}`)
}
export function reviseLeave(leave, note) {
  if (!canApprove.value || !authorized(leave)) return
  const old = leave.approval
  leave.approval = 'Revision Requested'
  leave.note = note
  audit(leave, 'Returned for revision', { approval: old }, { approval: leave.approval, note })
  toast('Leave returned for revision')
  closeModal()
}
export function recordDeparture(leave, actual) {
  if (!authorized(leave) || leave.approval !== 'Approved' || movementFor(leave)?.departedAt) return
  const recordedLate = actual.slice(0, 10) < today()
  store.movements.push({
    id: `M${Date.now()}`,
    leaveId: leave.id,
    employeeId: leave.employeeId,
    departedAt: actual,
    returnedAt: null,
    status: 'On Leave',
    recordedLate,
  })
  audit(
    leave,
    'Departure recorded',
    { status: 'Scheduled' },
    { actualDeparture: actual },
    recordedLate
  )
  sync(leave)
  toast(`Departure recorded for ${employeeFor(leave.employeeId).name}`)
  closeModal()
}
export function recordReturn(leave, actual) {
  if (!authorized(leave)) return
  const movement = movementFor(leave)
  if (!movement) return
  const old = employeeFor(leave.employeeId).status
  movement.returnedAt = actual
  movement.recordedLate = movement.recordedLate || actual.slice(0, 10) < today()
  movement.status = actual.slice(0, 10) > leave.end ? 'Returned Late' : 'On Site'
  leave.status = 'Completed'
  audit(
    leave,
    'Return recorded',
    { status: old },
    { actualReturn: actual, status: movement.status },
    actual.slice(0, 10) < today()
  )
  sync(leave)
  toast(`Return recorded for ${employeeFor(leave.employeeId).name}`)
  closeModal()
}
export function requestExtension(leave, requestedEnd, reason) {
  if (!authorized(leave)) return
  leave.extension = { originalEnd: leave.end, requestedEnd, reason, status: 'Pending' }
  audit(leave, 'Extension requested', { end: leave.end }, { requestedEnd, reason })
  toast('Extension sent for approval. Current return date retained.')
  closeModal()
}
export function approveExtension(leave) {
  if (!canApprove.value || !authorized(leave) || leave.extension?.status !== 'Pending') return
  if (blocked({ ...leave, end: leave.extension.requestedEnd })) return
  const oldEnd = leave.end
  if (leave.approval === 'Approved') reserveBalance(leave, 1)
  leave.end = leave.extension.requestedEnd
  leave.days = workingDays(leave.start, leave.end)
  leave.extension.status = 'Approved'
  leave.status = 'Extended'
  if (leave.approval === 'Approved') reserveBalance(leave)
  const movement = movementFor(leave)
  if (movement) movement.status = 'Extended'
  audit(leave, 'Extension approved', { end: oldEnd }, { end: leave.end })
  sync(leave)
  toast('Extension approved; expected return updated')
  closeModal()
}
export function recordFollowUp(leave, reason, note, promisedDate) {
  if (!authorized(leave)) return
  const movement = movementFor(leave)
  if (!movement) return
  const old = movement.lastFollowUp
  movement.lastFollowUp = new Date().toISOString()
  movement.followUpNote = `${reason}${promisedDate ? ` · ${promisedDate}` : ''}${
    note ? ` · ${note}` : ''
  }`
  audit(leave, 'Follow-up recorded', { lastFollowUp: old }, { reason, note, promisedDate })
  toast(`Follow-up recorded for ${employeeFor(leave.employeeId).name}`)
  closeModal()
}
export function setAwol(leave) {
  if (store.role !== 'HR' || !authorized(leave)) return
  const old = employeeFor(leave.employeeId).status
  const m = movementFor(leave)
  if (!m) return
  m.status = 'AWOL'
  leave.status = 'AWOL'
  audit(leave, 'Final status set to AWOL', { status: old }, { status: 'AWOL' })
  sync(leave)
  toast('Final status updated to AWOL')
  closeModal()
}
export function resetDemo() {
  Object.assign(store, generateMockData())
  store.modal = null
  toast('Demo data reset')
}
```

## Folder: src/views/

### src/views/CalendarView.vue

```vue
<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import AppIcon from '../components/AppIcon.vue'
import EmployeeTimeline from '../components/EmployeeTimeline.vue'
import FilterBar from '../components/FilterBar.vue'
import { store, visibleEmployees, allowedFarms, farmName, openModal } from '../utils/store'
import { DEPARTMENTS } from '../utils/constants'
import { today, addDays, formatDate } from '../utils/dateUtils'
const start = ref(addDays(today(), -3)),
  range = ref(14),
  search = ref(''),
  department = ref(''),
  status = ref('')
const employees = computed(() =>
  visibleEmployees.value.filter(
    (e) =>
      `${e.name} ${e.id}`.toLowerCase().includes(search.value.toLowerCase()) &&
      (!department.value || e.department === department.value) &&
      (!status.value || e.status === status.value)
  )
)
function month(offset) {
  const d = new Date(start.value + 'T12:00:00')
  d.setDate(1)
  d.setMonth(d.getMonth() + offset)
  start.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Leave calendar</h1>
        <p>
          A little forward planning makes all the difference. Drag to plan, review, and move leave.
        </p>
      </div>
      <BaseButton icon="plus" @click="openModal('leave')">New leave</BaseButton>
    </header>
    <div v-if="store.selectedFarm === 'all'" class="card">
      <div class="empty-state">
        <AppIcon name="calendar" />
        <h3>Choose a farm to start planning</h3>
        <p>
          Each farm has its own employee timeline and daily staffing checks. Select one below or use
          the farm selector above.
        </p>
        <div class="flex" style="flex-wrap: wrap; justify-content: center">
          <BaseButton
            v-for="farm in allowedFarms"
            :key="farm.id"
            variant="secondary"
            icon="farm"
            @click="store.selectedFarm = farm.id"
          >
            {{ farm.name }}
          </BaseButton>
        </div>
      </div>
    </div>
    <div v-else class="card">
      <div class="timeline-toolbar">
        <div class="flex">
          <h2>{{ farmName(store.selectedFarm) }}</h2>
          <span class="muted">·</span>
          <span class="small">
            {{ formatDate(start, { year: 'numeric' }) }} –
            {{ formatDate(addDays(start, range - 1)) }}
          </span>
        </div>
        <div class="flex">
          <div class="segmented" aria-label="Calendar range">
            <button
              :class="{ active: range === 14 }"
              :aria-pressed="range === 14"
              @click="range = 14"
            >
              14 days
            </button>
            <button
              :class="{ active: range === 31 }"
              :aria-pressed="range === 31"
              @click="range = 31"
            >
              31 days
            </button>
          </div>
          <button class="icon-btn" aria-label="Previous month" @click="month(-1)">
            <AppIcon name="left" />
          </button>
          <BaseButton variant="secondary" small @click="start = addDays(today(), -3)">
            Today
          </BaseButton>
          <button class="icon-btn" aria-label="Next month" @click="month(1)">
            <AppIcon name="chevron" />
          </button>
        </div>
      </div>
      <FilterBar v-model="search" :count="employees.length">
        <select v-model="department" aria-label="Filter department">
          <option value="">All departments</option>
          <option v-for="d in DEPARTMENTS" :key="d">{{ d }}</option>
        </select>
        <select v-model="status" aria-label="Filter employee status">
          <option value="">All statuses</option>
          <option
            v-for="s in [
              'On Site',
              'Scheduled',
              'On Leave',
              'Returning Soon',
              'Overdue',
              'Extended',
              'AWOL',
            ]"
            :key="s"
          >
            {{ s }}
          </option>
        </select>
      </FilterBar>
      <EmployeeTimeline
        :key="store.selectedFarm"
        :employees="employees"
        :start="start"
        :range="range"
        :farm-id="Number(store.selectedFarm)"
      />
    </div>
    <div class="insight-strip">
      <AppIcon name="info" />
      <div>
        <strong>Smart checks, before you save.</strong>
        <p>
          Leave balances, overlapping dates, and minimum staffing are checked automatically.
          Departed or completed leave stays locked to protect the record.
        </p>
      </div>
    </div>
  </div>
</template>
```

### src/views/DashboardView.vue

```vue
<script setup>
import { computed } from 'vue'
import AppIcon from '../components/AppIcon.vue'
import BaseButton from '../components/BaseButton.vue'
import StatCard from '../components/StatCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import BaseTable from '../components/BaseTable.vue'
import NeedsAttentionPanel from '../components/NeedsAttentionPanel.vue'
import {
  store,
  stats,
  allowedFarms,
  visibleEmployees,
  visibleLeaves,
  employeeFor,
  openModal,
  farmName,
  movementFor,
} from '../utils/store'
import { isOnSite } from '../utils/leaveUtils'
import { formatDate, formatTime, today } from '../utils/dateUtils'
import { exportCsv } from '../utils/exportUtils'
const farmRows = computed(() =>
  allowedFarms.value.map((f) => {
    const people = store.employees.filter((e) => e.farm === f.id),
      onsite = people.filter(isOnSite).length
    return {
      ...f,
      total: people.length,
      onsite,
      percent: Math.round((onsite / people.length) * 100),
    }
  })
)
const recentActivity = computed(() =>
  store.history
    .filter((h) => visibleEmployees.value.some((e) => e.id === h.employeeId))
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 4)
)
const upcoming = computed(() =>
  visibleLeaves.value
    .filter((l) => l.approval === 'Approved' && !movementFor(l)?.departedAt)
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 4)
)
const columns = [
  { key: 'employee', label: 'EMPLOYEE' },
  { key: 'dates', label: 'LEAVE DATES' },
  { key: 'status', label: 'STATUS' },
  { key: 'action', label: '' },
]
function download() {
  exportCsv(
    farmRows.value.map((f) => ({
      Farm: f.name,
      Employees: f.total,
      'On site': f.onsite,
      'Availability %': f.percent,
      Minimum: f.minimum,
    })),
    'farm-overview.csv'
  )
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>A clear view of your people. Here’s what’s happening across your farms.</p>
      </div>
      <div class="header-actions">
        <BaseButton variant="secondary" icon="download" @click="download">
          Export overview
        </BaseButton>
        <BaseButton icon="plus" @click="openModal('leave')">New leave</BaseButton>
      </div>
    </header>
    <div class="stats-grid">
      <StatCard
        title="Employees"
        :value="stats.employees"
        :caption="
          store.selectedFarm === 'all'
            ? `${allowedFarms.length} farms, one team`
            : `${farmName(store.selectedFarm)} team members`
        "
        icon="users"
      />
      <StatCard
        title="On site"
        :value="stats.onsite"
        caption="Present and ready to work"
        icon="farm"
      />
      <StatCard
        title="On leave"
        :value="stats.leave"
        caption="Currently away"
        icon="leaf"
        tone="leave"
      />
      <StatCard
        title="Returning soon"
        :value="stats.returning"
        caption="Within the next 3 days"
        icon="calendar"
        tone="returning"
      />
      <StatCard
        title="Overdue"
        :value="stats.overdue"
        caption="Follow-up needed"
        icon="alert"
        tone="overdue"
      />
      <StatCard
        title="Pending approvals"
        :value="stats.pending"
        caption="Ready for your review"
        icon="clock"
        tone="pending"
      />
    </div>
    <div class="dashboard-grid">
      <section class="card">
        <div class="card-header">
          <div>
            <h2>Farm availability</h2>
            <p>On-site teams at a glance · {{ formatDate(today(), { weekday: 'long' }) }}</p>
          </div>
          <RouterLink to="/staffing" class="text-link">
            View staffing
            <AppIcon name="arrow" />
          </RouterLink>
        </div>
        <div class="card-body">
          <button
            v-for="farm in farmRows"
            :key="farm.id"
            class="farm-row"
            :aria-label="`Select ${farm.name}, ${farm.percent}% available`"
            @click="store.selectedFarm = farm.id"
          >
            <span class="farm-name">
              <AppIcon name="farm" />
              {{ farm.name }}
            </span>
            <div>
              <div class="progress-track">
                <div
                  :class="['progress-fill', { warning: farm.onsite < farm.minimum }]"
                  :style="{ width: farm.percent + '%' }"
                />
              </div>
              <div class="farm-headcount" style="margin-top: 5px">
                {{ farm.onsite }} of {{ farm.total }} on site
              </div>
            </div>
            <span class="farm-percentage">
              {{ farm.percent }}
              <small>%</small>
            </span>
            <div>
              <span v-if="farm.onsite < farm.minimum" class="warning-badge">
                <AppIcon name="alert" />
                Below minimum
              </span>
              <span v-else class="farm-headcount">Staffing healthy</span>
            </div>
          </button>
          <div class="farm-legend">
            <span>
              <i class="legend-dot" />
              Healthy staffing
            </span>
            <span>
              <i class="legend-dot warning" />
              Below minimum headcount
            </span>
          </div>
        </div>
        <div class="card-footer">
          <span>Suggested minimum: 80% of each farm’s team</span>
          <span>Click a farm to filter your workspace</span>
        </div>
      </section>
      <NeedsAttentionPanel />
    </div>
    <div class="dashboard-grid mt-24">
      <section class="card">
        <div class="card-header">
          <div>
            <h2>Upcoming departures</h2>
            <p>Planned time away, without the surprises.</p>
          </div>
          <RouterLink to="/calendar" class="text-link">
            Open calendar
            <AppIcon name="arrow" />
          </RouterLink>
        </div>
        <BaseTable
          :columns="columns"
          :rows="upcoming"
          empty="No upcoming departures for this selection."
        >
          <template #employee="{ row }">
            <div class="person">
              <span class="avatar blue">
                {{
                  employeeFor(row.employeeId)
                    .name.split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')
                }}
              </span>
              <div>
                <strong>{{ employeeFor(row.employeeId).name }}</strong>
                <small>{{ farmName(employeeFor(row.employeeId).farm) }} · {{ row.type }}</small>
              </div>
            </div>
          </template>
          <template #dates="{ row }">
            {{ formatDate(row.start) }} – {{ formatDate(row.end) }}
          </template>
          <template #status><StatusBadge status="Scheduled" /></template>
          <template #action="{ row }">
            <button class="text-link" @click="openModal('departure', { leave: row })">
              Mark departed
            </button>
          </template>
        </BaseTable>
      </section>
      <section class="card">
        <div class="card-header">
          <div>
            <h2>Recent activity</h2>
            <p>A little context, automatically recorded.</p>
          </div>
          <AppIcon name="history" />
        </div>
        <div class="card-body">
          <div v-if="!recentActivity.length" class="empty-state">
            <AppIcon name="history" />
            <p>No recent activity for this farm.</p>
          </div>
          <div v-for="entry in recentActivity" :key="entry.id" class="activity-row">
            <span class="activity-symbol">
              <AppIcon
                :name="
                  entry.action.includes('Extension')
                    ? 'history'
                    : entry.action.includes('Departure')
                    ? 'movement'
                    : 'check'
                "
              />
            </span>
            <div>
              <p>{{ entry.action }}</p>
              <small>
                {{ employeeFor(entry.employeeId)?.name }} ·
                {{ farmName(employeeFor(entry.employeeId)?.farm) }}
              </small>
            </div>
            <span class="activity-time">{{ formatTime(entry.timestamp) }}</span>
          </div>
        </div>
      </section>
    </div>
    <div class="insight-strip">
      <AppIcon name="sprout" />
      <div>
        <strong>A little planning goes a long way.</strong>
        <p>
          Plan leave from the calendar and we’ll check balances, overlapping dates, and staffing for
          you.
        </p>
      </div>
      <RouterLink to="/calendar" class="text-link">
        Plan with the calendar
        <AppIcon name="arrow" />
      </RouterLink>
    </div>
  </div>
</template>
```

### src/views/EmployeesView.vue

```vue
<script setup>
import { ref, computed, watch } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTable from '../components/BaseTable.vue'
import FilterBar from '../components/FilterBar.vue'
import StatusBadge from '../components/StatusBadge.vue'
import AppIcon from '../components/AppIcon.vue'
import { store, visibleEmployees, openModal, farmName } from '../utils/store'
import { DEPARTMENTS, STATUSES } from '../utils/constants'
import { exportCsv } from '../utils/exportUtils'
const search = ref(''),
  department = ref(''),
  status = ref(''),
  page = ref(1)
const employeeStatuses = Object.keys(STATUSES).slice(0, 8)
const filtered = computed(() =>
  visibleEmployees.value.filter(
    (e) =>
      `${e.name} ${e.id}`.toLowerCase().includes(search.value.toLowerCase()) &&
      (!department.value || e.department === department.value) &&
      (!status.value || e.status === status.value)
  )
)
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / 20)))
const rows = computed(() => filtered.value.slice((page.value - 1) * 20, page.value * 20))
watch([search, department, status, () => store.selectedFarm, () => store.role], () => {
  page.value = 1
})
const columns = [
  { key: 'id', label: 'EMPLOYEE ID' },
  { key: 'name', label: 'EMPLOYEE' },
  { key: 'farm', label: 'FARM' },
  { key: 'department', label: 'DEPARTMENT' },
  { key: 'entitlement', label: 'ENTITLEMENT' },
  { key: 'balance', label: 'BALANCE' },
  { key: 'status', label: 'STATUS' },
]
function download() {
  exportCsv(
    filtered.value.map((e) => ({
      ID: e.id,
      Name: e.name,
      Farm: farmName(e.farm),
      Department: e.department,
      Entitlement: e.entitlement,
      Balance: e.remainingBalance,
      Status: e.status,
    })),
    'employees.csv'
  )
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Employees</h1>
        <p>The people who keep your farms growing. All employee records in one place.</p>
      </div>
      <div class="header-actions">
        <BaseButton variant="secondary" icon="download" @click="download">
          Export employees
        </BaseButton>
        <BaseButton icon="plus" @click="openModal('leave')">Plan leave</BaseButton>
      </div>
    </header>
    <div class="card">
      <div class="card-header">
        <div>
          <h2>
            Employee directory
            <span class="badge-count">{{ visibleEmployees.length }}</span>
          </h2>
          <p>Click an employee to see their profile, leave records, and history.</p>
        </div>
      </div>
      <FilterBar v-model="search" :count="filtered.length">
        <select v-model="department" aria-label="Filter department">
          <option value="">All departments</option>
          <option v-for="d in DEPARTMENTS" :key="d">{{ d }}</option>
        </select>
        <select v-model="status" aria-label="Filter status">
          <option value="">All statuses</option>
          <option v-for="s in employeeStatuses" :key="s">{{ s }}</option>
        </select>
      </FilterBar>
      <BaseTable
        :columns="columns"
        :rows="rows"
        clickable
        @row-click="openModal('employee', { employee: $event })"
      >
        <template #name="{ row }">
          <div class="person">
            <span class="avatar" :class="['', 'blue', 'sand', 'purple'][row.farm % 4]">
              {{
                row.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
              }}
            </span>
            <div>
              <strong>{{ row.name }}</strong>
              <small>{{ row.position }}</small>
            </div>
          </div>
        </template>
        <template #farm="{ row }">{{ farmName(row.farm) }}</template>
        <template #entitlement="{ row }">{{ row.entitlement }} days</template>
        <template #balance="{ row }">
          <strong>{{ row.remainingBalance }}</strong>
          <span class="muted">days</span>
        </template>
        <template #status="{ row }"><StatusBadge :status="row.status" /></template>
      </BaseTable>
      <div class="pagination">
        <span>
          {{ filtered.length ? (page - 1) * 20 + 1 : 0 }}–{{
            Math.min(page * 20, filtered.length)
          }}
          of {{ filtered.length }} employees
        </span>
        <div class="pagination-controls">
          <button
            class="icon-btn"
            aria-label="Previous page"
            :disabled="page === 1"
            @click="page--"
          >
            <AppIcon name="left" />
          </button>
          <span>Page {{ page }} of {{ pages }}</span>
          <button class="icon-btn" aria-label="Next page" :disabled="page >= pages" @click="page++">
            <AppIcon name="chevron" />
          </button>
        </div>
      </div>
    </div>
    <div class="insight-strip">
      <AppIcon name="shield" />
      <div>
        <strong>Employee records are maintained by HR and Farm Admin only.</strong>
        <p>
          Employees do not log in. Your team takes care of planning, approvals, and movement
          records.
        </p>
      </div>
    </div>
  </div>
</template>
```

### src/views/LeaveView.vue

```vue
<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTabs from '../components/BaseTabs.vue'
import BaseTable from '../components/BaseTable.vue'
import FilterBar from '../components/FilterBar.vue'
import StatusBadge from '../components/StatusBadge.vue'
import AppIcon from '../components/AppIcon.vue'
import { store, visibleLeaves, canApprove, employeeFor, farmName, openModal } from '../utils/store'
import { LEAVE_TYPES } from '../utils/constants'
import { formatDate } from '../utils/dateUtils'
const tab = ref('Pending Approval'),
  search = ref(''),
  type = ref('')
const tabs = computed(() => [
  {
    label: 'Pending Approval',
    count: visibleLeaves.value.filter((l) => ['Pending', 'Endorsed'].includes(l.approval)).length,
  },
  { label: 'Approved', count: visibleLeaves.value.filter((l) => l.approval === 'Approved').length },
  {
    label: 'Extensions',
    count: visibleLeaves.value.filter((l) => l.extension?.status === 'Pending').length,
  },
  { label: 'All', count: visibleLeaves.value.length },
])
const rows = computed(() =>
  visibleLeaves.value.filter(
    (l) =>
      (tab.value === 'All' ||
        (tab.value === 'Approved' && l.approval === 'Approved') ||
        (tab.value === 'Pending Approval' && ['Pending', 'Endorsed'].includes(l.approval)) ||
        (tab.value === 'Extensions' && l.extension)) &&
      employeeFor(l.employeeId).name.toLowerCase().includes(search.value.toLowerCase()) &&
      (!type.value || l.type === type.value)
  )
)
const columns = computed(() => [
  { key: 'employee', label: 'EMPLOYEE' },
  { key: 'type', label: 'LEAVE TYPE' },
  {
    key: 'dates',
    label: tab.value === 'Extensions' ? 'ORIGINAL → REQUESTED RETURN' : 'LEAVE DATES',
  },
  { key: 'days', label: 'WORKING DAYS' },
  { key: 'approval', label: 'STATUS' },
  { key: 'actions', label: 'ACTIONS' },
])
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Leave planning</h1>
        <p>Make time away work for everyone, from the first request to the final return.</p>
      </div>
      <BaseButton icon="plus" @click="openModal('leave')">New leave</BaseButton>
    </header>
    <div class="card">
      <BaseTabs v-model="tab" :tabs="tabs" />
      <FilterBar v-model="search" placeholder="Search employee name…" :count="rows.length">
        <select v-model="type" aria-label="Filter leave type">
          <option value="">All leave types</option>
          <option v-for="t in LEAVE_TYPES" :key="t">{{ t }}</option>
        </select>
        <span class="tiny muted">
          {{
            store.settings.approvalMode === 'hr_approves'
              ? 'HR approval required'
              : 'Farm Admin approval enabled'
          }}
        </span>
      </FilterBar>
      <BaseTable
        :columns="columns"
        :rows="rows"
        :empty="
          tab === 'Pending Approval'
            ? 'No leave requests are waiting for review.'
            : 'No leave records match this view.'
        "
      >
        <template #employee="{ row }">
          <div class="person">
            <span class="avatar blue">
              {{
                employeeFor(row.employeeId)
                  .name.split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
              }}
            </span>
            <div>
              <strong>{{ employeeFor(row.employeeId).name }}</strong>
              <small>{{ farmName(employeeFor(row.employeeId).farm) }} · {{ row.id }}</small>
            </div>
          </div>
        </template>
        <template #dates="{ row }">
          <template v-if="tab === 'Extensions'">
            <s class="muted">{{ formatDate(row.extension.originalEnd) }}</s>
            <AppIcon name="arrow" :size="12" />
            {{ formatDate(row.extension.requestedEnd) }}
          </template>
          <template v-else>{{ formatDate(row.start) }} – {{ formatDate(row.end) }}</template>
        </template>
        <template #days="{ row }">{{ row.days }} days</template>
        <template #approval="{ row }">
          <StatusBadge :status="tab === 'Extensions' ? row.extension.status : row.approval" />
          <div v-if="row.note" class="tiny muted" :title="row.note">Revision note added</div>
        </template>
        <template #actions="{ row }">
          <div class="table-actions">
            <BaseButton
              v-if="tab === 'Extensions' && row.extension.status === 'Pending'"
              small
              variant="secondary"
              @click="openModal('extension', { leave: row })"
            >
              {{ canApprove ? 'Review extension' : 'View request' }}
            </BaseButton>
            <BaseButton
              v-else-if="['Pending', 'Endorsed'].includes(row.approval)"
              small
              :disabled="!canApprove && row.endorsed"
              @click="openModal('review', { leave: row })"
            >
              {{ canApprove ? 'Review / Approve' : row.endorsed ? 'Endorsed' : 'Endorse' }}
            </BaseButton>
            <button class="text-link" @click="openModal('history', { leave: row })">
              <AppIcon name="history" />
              History
            </button>
          </div>
        </template>
      </BaseTable>
      <div class="card-footer">
        <span>{{ rows.length }} leave records · All changes are automatically recorded.</span>
        <RouterLink to="/calendar" class="text-link">
          Plan in calendar
          <AppIcon name="arrow" />
        </RouterLink>
      </div>
    </div>
    <div class="insight-strip">
      <AppIcon name="info" />
      <div>
        <strong>Suggested rules, flexible by design.</strong>
        <p>
          Annual leave uses the leave balance. Sundays and sample holidays are excluded. HR can
          adjust approval and staffing behavior in demo settings.
        </p>
      </div>
    </div>
  </div>
</template>
```

### src/views/MovementView.vue

```vue
<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTabs from '../components/BaseTabs.vue'
import BaseTable from '../components/BaseTable.vue'
import FilterBar from '../components/FilterBar.vue'
import StatusBadge from '../components/StatusBadge.vue'
import AppIcon from '../components/AppIcon.vue'
import { store, visibleLeaves, employeeFor, farmName, movementFor, openModal } from '../utils/store'
import { formatDate, formatTime, today, daysBetween } from '../utils/dateUtils'
const tab = ref('Scheduled Departures'),
  search = ref('')
function category(leave) {
  const movement = movementFor(leave)
  if (movement?.returnedAt) return 'Completed'
  if (!movement?.departedAt) return 'Scheduled Departures'
  const status = employeeFor(leave.employeeId).status
  if (['Overdue', 'AWOL', 'Extended'].includes(status)) return status
  if (status === 'Returning Soon') return 'Returning Soon'
  return 'On Leave'
}
const eligible = computed(() => visibleLeaves.value.filter((l) => l.approval === 'Approved'))
const labels = [
  'Scheduled Departures',
  'On Leave',
  'Returning Soon',
  'Overdue',
  'Extended',
  'AWOL',
  'Completed',
]
const tabs = computed(() =>
  labels.map((label) => ({
    label,
    count: eligible.value.filter((l) => category(l) === label).length,
  }))
)
const rows = computed(() =>
  eligible.value.filter(
    (l) =>
      category(l) === tab.value &&
      `${employeeFor(l.employeeId).name} ${l.employeeId}`
        .toLowerCase()
        .includes(search.value.toLowerCase())
  )
)
const columns = computed(() => [
  { key: 'employee', label: 'EMPLOYEE' },
  { key: 'departure', label: 'DEPARTURE' },
  { key: 'return', label: 'EXPECTED RETURN' },
  ...(tab.value === 'Overdue'
    ? [
        { key: 'overdue', label: 'DAYS OVERDUE' },
        { key: 'followup', label: 'LAST FOLLOW-UP' },
      ]
    : []),
  { key: 'status', label: 'STATUS' },
  { key: 'actions', label: 'ACTIONS' },
])
function finalStatus(leave, event) {
  const value = event.target.value
  event.target.value = ''
  if (value) openModal(value, { leave })
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Movement monitoring</h1>
        <p>Know who’s away, who’s coming back, and who needs a check-in.</p>
      </div>
      <BaseButton icon="plus" @click="openModal('leave')">Schedule departure</BaseButton>
    </header>
    <div class="card">
      <BaseTabs v-model="tab" :tabs="tabs" />
      <FilterBar v-model="search" :count="rows.length">
        <span class="tiny muted">
          {{
            tab === 'Overdue'
              ? 'Off-site employees with a missed return date'
              : 'Leave and movement records stay connected automatically'
          }}
        </span>
      </FilterBar>
      <BaseTable
        :columns="columns"
        :rows="rows"
        empty="No movements in this category for the selected farm."
      >
        <template #employee="{ row }">
          <div class="person">
            <span class="avatar" :class="tab === 'Overdue' ? 'sand' : 'blue'">
              {{
                employeeFor(row.employeeId)
                  .name.split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
              }}
            </span>
            <div>
              <strong>{{ employeeFor(row.employeeId).name }}</strong>
              <small>{{ farmName(employeeFor(row.employeeId).farm) }} · {{ row.employeeId }}</small>
            </div>
          </div>
        </template>
        <template #departure="{ row }">
          {{ formatDate(movementFor(row)?.departedAt || row.start) }}
          <div v-if="movementFor(row)?.recordedLate" class="recorded-late">Recorded late</div>
        </template>
        <template #return="{ row }">
          {{ formatDate(row.end) }}
          <div v-if="movementFor(row)?.returnedAt" class="tiny muted">
            Actual: {{ formatDate(movementFor(row).returnedAt) }}
          </div>
          <div v-if="row.originalEnd !== row.end" class="tiny muted">
            Original:
            <s>{{ formatDate(row.originalEnd) }}</s>
          </div>
        </template>
        <template #overdue="{ row }">
          <span class="strong">{{ Math.max(0, daysBetween(row.end, today())) }} days</span>
        </template>
        <template #followup="{ row }">
          <span :title="movementFor(row)?.followUpNote">
            {{
              movementFor(row)?.lastFollowUp
                ? formatTime(movementFor(row).lastFollowUp)
                : 'No follow-up yet'
            }}
          </span>
        </template>
        <template #status="{ row }">
          <StatusBadge
            :status="
              movementFor(row)?.returnedAt
                ? movementFor(row).status === 'Returned Late'
                  ? 'Returned Late'
                  : 'Completed'
                : category(row) === 'Scheduled Departures'
                ? 'Scheduled'
                : employeeFor(row.employeeId).status
            "
          />
        </template>
        <template #actions="{ row }">
          <div class="table-actions">
            <BaseButton
              v-if="tab === 'Scheduled Departures'"
              small
              @click="openModal('departure', { leave: row })"
            >
              Mark as departed
            </BaseButton>
            <BaseButton
              v-else-if="tab !== 'Completed'"
              small
              variant="secondary"
              @click="openModal('return', { leave: row })"
            >
              Mark as returned
            </BaseButton>
            <button
              v-if="tab === 'Overdue'"
              class="text-link"
              @click="openModal('followup', { leave: row })"
            >
              Record follow-up
            </button>
            <select
              v-if="
                tab === 'Overdue' &&
                store.role === 'HR' &&
                employeeFor(row.employeeId).status !== 'AWOL'
              "
              aria-label="Set final status"
              @change="finalStatus(row, $event)"
            >
              <option value="">Set final status</option>
              <option value="extension">Extended</option>
              <option value="return">Returned Late</option>
              <option value="awol">AWOL</option>
            </select>
            <button
              class="text-link"
              aria-label="View movement history"
              @click="openModal('history', { leave: row })"
            >
              <AppIcon name="history" />
            </button>
          </div>
        </template>
      </BaseTable>
      <div class="card-footer">
        <span>
          {{ rows.length }} movements · Actual event dates are retained alongside recorded dates.
        </span>
        <span>All times are local</span>
      </div>
    </div>
    <div class="insight-strip">
      <AppIcon name="clock" />
      <div>
        <strong>A quick update keeps everyone informed.</strong>
        <p>
          Record departures and returns in one step. Late entries are tagged automatically, and
          follow-ups stay in the audit trail.
        </p>
      </div>
    </div>
  </div>
</template>
```

### src/views/ReportsView.vue

```vue
<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../components/BaseButton.vue'
import BaseTable from '../components/BaseTable.vue'
import StatCard from '../components/StatCard.vue'
import StatusBadge from '../components/StatusBadge.vue'
import AppIcon from '../components/AppIcon.vue'
import {
  store,
  visibleLeaves,
  visibleEmployees,
  allowedFarms,
  employeeFor,
  farmName,
  movementFor,
  openModal,
} from '../utils/store'
import { today, addDays, overlaps, formatDate, daysBetween } from '../utils/dateUtils'
import { LEAVE_TYPES } from '../utils/constants'
import { exportCsv, simulateExport } from '../utils/exportUtils'
import { dailyHeadcount } from '../utils/leaveUtils'
const report = ref('Leave Summary'),
  start = ref(addDays(today(), -30)),
  end = ref(addDays(today(), 30)),
  type = ref(''),
  status = ref('')
const reportTypes = [
  'Leave Summary',
  'Movements (Entries/Exits)',
  'Extensions',
  'Overdue/AWOL',
  'Staffing',
  'Employee History',
]
const statusOptions = [
  'Pending',
  'Approved',
  'Endorsed',
  'Scheduled',
  'On Leave',
  'Returning Soon',
  'Overdue',
  'Extended',
  'Returned Late',
  'AWOL',
  'Completed',
]
const selectedLeaves = computed(() =>
  visibleLeaves.value.filter(
    (l) =>
      overlaps(l.start, l.end, start.value, end.value) &&
      (!type.value || l.type === type.value) &&
      (!status.value ||
        [l.approval, l.status, employeeFor(l.employeeId).status].includes(status.value))
  )
)
const rows = computed(() => {
  if (!start.value || !end.value || end.value < start.value) return []
  if (report.value === 'Staffing') {
    const farmIds = new Set(visibleEmployees.value.map((e) => e.farm))
    const count = Math.min(daysBetween(start.value, end.value) + 1, 93)
    return allowedFarms.value
      .filter((f) => farmIds.has(f.id))
      .flatMap((f) =>
        Array.from({ length: count }, (_, i) => {
          const date = addDays(start.value, i),
            onsite = dailyHeadcount(store, f.id, date),
            total = store.employees.filter((e) => e.farm === f.id).length
          return {
            id: `${f.id}-${date}`,
            farm: f.name,
            date,
            onsite,
            minimum: f.minimum,
            availability: Math.round((onsite / total) * 100) + '%',
            status: onsite < f.minimum ? 'Below minimum' : 'Healthy',
          }
        })
      )
      .filter(
        (r) => !status.value || (status.value === 'Overdue' ? r.status === 'Below minimum' : true)
      )
  }
  if (report.value === 'Employee History')
    return store.history
      .filter(
        (h) =>
          visibleEmployees.value.some((e) => e.id === h.employeeId) &&
          h.timestamp.slice(0, 10) >= start.value &&
          h.timestamp.slice(0, 10) <= end.value &&
          (!type.value || store.leaves.find((l) => l.id === h.leaveId)?.type === type.value) &&
          (!status.value ||
            [
              employeeFor(h.employeeId).status,
              store.leaves.find((l) => l.id === h.leaveId)?.approval,
            ].includes(status.value))
      )
      .map((h) => ({
        id: h.id,
        employee: employeeFor(h.employeeId).name,
        farm: farmName(employeeFor(h.employeeId).farm),
        date: h.timestamp.slice(0, 10),
        action: h.action,
        actor: h.actor,
        changes: JSON.stringify({ before: h.oldValues, after: h.newValues }),
        late: h.recordedLate ? 'Recorded late' : '',
      }))
  let source = selectedLeaves.value
  if (report.value === 'Extensions')
    source = source.filter((l) => l.extension || l.status === 'Extended')
  if (report.value === 'Overdue/AWOL')
    source = source.filter(
      (l) =>
        ['Overdue', 'AWOL'].includes(employeeFor(l.employeeId).status) &&
        movementFor(l) &&
        !movementFor(l).returnedAt
    )
  if (report.value === 'Movements (Entries/Exits)') source = source.filter((l) => movementFor(l))
  return source.map((l) => {
    const employee = employeeFor(l.employeeId),
      movement = movementFor(l)
    return {
      id: l.id,
      employee: employee.name,
      farm: farmName(employee.farm),
      type: l.type,
      start: l.start,
      end: l.end,
      days: l.days,
      status:
        report.value === 'Leave Summary'
          ? l.approval
          : movement?.returnedAt
          ? movement.status === 'Returned Late'
            ? 'Returned Late'
            : 'Completed'
          : employee.status,
      ...(report.value === 'Extensions'
        ? {
            original: l.extension?.originalEnd || l.originalEnd,
            requested: l.extension?.requestedEnd || l.end,
            approval: l.extension?.status || 'Approved',
          }
        : {}),
      ...(report.value === 'Movements (Entries/Exits)'
        ? {
            departed: movement?.departedAt,
            returned: movement?.returnedAt || 'Not yet returned',
            late: movement?.recordedLate ? 'Recorded late' : '',
          }
        : {}),
      ...(report.value === 'Overdue/AWOL'
        ? {
            overdue: Math.max(0, daysBetween(l.end, today())),
            followup: movement?.lastFollowUp || 'None',
          }
        : {}),
    }
  })
})
const columns = computed(() =>
  report.value === 'Staffing'
    ? [
        { key: 'farm', label: 'FARM' },
        { key: 'date', label: 'DATE' },
        { key: 'onsite', label: 'ON SITE' },
        { key: 'minimum', label: 'MINIMUM' },
        { key: 'availability', label: 'AVAILABILITY' },
        { key: 'status', label: 'STATUS' },
      ]
    : report.value === 'Employee History'
    ? [
        { key: 'employee', label: 'EMPLOYEE' },
        { key: 'farm', label: 'FARM' },
        { key: 'date', label: 'DATE' },
        { key: 'action', label: 'ACTION' },
        { key: 'actor', label: 'RECORDED BY' },
        { key: 'late', label: 'NOTE' },
      ]
    : [
        { key: 'employee', label: 'EMPLOYEE' },
        { key: 'farm', label: 'FARM' },
        { key: 'type', label: 'LEAVE TYPE' },
        { key: 'dates', label: 'DATES' },
        { key: 'days', label: 'DAYS' },
        ...(report.value === 'Extensions'
          ? [{ key: 'extension', label: 'ORIGINAL → REQUESTED RETURN' }]
          : []),
        ...(report.value === 'Overdue/AWOL' ? [{ key: 'overdue', label: 'DAYS OVERDUE' }] : []),
        ...(report.value === 'Movements (Entries/Exits)'
          ? [
              { key: 'departed', label: 'ACTUAL DEPARTURE' },
              { key: 'returned', label: 'ACTUAL RETURN' },
            ]
          : []),
        { key: 'status', label: 'STATUS' },
      ]
)
const workingDayTotal = computed(() => rows.value.reduce((sum, r) => sum + (r.days || 0), 0))
function detail(row) {
  if (report.value === 'Staffing') return
  if (report.value === 'Employee History') {
    const history = store.history.find((h) => h.id === row.id)
    openModal('employee', { employee: employeeFor(history.employeeId) })
  } else openModal('history', { leave: store.leaves.find((l) => l.id === row.id) })
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>HR reports</h1>
        <p>Clear records, better decisions. Bring the full picture into focus.</p>
      </div>
      <div class="header-actions">
        <BaseButton variant="secondary" @click="simulateExport">Excel</BaseButton>
        <BaseButton variant="secondary" @click="simulateExport">PDF</BaseButton>
        <BaseButton
          icon="download"
          @click="exportCsv(rows, report.toLowerCase().replace(/[^a-z]+/g, '-') + '.csv')"
        >
          Export CSV
        </BaseButton>
      </div>
    </header>
    <div class="stats-grid report-metrics">
      <StatCard
        title="Matching records"
        :value="rows.length"
        caption="Within selected filters"
        icon="report"
      />
      <StatCard
        title="Employees in scope"
        :value="visibleEmployees.length"
        caption="Respects your farm access"
        icon="users"
      />
      <StatCard
        title="Working days"
        :value="workingDayTotal"
        caption="Across matching leave records"
        icon="calendar"
      />
      <StatCard
        title="Farms in scope"
        :value="new Set(visibleEmployees.map((e) => e.farm)).size"
        caption="Included in this report"
        icon="farm"
      />
    </div>
    <div class="card">
      <div class="card-header">
        <div>
          <h2>{{ report }}</h2>
          <p>
            {{
              store.selectedFarm === 'all'
                ? 'Consolidated across all authorized farms'
                : farmName(store.selectedFarm)
            }}
            · {{ formatDate(start) }} – {{ formatDate(end) }}
          </p>
        </div>
        <label class="field report-type">
          <span class="sr-only">Report type</span>
          <select v-model="report" aria-label="Report type">
            <option v-for="r in reportTypes" :key="r">{{ r }}</option>
          </select>
        </label>
      </div>
      <div class="filter-bar">
        <label class="field">
          <span class="sr-only">Report farm</span>
          <select v-model="store.selectedFarm" aria-label="Report farm">
            <option v-if="store.role === 'HR'" value="all">All farms · Consolidated</option>
            <option v-for="f in allowedFarms" :key="f.id" :value="f.id">{{ f.name }}</option>
          </select>
        </label>
        <label class="filter-date">
          From
          <input v-model="start" class="input" type="date" aria-label="Report start date" />
        </label>
        <label class="filter-date">
          To
          <input
            v-model="end"
            class="input"
            type="date"
            :min="start"
            aria-label="Report end date"
          />
        </label>
        <select v-if="report !== 'Staffing'" v-model="type" aria-label="Report leave type">
          <option value="">All leave types</option>
          <option v-for="t in LEAVE_TYPES" :key="t">{{ t }}</option>
        </select>
        <select v-if="report !== 'Staffing'" v-model="status" aria-label="Report status">
          <option value="">All statuses</option>
          <option v-for="s in statusOptions" :key="s">{{ s }}</option>
        </select>
      </div>
      <div v-if="end < start" class="notice danger">
        <AppIcon name="alert" />
        Choose an end date on or after the start date.
      </div>
      <BaseTable
        :columns="columns"
        :rows="rows"
        :clickable="report !== 'Staffing'"
        @row-click="detail"
      >
        <template #date="{ row }">{{ formatDate(row.date) }}</template>
        <template #dates="{ row }">
          {{ formatDate(row.start) }} – {{ formatDate(row.end) }}
        </template>
        <template #extension="{ row }">
          <s class="muted">{{ formatDate(row.original) }}</s>
          → {{ formatDate(row.requested) }}
          <div class="tiny muted">{{ row.approval }}</div>
        </template>
        <template #status="{ row }">
          <span
            v-if="report === 'Staffing'"
            :class="row.status === 'Below minimum' ? 'warning-badge' : 'status-badge status-onsite'"
          >
            {{ row.status }}
          </span>
          <StatusBadge v-else :status="row.status" />
        </template>
        <template #departed="{ row }">
          {{ formatDate(row.departed) }}
          <div v-if="row.late" class="recorded-late">{{ row.late }}</div>
        </template>
        <template #returned="{ row }">
          {{ row.returned === 'Not yet returned' ? row.returned : formatDate(row.returned) }}
        </template>
      </BaseTable>
      <div class="card-footer">
        <span>
          {{ rows.length }} matching records{{
            report === 'Staffing'
              ? ' · Forecast capped at 93 days per farm'
              : ' · Click a record to see its history'
          }}
        </span>
        <span>CSV downloads all filtered records</span>
      </div>
    </div>
    <div class="insight-strip">
      <AppIcon name="shield" />
      <div>
        <strong>The same data, wherever you look.</strong>
        <p>
          Reports use the shared leave, movement, staffing, and audit records. Farm Admin access is
          restricted to assigned farms.
        </p>
      </div>
    </div>
  </div>
</template>
```

### src/views/StaffingView.vue

```vue
<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppIcon from '../components/AppIcon.vue'
import BaseButton from '../components/BaseButton.vue'
import { store, allowedFarms, openModal } from '../utils/store'
import { isOnSite, dailyHeadcount } from '../utils/leaveUtils'
import { today, addDays, formatDate } from '../utils/dateUtils'
import { exportCsv } from '../utils/exportUtils'
const router = useRouter()
const dates = Array.from({ length: 7 }, (_, i) => addDays(today(), i))
const rows = computed(() =>
  allowedFarms.value
    .filter((f) => store.selectedFarm === 'all' || f.id === Number(store.selectedFarm))
    .map((f) => {
      const employees = store.employees.filter((e) => e.farm === f.id),
        onsite = employees.filter(isOnSite).length,
        days = dates.map((date) => ({ date, count: dailyHeadcount(store, f.id, date) }))
      return {
        ...f,
        total: employees.length,
        onsite,
        away: employees.length - onsite,
        percent: Math.round((onsite / employees.length) * 100),
        days,
        warning: onsite < f.minimum || days.some((d) => d.count < f.minimum),
      }
    })
)
function download() {
  exportCsv(
    rows.value.flatMap((f) =>
      f.days.map((d) => ({
        Farm: f.name,
        Date: d.date,
        'On site': d.count,
        Minimum: f.minimum,
        Total: f.total,
        Warning: d.count < f.minimum ? 'Below minimum' : 'Healthy',
      }))
    ),
    'staffing-forecast.csv'
  )
}
function plan(farm) {
  store.selectedFarm = farm.id
  router.push('/calendar')
}
</script>
<template>
  <div>
    <header class="page-header">
      <div>
        <h1>Staffing overview</h1>
        <p>Healthy teams, steady operations. See today’s availability and the week ahead.</p>
      </div>
      <div class="header-actions">
        <BaseButton variant="secondary" icon="download" @click="download">
          Export staffing
        </BaseButton>
        <BaseButton icon="plus" @click="openModal('leave')">Plan leave</BaseButton>
      </div>
    </header>
    <div class="three-column">
      <section v-for="farm in rows" :key="farm.id" class="card">
        <div class="card-header">
          <div>
            <h2 class="flex">
              <AppIcon name="farm" />
              {{ farm.name }}
            </h2>
            <p>{{ farm.location }}</p>
          </div>
          <span v-if="farm.warning" class="warning-badge">
            <AppIcon name="alert" />
            Staffing warning
          </span>
          <span v-else class="status-badge status-onsite">Healthy</span>
        </div>
        <div class="card-body">
          <div class="staffing-metrics">
            <div>
              <strong>{{ farm.total }}</strong>
              <span>Total employees</span>
            </div>
            <div>
              <strong>{{ farm.onsite }}</strong>
              <span>On site today</span>
            </div>
            <div>
              <strong>{{ farm.away }}</strong>
              <span>On leave / away</span>
            </div>
          </div>
          <div class="progress-track">
            <div
              :class="['progress-fill', { warning: farm.onsite < farm.minimum }]"
              :style="{ width: farm.percent + '%' }"
            />
          </div>
          <div class="staffing-caption">
            <span>{{ farm.percent }}% availability</span>
            <span class="muted">Minimum: {{ farm.minimum }}</span>
          </div>
          <div class="eyebrow mt-24">Next 7 days · On-site headcount</div>
          <div class="mini-chart" :aria-label="`${farm.name} seven-day staffing forecast`">
            <div
              v-for="day in farm.days"
              :key="day.date"
              class="mini-chart-column"
              :title="`${formatDate(day.date)}: ${day.count} on site, minimum ${farm.minimum}`"
            >
              <span>{{ day.count }}</span>
              <div
                :class="['mini-chart-bar', { warning: day.count < farm.minimum }]"
                :style="{ height: (day.count / farm.total) * 60 + 'px' }"
              />
              <span>
                {{ formatDate(day.date, { weekday: 'short', month: undefined, day: undefined }) }}
              </span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <span>
            {{
              farm.warning
                ? 'Review planned absences before scheduling.'
                : 'Your farm is in a good place.'
            }}
          </span>
          <button class="text-link" @click="plan(farm)">
            Plan leave
            <AppIcon name="arrow" />
          </button>
        </div>
      </section>
    </div>
    <div class="insight-strip">
      <AppIcon name="users" />
      <div>
        <strong>Staffing warnings help you plan ahead.</strong>
        <p>
          The forecast uses approved leave dates and recorded returns. Suggested minimums are set at
          about 80% of each team. HR can choose to warn or block in demo settings.
        </p>
      </div>
    </div>
  </div>
</template>
```

## Folder: Project root

### vue.config.js

```javascript
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})
```

