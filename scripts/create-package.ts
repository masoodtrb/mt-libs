#!/usr/bin/env tsx

import { execSync } from 'child_process'
import fs from 'fs-extra'
import * as path from 'path'
import { prompt } from 'prompts'
import * as yaml from 'yaml'

const WORKSPACE_FILE = 'pnpm-workspace.yaml'

async function main() {
  const { name, isReact } = await prompt([
    {
      type: 'text',
      name: 'name',
      message: 'Package name (e.g., my-utils):',
      validate: (name: string) => (name ? true : 'Name is required'),
    },
    {
      type: 'confirm',
      name: 'isReact',
      message: 'Does this package use React?',
      initial: false,
    },
  ])

  const dir = path.join('packages', name)
  if (await fs.pathExists(dir)) {
    console.error(`❌ Package "${name}" already exists at ${dir}`)
    process.exit(1)
  }

  const srcDir = path.join(dir, 'src')
  await fs.ensureDir(srcDir)

  // Create package.json
  const pkg = {
    name: `@mtused/${name}`,
    version: '0.1.0',
    main: 'dist/index.cjs',
    module: 'dist/index.mjs',
    types: 'dist/index.d.ts',
    files: ['dist'],
    scripts: {
      build: 'tsup src/index.ts --format esm,cjs --dts --clean',
      dev: 'tsup src/index.ts --watch',
      test: 'vitest',
    },
    peerDependencies: isReact
      ? {
          '@types/react': '^19.0.12',
          '@types/react-dom': '^19.0.4',
          react: '^19.1.0',
          'react-dom': '^19.1.0',
        }
      : {},
  }

  await fs.writeJson(path.join(dir, 'package.json'), pkg, { spaces: 2 })

  // Create tsconfig
  await fs.writeJson(path.join(dir, 'tsconfig.json'), {
    extends: '../../tsconfig.base.json',
    include: ['src'],
  })

  // Create entry file
  const defaultCode = isReact
    ? `import { useState } from 'react'\n\nexport function useExample() {\n  const [state, setState] = useState(null)\n  return [state, setState] as const\n}\n`
    : `export function example() {\n  return 'Hello from ${name}'\n}\n`

  await fs.writeFile(path.join(srcDir, 'index.ts'), defaultCode)

  // Update pnpm-workspace.yaml
  const workspaceText = await fs.readFile(WORKSPACE_FILE, 'utf8')
  const workspace = yaml.parse(workspaceText)

  const relativePath = `packages/${name}`
  if (!workspace.packages.includes(relativePath)) {
    workspace.packages.push(relativePath)
    await fs.writeFile(WORKSPACE_FILE, yaml.stringify(workspace))
    console.log(`📦 Added ${relativePath} to pnpm-workspace.yaml`)
  }
  console.log(`📦 Installing updated workspace packages...`)
  execSync('pnpm install', { stdio: 'inherit' })

  console.log(`✅ Created @yourname/${name} in packages/${name}`)
}

main()
