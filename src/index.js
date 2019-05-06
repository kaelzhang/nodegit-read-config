const fs = require('fs-extra')
const {resolve} = require('home')
const stringify = require('code-stringify')
const {make} = require('open-editor')
const {spawn} = require('child_process')
const once = require('once')
const {
  isString, isObject, isBuffer, isUndefined
} = require('core-util-is')

const {error} = require('./error')

const DEFAULT_EDITOR = 'vi'

const open = (path, options) => {
  const {
    isTerminalEditor,
    binary,
    arguments: args
  } = make([this._path], options)

  // eslint-disable-next-line no-return-await
  let child

  const ret = new Promise((r, reject) => {
    reject = once(reject)
    let errored = false

    const stdio = isTerminalEditor
      ? 'inherit'
      : 'ignore'

    child = spawn(binary, args, {
      detached: true,
      stdio
    })

    child.on('error', err => {
      errored = true
      reject(error('FAILS_OPEN', err.stack))
    })

    child.on('exit', (code, signal) => {
      if (errored) {
        return
      }

      r({
        code,
        signal
      })
    })
  })

  ret.subProcess = child

  return ret
}

class Config {
  constructor (name, options) {
    if (!isString(name)) {
      throw error('INVALID_NAME')
    }

    if (!isObject(options)) {
      throw error('INVALID_OPTIONS')
    }

    const {
      defaults,
      defaultFileContent
    } = options

    const ud = isUndefined(defaults)
    const udc = isUndefined(defaultFileContent)

    if (udc && !ud && !isObject(defaults)) {
      throw error('INVALID_OPTION_DEFAULTS', defaults)
    }

    if (
      ud
      && !udc
      && !isString(defaultFileContent)
      && !isBuffer(defaultFileContent)
    ) {
      throw error('INVALID_OPTION_DEFAULT_FILE_CONTENT', defaultFileContent)
    }

    if (ud && udc) {
      throw error('NO_DEFAULTS')
    }

    this._options = options

    this.read = this.read.bind(this)
    this.edit = this.edit.bind(this)

    this._path = resolve('~', '.nodegit', 'config', `${name}.js`)
  }

  get path () {
    return this._path
  }

  async read () {
    try {
      await fs.access(this._path, fs.constants.R_OK)
    } catch (err) {
      return this._ensure()
    }

    return require(this._path)
  }

  async _ensure () {
    const options = this._options

    const configFileContent = options.defaults
      ? stringify(options.defaults)
      : options.defaultFileContent

    await fs.outputFile(this._path, configFileContent)

    return require(this._path)
  }

  edit ({editor = DEFAULT_EDITOR} = {}) {
    const options = {
      editor
    }

    return open(this._path, options)
  }
}

module.exports = (name, options) => new Config(name, options)
