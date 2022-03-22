"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LessError extends Error {
  constructor(error) {
    super();
    this.message = ["\n", ...LessError.getFileExcerptIfPossible(error), error.message.charAt(0).toUpperCase() + error.message.slice(1), error.filename ? `      Error in ${_path.default.normalize(error.filename)} (line ${error.line}, column ${error.column})` : ""].join("\n");
    this.hideStack = true;
  }

  static getFileExcerptIfPossible(lessError) {
    if (typeof lessError.extract === "undefined") {
      return [];
    }

    const excerpt = lessError.extract.slice(0, 2);
    const column = Math.max(lessError.column - 1, 0);

    if (typeof excerpt[0] === "undefined") {
      excerpt.shift();
    }

    excerpt.push(`${new Array(column).join(" ")}^`);
    return excerpt;
  }

}

var _default = LessError;
exports.default = _default;