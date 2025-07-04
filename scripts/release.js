#!/usr/bin/env node
/* eslint-disable no-console */

import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import SemVer from '@pawel-up/semver/classes/semver.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJsonPath = join(__dirname, '..', 'package.json')

function updateVersion(type) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
  const currentVersion = packageJson.version
  const ver = new SemVer(currentVersion)
  ver.inc(type)

  packageJson.version = ver.format()
  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

  return packageJson.version
}

function main() {
  const type = process.argv[2] || 'patch'

  if (!['major', 'minor', 'patch'].includes(type)) {
    console.error('Usage: node scripts/release.js [major|minor|patch]')
    process.exit(1)
  }

  try {
    // Check if working directory is clean
    const status = execSync('git status --porcelain', { encoding: 'utf8' })
    if (status.trim()) {
      console.error('Working directory is not clean. Please commit or stash your changes.')
      process.exit(1)
    }

    // Update version
    const newVersion = updateVersion(type)
    console.log(`Updated version to ${newVersion}`)

    // Build the project
    console.log('Building project...')
    execSync('npm run build', { stdio: 'inherit' })

    // Commit version bump
    execSync('git add package.json', { stdio: 'inherit' })
    execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' })

    // Create and push tag
    execSync(`git tag v${newVersion}`, { stdio: 'inherit' })
    execSync('git push origin main', { stdio: 'inherit' })
    execSync(`git push origin v${newVersion}`, { stdio: 'inherit' })

    console.log(`\n🎉 Release ${newVersion} created and pushed!`)
    console.log('The GitHub Actions workflow will now create a release with changelog.')
  } catch (error) {
    console.error('Error during release:', error.message)
    process.exit(1)
  }
}

main()
