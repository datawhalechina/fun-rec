
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./better-ajv-errors.cjs.production.min.js')
} else {
  module.exports = require('./better-ajv-errors.cjs.development.js')
}
