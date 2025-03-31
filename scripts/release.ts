#!/usr/bin/env tsx

import { execSync } from 'child_process'

function log(message: string) {
  console.log(`🟢 ${message}`)
}

function run(command: string): string {
  return execSync(command, { stdio: 'pipe' }).toString().trim()
}

function getNextVersion(): string {
  // Run changeset version in dry-run mode to determine the next version
  const output = run('pnpm changeset version --snapshot')
  const match = output.match(/New version: (\d+\.\d+\.\d+)/)
  if (!match) {
    console.error(
      '❌ Unable to determine the next version. Please ensure changesets are configured correctly.',
    )
    process.exit(1)
  }
  return match[1]
}

try {
  log('Checking for uncommitted changes...')
  const status = run('git status --porcelain')
  if (status) {
    console.error('❌ Uncommitted changes detected. Please commit or stash them first.')
    process.exit(1)
  }

  log('Determining the next version...')
  const nextVersion = getNextVersion()

  log('Applying version changes...')
  run('pnpm changeset version')

  log('Staging changes...')
  run('git add .')

  log(`Committing release v${nextVersion}...`)
  run(`git commit -m "release: v${nextVersion}"`)

  log(`Tagging release v${nextVersion}...`)
  run(`git tag v${nextVersion}`)

  log('Pushing to GitHub...')
  run('git push')
  run('git push --tags')

  log(`✅ Release process completed. CI/CD pipeline will handle publishing for v${nextVersion}.`)
} catch (error) {
  console.error('❌ Release script encountered an error:', error)
  process.exit(1)
}
