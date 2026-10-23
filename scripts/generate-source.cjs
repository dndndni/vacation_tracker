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
