"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class SassWarning extends Error {
  constructor(warning, options) {
    super(warning);
    this.name = "SassWarning";
    this.hideStack = true;

    if (options.span) {
      this.loc = {
        line: options.span.start.line,
        column: options.span.start.column
      };
    }
  }

}

var _default = SassWarning;
exports.default = _default;