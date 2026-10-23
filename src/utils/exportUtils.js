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
