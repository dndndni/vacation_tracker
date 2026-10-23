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
