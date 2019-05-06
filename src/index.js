const fs = require('fs-extra')
const {resolve} = require('home')
const stringify = require('code-stringify')

class Config {
  constructor (name, options) {
    this._options = options

    this.read = this.read.bind(this)
    this.edit = this.edit.bind(this)

    this._path = resolve('~', '.nodegit', 'config', name)
  }

  get path () {
    return this._path
  }

  async read () {
    try {
      return require(this._path)
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND') {
        throw err
      }
    }

    return this._ensure()
  }

  async _ensure () {
    const options = this._options

    const configFileContent = options.defaults
      ? stringify(options.defaults)
      : options.configFileContent

    await fs.outputFile(this._path, configFileContent)
    return require(this._path)
  }

  edit () {

  }
}

module.exports = (name, options) => new Config(name, options)
