const {Errors, exitOnNotDefined} = require('err-object')

const {error, E} = new Errors({
  prefix: '[read-config] ',
  notDefined: exitOnNotDefined
})

const BUT_GOT = ', but got `%s`'

const TE = (name, message) => E(
  name,
  message + BUT_GOT,
  TypeError
)

TE('INVALID_NAME', 'name must be a string')
TE('INVALID_OPTIONS', 'options must be an object')
TE('INVALID_OPTION_DEFAULTS', 'options.defaults should be an object')
TE('INVALID_OPTION_DEFAULT_FILE_CONTENT',
  'options.defaultFileContent should be string or buffer')

E('NO_DEFAULTS',
  'either options.defaults or options.defaultFileContent is not defined')

E('FAILS_OPEN', 'fails to open editor: %s')

E('EDITOR_EXIT_CODE', 'editor exit with non-zero exit code %s, signal "%s"')

module.exports = {
  error
}
