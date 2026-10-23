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
