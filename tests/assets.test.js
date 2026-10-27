import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'
import { describe, expect, it } from 'vitest'
import sources from '../theme/assets/legacy/SOURCES.json'

// The chrome taken from legacy (decision D7, inventory-app#2233): every file
// SOURCES.json lists is here, byte for byte the one legacy serves, and the
// folder holds nothing it does not list.
describe('legacy chrome assets', () => {
  it.each(Object.entries(sources.files))('%s is the file legacy serves', (path, { sha256 }) => {
    const bytes = readFileSync(resolve(path))
    expect(createHash('sha256').update(bytes).digest('hex')).toBe(sha256)
  })

  it('holds no file the manifest does not list', () => {
    const listed = new Set(Object.keys(sources.files))
    // Every file, in the folder and its subfolders (random_image/DIA_new).
    const present = readdirSync(resolve('theme/assets/legacy'), { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name !== 'SOURCES.json')
      .map((entry) => `${relative(process.cwd(), entry.parentPath).split(sep).join('/')}/${entry.name}`)
    expect(present.filter((path) => !listed.has(path))).toEqual([])
  })
})
