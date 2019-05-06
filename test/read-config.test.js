const test = require('ava')
const home = require('home')
const fs = require('fs-extra')
// const log = require('util').debuglog('@nodegit/read-config')
const config = require('../src')

test.before(() => fs.remove(home.resolve('~/.nodegit/config')))

test('complex', async t => {
  const {
    read,
    path: p
  } = config('some-name', {
    defaults: {}
  })

  t.is(p, home.resolve('~/.nodegit/config/some-name.js'))
  t.deepEqual(await read(), {})
})

test('defaultFileContent and edit', async t => {
  const {
    read,
    edit
  } = config('some-name2', {
    defaultFileContent: `module.exports = {a: 1}`
  })

  t.deepEqual(await read(), {a: 1})

  const promise = edit()
  const {subProcess} = promise

  t.is(typeof subProcess.pid, 'number')

  const signal = 'SIGQUIT'

  subProcess.kill(signal)
  t.deepEqual(await promise, {
    code: null,
    signal
  })
})

test('exists', async t => {
  const file = home.resolve('~/.nodegit/config/some-name3.js')
  await fs.outputFile(file, `module.exports = {a: 3}`)

  const {
    read
  } = config('some-name3', {
    defaults: {}
  })

  t.deepEqual(await read(), {a: 3})
})

const ERRORS = [
  [undefined, {}, 'INVALID_NAME'],
  ['foo', undefined, 'INVALID_OPTIONS'],
  ['foo', {
    defaults: 1
  }, 'INVALID_OPTION_DEFAULTS'],
  ['foo', {
    defaultFileContent: 1
  }, 'INVALID_OPTION_DEFAULT_FILE_CONTENT'],
  ['foo', {}, 'NO_DEFAULTS']
]

ERRORS.forEach(([name, options, code]) => {
  test(`config(${name}, ${JSON.stringify(options)})`, t => {
    t.throws(() => config(name, options), {
      code
    })
  })
})
