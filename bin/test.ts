import { configure, processCLIArgs, run } from '@japa/runner'
import { assert } from '@japa/assert'
import * as reporters from '@japa/runner/reporters'

const activated = ['spec']
if (process.env.GITHUB_ACTIONS === 'true') {
  activated.push('github')
}

processCLIArgs(process.argv.splice(2))
configure({
  suites: [
    {
      name: 'unit',
      files: ['tests/unit/**/*.spec.ts'],
    },
  ],
  plugins: [assert()],
  reporters: {
    activated,
    list: [reporters.spec(), reporters.ndjson(), reporters.dot(), reporters.github()],
  },
})

run()
