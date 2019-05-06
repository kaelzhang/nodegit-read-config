[![Build Status](https://travis-ci.org/kaelzhang/nodegit-read-config.svg?branch=master)](https://travis-ci.org/kaelzhang/nodegit-read-config)
[![Coverage](https://codecov.io/gh/kaelzhang/nodegit-read-config/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/nodegit-read-config)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/nodegit-read-config?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/nodegit-read-config)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/@nodegit/read-config.svg)](http://badge.fury.io/js/@nodegit/read-config)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/@nodegit/read-config.svg)](https://www.npmjs.org/package/@nodegit/read-config)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/nodegit-read-config.svg)](https://david-dm.org/kaelzhang/nodegit-read-config)
-->

# @nodegit/read-config

Read config for @nodegit commands

## Install

```sh
$ npm i @nodegit/read-config
```

## Usage

```js
const config = require('@nodegit/read-config')
const {read, edit, path} = config('push', {
  defaults: {
    allowForcePush: true
  }
})

console.log(await read())
```

## config(name, options)

- **name** `string` name of the config which indicates that the config file will be located at `~/.nodegit/config/${name}.js`
- **options** `Object`
  - **defaults?** `Object` the default value of the configuration
  - **defaultFileContent?** `path` the default configuration file to be used if there is no config file found.

### await read(): Object

Get the local config. If there is no config file found, it will create one.

### await edit(): void

Open the default editor and edit the config file

### getter: path

Returns `path` the absolute pathname of the config file

## License

[MIT](LICENSE)
