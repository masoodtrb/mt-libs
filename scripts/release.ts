#!/usr/bin/env tsx

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const log = (msg: string) => console.log(`🟢 ${msg}`)

function run(cmd: string) {
  execSync(cmd, { stdio: 'inherit' })
}

function getVersion(): string {
  const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'))
  return pkg.version
}

try {
  log('Checking for uncommitted changes...')
  const status = execSync('git status --porcelain').toString().trim()
  if (status) {
    console.error('❌ Uncommitted changes detected. Please commit or stash them first.')
    process.exit(1)
  }

  log('Running changeset version...')
  run('pnpm changeset version')

  log('Staging changes...')
  run('git add .')

  const version = getVersion()
  log(`Committing release v${version}...`)
  run(`git commit -m "release: v${version}"`)

  log('Tagging...')
  run(`git tag v${version}`)

  log('Pushing...')
  run('git push')
  run('git push --tags')

  log(`✅ All done! CI will publish and create GitHub release for v${version}.`)
} catch (err) {
  console.error('❌ Release script failed:', err)
  process.exit(1)
}
