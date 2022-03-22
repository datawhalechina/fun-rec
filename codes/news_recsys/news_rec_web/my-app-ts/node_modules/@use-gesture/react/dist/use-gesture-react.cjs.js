'use strict';

if (process.env.NODE_ENV === "production") {
  module.exports = require("./use-gesture-react.cjs.prod.js");
} else {
  module.exports = require("./use-gesture-react.cjs.dev.js");
}
