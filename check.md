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
