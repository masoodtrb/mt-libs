#!/usr/bin/env tsx

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

function log(message: string) {
  console.log(`🟢 ${message}`)
}

function run(command: string): string {
  return execSync(command, { stdio: 'pipe' }).toString().trim()
}

function hasUncommittedChanges(): boolean {
  const status = run('git status --porcelain')
  return status.length > 0
}

function hasChangesets(): boolean {
  const changesetDir = path.resolve('.changeset')
  if (!fs.existsSync(changesetDir)) {
    return false
  }
  const files = fs.readdirSync(changesetDir)
  return files.some((file) => file.endsWith('.md'))
}

try {
  log('Checking for uncommitted changes...')
  if (hasUncommittedChanges()) {
    console.error('❌ Uncommitted changes detected. Please commit or stash them first.')
    process.exit(1)
  }

  log('Verifying presence of changesets...')
  if (!hasChangesets()) {
    console.error(
      '❌ No changesets found. Please run `pnpm changeset` to create a changeset before releasing.',
    )
    process.exit(1)
  }

  log('Applying version changes...')
  run('pnpm changeset version')

  log('Staging changes...')
  run('git add .')

  log('Committing version updates...')
  run('git commit -m "chore: apply version updates"')

  log('Tagging the release...')
  const version = run('node -p "require(\'./package.json\').version"')
  run(`git tag v${version}`)

  log('Pushing changes to remote repository...')
  run('git push')
  run('git push --tags')

  log(`✅ Release process completed successfully. Version v${version} has been released.`)
} catch (error) {
  console.error('❌ An error occurred during the release process:', error)
  process.exit(1)
}
