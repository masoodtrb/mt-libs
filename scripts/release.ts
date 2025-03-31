#!/usr/bin/env tsx

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

function log(message: string) {
  console.log(`🟢 ${message}`)
}

function run(cmd: string): string {
  return execSync(cmd, { stdio: 'pipe' }).toString().trim()
}

function hasUncommittedChanges(): boolean {
  return run('git status --porcelain').length > 0
}

function hasChangesets(): boolean {
  const changesetDir = path.resolve('.changeset')
  if (!fs.existsSync(changesetDir)) return false
  return fs.readdirSync(changesetDir).some((file) => file.endsWith('.md'))
}

try {
  log('Checking for uncommitted changes...')
  if (hasUncommittedChanges()) {
    console.error('❌ You have uncommitted changes. Please commit or stash them first.')
    process.exit(1)
  }

  log('Verifying presence of changesets...')
  if (!hasChangesets()) {
    console.error('❌ No changesets found. Run `pnpm changeset` before releasing.')
    process.exit(1)
  }

  log('Applying version changes...')
  run('pnpm changeset version')

  log('Staging version updates...')
  run('git add .')

  const diff = run('git diff --cached --name-only')
  if (!diff) {
    console.log('⚠️ No changes to commit (possibly already committed). Skipping commit & tag.')
    process.exit(0)
  }

  log('Committing version updates...')
  run('git commit -m "release: apply version updates"')

  const version = run('node -p "require(\'./package.json\').version"')
  log(`Tagging release v${version}...`)
  run(`git tag v${version}`)

  log('Pushing to GitHub...')
  run('git push')
  run('git push --tags')

  log(`✅ Release v${version} completed and pushed.`)
} catch (error) {
  console.error('❌ Release script failed:', error)
  process.exit(1)
}
