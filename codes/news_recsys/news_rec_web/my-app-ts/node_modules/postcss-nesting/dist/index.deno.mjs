function cleanupParent(parent) {
  if (!parent.nodes.length) {
    parent.remove();
    return;
  }

  const commentNodes = parent.nodes.filter(node => node.type === 'comment');

  if (commentNodes.length === parent.nodes.length) {
    parent.replaceWith(...commentNodes);
  }
}

function shiftNodesBeforeParent(node) {
  const parent = node.parent;
  const index = parent.index(node); // conditionally move previous siblings into a clone of the parent

  if (index) {
    const newParent = parent.cloneBefore().removeAll().append(parent.nodes.slice(0, index));
    cleanupParent(newParent);
  } // move the current node before the parent (and after the conditional clone)


  parent.before(node);
  return parent;
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var dist = {exports: {}};

var processor = {exports: {}};

var parser$1 = {exports: {}};

var root$1 = {exports: {}};

var container = {exports: {}};

var node = {exports: {}};

var util = {};

var unesc = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = unesc; // Many thanks for this post which made this migration much easier.
  // https://mathiasbynens.be/notes/css-escapes

  /**
   * 
   * @param {string} str 
   * @returns {[string, number]|undefined}
   */

  function gobbleHex(str) {
    var lower = str.toLowerCase();
    var hex = '';
    var spaceTerminated = false;

    for (var i = 0; i < 6 && lower[i] !== undefined; i++) {
      var code = lower.charCodeAt(i); // check to see if we are dealing with a valid hex char [a-f|0-9]

      var valid = code >= 97 && code <= 102 || code >= 48 && code <= 57; // https://drafts.csswg.org/css-syntax/#consume-escaped-code-point

      spaceTerminated = code === 32;

      if (!valid) {
        break;
      }

      hex += lower[i];
    }

    if (hex.length === 0) {
      return undefined;
    }

    var codePoint = parseInt(hex, 16);
    var isSurrogate = codePoint >= 0xD800 && codePoint <= 0xDFFF; // Add special case for
    // "If this number is zero, or is for a surrogate, or is greater than the maximum allowed code point"
    // https://drafts.csswg.org/css-syntax/#maximum-allowed-code-point

    if (isSurrogate || codePoint === 0x0000 || codePoint > 0x10FFFF) {
      return ["\uFFFD", hex.length + (spaceTerminated ? 1 : 0)];
    }

    return [String.fromCodePoint(codePoint), hex.length + (spaceTerminated ? 1 : 0)];
  }

  var CONTAINS_ESCAPE = /\\/;

  function unesc(str) {
    var needToProcess = CONTAINS_ESCAPE.test(str);

    if (!needToProcess) {
      return str;
    }

    var ret = "";

    for (var i = 0; i < str.length; i++) {
      if (str[i] === "\\") {
        var gobbled = gobbleHex(str.slice(i + 1, i + 7));

        if (gobbled !== undefined) {
          ret += gobbled[0];
          i += gobbled[1];
          continue;
        } // Retain a pair of \\ if double escaped `\\\\`
        // https://github.com/postcss/postcss-selector-parser/commit/268c9a7656fb53f543dc620aa5b73a30ec3ff20e


        if (str[i + 1] === "\\") {
          ret += "\\";
          i++;
          continue;
        } // if \\ is at the end of the string retain it
        // https://github.com/postcss/postcss-selector-parser/commit/01a6b346e3612ce1ab20219acc26abdc259ccefb


        if (str.length === i + 1) {
          ret += str[i];
        }

        continue;
      }

      ret += str[i];
    }

    return ret;
  }

  module.exports = exports.default;
})(unesc, unesc.exports);

var getProp = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = getProp;

  function getProp(obj) {
    for (var _len = arguments.length, props = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      props[_key - 1] = arguments[_key];
    }

    while (props.length > 0) {
      var prop = props.shift();

      if (!obj[prop]) {
        return undefined;
      }

      obj = obj[prop];
    }

    return obj;
  }

  module.exports = exports.default;
})(getProp, getProp.exports);

var ensureObject = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = ensureObject;

  function ensureObject(obj) {
    for (var _len = arguments.length, props = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      props[_key - 1] = arguments[_key];
    }

    while (props.length > 0) {
      var prop = props.shift();

      if (!obj[prop]) {
        obj[prop] = {};
      }

      obj = obj[prop];
    }
  }

  module.exports = exports.default;
})(ensureObject, ensureObject.exports);

var stripComments = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = stripComments;

  function stripComments(str) {
    var s = "";
    var commentStart = str.indexOf("/*");
    var lastEnd = 0;

    while (commentStart >= 0) {
      s = s + str.slice(lastEnd, commentStart);
      var commentEnd = str.indexOf("*/", commentStart + 2);

      if (commentEnd < 0) {
        return s;
      }

      lastEnd = commentEnd + 2;
      commentStart = str.indexOf("/*", lastEnd);
    }

    s = s + str.slice(lastEnd);
    return s;
  }

  module.exports = exports.default;
})(stripComments, stripComments.exports);

util.__esModule = true;
util.stripComments = util.ensureObject = util.getProp = util.unesc = void 0;

var _unesc = _interopRequireDefault$1(unesc.exports);

util.unesc = _unesc["default"];

var _getProp = _interopRequireDefault$1(getProp.exports);

util.getProp = _getProp["default"];

var _ensureObject = _interopRequireDefault$1(ensureObject.exports);

util.ensureObject = _ensureObject["default"];

var _stripComments = _interopRequireDefault$1(stripComments.exports);

util.stripComments = _stripComments["default"];

function _interopRequireDefault$1(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;
  var _util = util;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var cloneNode = function cloneNode(obj, parent) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    var cloned = new obj.constructor();

    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) {
        continue;
      }

      var value = obj[i];
      var type = typeof value;

      if (i === 'parent' && type === 'object') {
        if (parent) {
          cloned[i] = parent;
        }
      } else if (value instanceof Array) {
        cloned[i] = value.map(function (j) {
          return cloneNode(j, cloned);
        });
      } else {
        cloned[i] = cloneNode(value, cloned);
      }
    }

    return cloned;
  };

  var Node = /*#__PURE__*/function () {
    function Node(opts) {
      if (opts === void 0) {
        opts = {};
      }

      Object.assign(this, opts);
      this.spaces = this.spaces || {};
      this.spaces.before = this.spaces.before || '';
      this.spaces.after = this.spaces.after || '';
    }

    var _proto = Node.prototype;

    _proto.remove = function remove() {
      if (this.parent) {
        this.parent.removeChild(this);
      }

      this.parent = undefined;
      return this;
    };

    _proto.replaceWith = function replaceWith() {
      if (this.parent) {
        for (var index in arguments) {
          this.parent.insertBefore(this, arguments[index]);
        }

        this.remove();
      }

      return this;
    };

    _proto.next = function next() {
      return this.parent.at(this.parent.index(this) + 1);
    };

    _proto.prev = function prev() {
      return this.parent.at(this.parent.index(this) - 1);
    };

    _proto.clone = function clone(overrides) {
      if (overrides === void 0) {
        overrides = {};
      }

      var cloned = cloneNode(this);

      for (var name in overrides) {
        cloned[name] = overrides[name];
      }

      return cloned;
    }
    /**
     * Some non-standard syntax doesn't follow normal escaping rules for css.
     * This allows non standard syntax to be appended to an existing property
     * by specifying the escaped value. By specifying the escaped value,
     * illegal characters are allowed to be directly inserted into css output.
     * @param {string} name the property to set
     * @param {any} value the unescaped value of the property
     * @param {string} valueEscaped optional. the escaped value of the property.
     */
    ;

    _proto.appendToPropertyAndEscape = function appendToPropertyAndEscape(name, value, valueEscaped) {
      if (!this.raws) {
        this.raws = {};
      }

      var originalValue = this[name];
      var originalEscaped = this.raws[name];
      this[name] = originalValue + value; // this may trigger a setter that updates raws, so it has to be set first.

      if (originalEscaped || valueEscaped !== value) {
        this.raws[name] = (originalEscaped || originalValue) + valueEscaped;
      } else {
        delete this.raws[name]; // delete any escaped value that was created by the setter.
      }
    }
    /**
     * Some non-standard syntax doesn't follow normal escaping rules for css.
     * This allows the escaped value to be specified directly, allowing illegal
     * characters to be directly inserted into css output.
     * @param {string} name the property to set
     * @param {any} value the unescaped value of the property
     * @param {string} valueEscaped the escaped value of the property.
     */
    ;

    _proto.setPropertyAndEscape = function setPropertyAndEscape(name, value, valueEscaped) {
      if (!this.raws) {
        this.raws = {};
      }

      this[name] = value; // this may trigger a setter that updates raws, so it has to be set first.

      this.raws[name] = valueEscaped;
    }
    /**
     * When you want a value to passed through to CSS directly. This method
     * deletes the corresponding raw value causing the stringifier to fallback
     * to the unescaped value.
     * @param {string} name the property to set.
     * @param {any} value The value that is both escaped and unescaped.
     */
    ;

    _proto.setPropertyWithoutEscape = function setPropertyWithoutEscape(name, value) {
      this[name] = value; // this may trigger a setter that updates raws, so it has to be set first.

      if (this.raws) {
        delete this.raws[name];
      }
    }
    /**
     *
     * @param {number} line The number (starting with 1)
     * @param {number} column The column number (starting with 1)
     */
    ;

    _proto.isAtPosition = function isAtPosition(line, column) {
      if (this.source && this.source.start && this.source.end) {
        if (this.source.start.line > line) {
          return false;
        }

        if (this.source.end.line < line) {
          return false;
        }

        if (this.source.start.line === line && this.source.start.column > column) {
          return false;
        }

        if (this.source.end.line === line && this.source.end.column < column) {
          return false;
        }

        return true;
      }

      return undefined;
    };

    _proto.stringifyProperty = function stringifyProperty(name) {
      return this.raws && this.raws[name] || this[name];
    };

    _proto.valueToString = function valueToString() {
      return String(this.stringifyProperty("value"));
    };

    _proto.toString = function toString() {
      return [this.rawSpaceBefore, this.valueToString(), this.rawSpaceAfter].join('');
    };

    _createClass(Node, [{
      key: "rawSpaceBefore",
      get: function get() {
        var rawSpace = this.raws && this.raws.spaces && this.raws.spaces.before;

        if (rawSpace === undefined) {
          rawSpace = this.spaces && this.spaces.before;
        }

        return rawSpace || "";
      },
      set: function set(raw) {
        (0, _util.ensureObject)(this, "raws", "spaces");
        this.raws.spaces.before = raw;
      }
    }, {
      key: "rawSpaceAfter",
      get: function get() {
        var rawSpace = this.raws && this.raws.spaces && this.raws.spaces.after;

        if (rawSpace === undefined) {
          rawSpace = this.spaces.after;
        }

        return rawSpace || "";
      },
      set: function set(raw) {
        (0, _util.ensureObject)(this, "raws", "spaces");
        this.raws.spaces.after = raw;
      }
    }]);

    return Node;
  }();

  exports["default"] = Node;
  module.exports = exports.default;
})(node, node.exports);

var types = {};

types.__esModule = true;
types.UNIVERSAL = types.ATTRIBUTE = types.CLASS = types.COMBINATOR = types.COMMENT = types.ID = types.NESTING = types.PSEUDO = types.ROOT = types.SELECTOR = types.STRING = types.TAG = void 0;
var TAG = 'tag';
types.TAG = TAG;
var STRING = 'string';
types.STRING = STRING;
var SELECTOR = 'selector';
types.SELECTOR = SELECTOR;
var ROOT = 'root';
types.ROOT = ROOT;
var PSEUDO = 'pseudo';
types.PSEUDO = PSEUDO;
var NESTING = 'nesting';
types.NESTING = NESTING;
var ID = 'id';
types.ID = ID;
var COMMENT = 'comment';
types.COMMENT = COMMENT;
var COMBINATOR = 'combinator';
types.COMBINATOR = COMBINATOR;
var CLASS = 'class';
types.CLASS = CLASS;
var ATTRIBUTE = 'attribute';
types.ATTRIBUTE = ATTRIBUTE;
var UNIVERSAL = 'universal';
types.UNIVERSAL = UNIVERSAL;

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _node = _interopRequireDefault(node.exports);

  var types$1 = _interopRequireWildcard(types);

  function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();

    _getRequireWildcardCache = function _getRequireWildcardCache() {
      return cache;
    };

    return cache;
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }

    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return {
        "default": obj
      };
    }

    var cache = _getRequireWildcardCache();

    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }

    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }

    newObj["default"] = obj;

    if (cache) {
      cache.set(obj, newObj);
    }

    return newObj;
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _createForOfIteratorHelperLoose(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        return function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    it = o[Symbol.iterator]();
    return it.next.bind(it);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Container = /*#__PURE__*/function (_Node) {
    _inheritsLoose(Container, _Node);

    function Container(opts) {
      var _this;

      _this = _Node.call(this, opts) || this;

      if (!_this.nodes) {
        _this.nodes = [];
      }

      return _this;
    }

    var _proto = Container.prototype;

    _proto.append = function append(selector) {
      selector.parent = this;
      this.nodes.push(selector);
      return this;
    };

    _proto.prepend = function prepend(selector) {
      selector.parent = this;
      this.nodes.unshift(selector);
      return this;
    };

    _proto.at = function at(index) {
      return this.nodes[index];
    };

    _proto.index = function index(child) {
      if (typeof child === 'number') {
        return child;
      }

      return this.nodes.indexOf(child);
    };

    _proto.removeChild = function removeChild(child) {
      child = this.index(child);
      this.at(child).parent = undefined;
      this.nodes.splice(child, 1);
      var index;

      for (var id in this.indexes) {
        index = this.indexes[id];

        if (index >= child) {
          this.indexes[id] = index - 1;
        }
      }

      return this;
    };

    _proto.removeAll = function removeAll() {
      for (var _iterator = _createForOfIteratorHelperLoose(this.nodes), _step; !(_step = _iterator()).done;) {
        var node = _step.value;
        node.parent = undefined;
      }

      this.nodes = [];
      return this;
    };

    _proto.empty = function empty() {
      return this.removeAll();
    };

    _proto.insertAfter = function insertAfter(oldNode, newNode) {
      newNode.parent = this;
      var oldIndex = this.index(oldNode);
      this.nodes.splice(oldIndex + 1, 0, newNode);
      newNode.parent = this;
      var index;

      for (var id in this.indexes) {
        index = this.indexes[id];

        if (oldIndex <= index) {
          this.indexes[id] = index + 1;
        }
      }

      return this;
    };

    _proto.insertBefore = function insertBefore(oldNode, newNode) {
      newNode.parent = this;
      var oldIndex = this.index(oldNode);
      this.nodes.splice(oldIndex, 0, newNode);
      newNode.parent = this;
      var index;

      for (var id in this.indexes) {
        index = this.indexes[id];

        if (index <= oldIndex) {
          this.indexes[id] = index + 1;
        }
      }

      return this;
    };

    _proto._findChildAtPosition = function _findChildAtPosition(line, col) {
      var found = undefined;
      this.each(function (node) {
        if (node.atPosition) {
          var foundChild = node.atPosition(line, col);

          if (foundChild) {
            found = foundChild;
            return false;
          }
        } else if (node.isAtPosition(line, col)) {
          found = node;
          return false;
        }
      });
      return found;
    }
    /**
     * Return the most specific node at the line and column number given.
     * The source location is based on the original parsed location, locations aren't
     * updated as selector nodes are mutated.
     * 
     * Note that this location is relative to the location of the first character
     * of the selector, and not the location of the selector in the overall document
     * when used in conjunction with postcss.
     *
     * If not found, returns undefined.
     * @param {number} line The line number of the node to find. (1-based index)
     * @param {number} col  The column number of the node to find. (1-based index)
     */
    ;

    _proto.atPosition = function atPosition(line, col) {
      if (this.isAtPosition(line, col)) {
        return this._findChildAtPosition(line, col) || this;
      } else {
        return undefined;
      }
    };

    _proto._inferEndPosition = function _inferEndPosition() {
      if (this.last && this.last.source && this.last.source.end) {
        this.source = this.source || {};
        this.source.end = this.source.end || {};
        Object.assign(this.source.end, this.last.source.end);
      }
    };

    _proto.each = function each(callback) {
      if (!this.lastEach) {
        this.lastEach = 0;
      }

      if (!this.indexes) {
        this.indexes = {};
      }

      this.lastEach++;
      var id = this.lastEach;
      this.indexes[id] = 0;

      if (!this.length) {
        return undefined;
      }

      var index, result;

      while (this.indexes[id] < this.length) {
        index = this.indexes[id];
        result = callback(this.at(index), index);

        if (result === false) {
          break;
        }

        this.indexes[id] += 1;
      }

      delete this.indexes[id];

      if (result === false) {
        return false;
      }
    };

    _proto.walk = function walk(callback) {
      return this.each(function (node, i) {
        var result = callback(node, i);

        if (result !== false && node.length) {
          result = node.walk(callback);
        }

        if (result === false) {
          return false;
        }
      });
    };

    _proto.walkAttributes = function walkAttributes(callback) {
      var _this2 = this;

      return this.walk(function (selector) {
        if (selector.type === types$1.ATTRIBUTE) {
          return callback.call(_this2, selector);
        }
      });
    };

    _proto.walkClasses = function walkClasses(callback) {
      var _this3 = this;

      return this.walk(function (selector) {
        if (selector.type === types$1.CLASS) {
          return callback.call(_this3, selector);
        }
      });
    };

    _proto.walkCombinators = function walkCombinators(callback) {
      var _this4 = this;

      return this.walk(function (selector) {
        if (selector.type === types$1.COMBINATOR) {
          return callback.call(_this4, selector);
        }
      });
    };

    _proto.walkComments = function walkComments(callback) {
      var _this5 = this;

      return this.walk(function (selector) {
        if (selector.type === types$1.COMMENT) {
          return callback.call(_this5, selector);
        }
      });
    };

    _proto.walkIds = function walkIds(callback) {
      var _this6 = this;

      return this.walk(function (selector) {
        if (selector.type === types$1.ID) {
          return callback.call(_this6, selector);
        }
      });
    };

    _proto.walkNesting = function walkNesting(callback) {
      var _this7 = this;

      return this.walk(function (selector) {
        if (selector.type === types$1.NESTING) {
          return callback.call(_this7, selector);
        }
      });
    };

    _proto.walkPseudos = function walkPseudos(callback) {
      var _this8 = this;

      return this.walk(function (selector) {
        if (selector.type === types$1.PSEUDO) {
          return callback.call(_this8, selector);
        }
      });
    };

    _proto.walkTags = function walkTags(callback) {
      var _this9 = this;

      return this.walk(function (selector) {
        if (selector.type === types$1.TAG) {
          return callback.call(_this9, selector);
        }
      });
    };

    _proto.walkUniversals = function walkUniversals(callback) {
      var _this10 = this;

      return this.walk(function (selector) {
        if (selector.type === types$1.UNIVERSAL) {
          return callback.call(_this10, selector);
        }
      });
    };

    _proto.split = function split(callback) {
      var _this11 = this;

      var current = [];
      return this.reduce(function (memo, node, index) {
        var split = callback.call(_this11, node);
        current.push(node);

        if (split) {
          memo.push(current);
          current = [];
        } else if (index === _this11.length - 1) {
          memo.push(current);
        }

        return memo;
      }, []);
    };

    _proto.map = function map(callback) {
      return this.nodes.map(callback);
    };

    _proto.reduce = function reduce(callback, memo) {
      return this.nodes.reduce(callback, memo);
    };

    _proto.every = function every(callback) {
      return this.nodes.every(callback);
    };

    _proto.some = function some(callback) {
      return this.nodes.some(callback);
    };

    _proto.filter = function filter(callback) {
      return this.nodes.filter(callback);
    };

    _proto.sort = function sort(callback) {
      return this.nodes.sort(callback);
    };

    _proto.toString = function toString() {
      return this.map(String).join('');
    };

    _createClass(Container, [{
      key: "first",
      get: function get() {
        return this.at(0);
      }
    }, {
      key: "last",
      get: function get() {
        return this.at(this.length - 1);
      }
    }, {
      key: "length",
      get: function get() {
        return this.nodes.length;
      }
    }]);

    return Container;
  }(_node["default"]);

  exports["default"] = Container;
  module.exports = exports.default;
})(container, container.exports);

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _container = _interopRequireDefault(container.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Root = /*#__PURE__*/function (_Container) {
    _inheritsLoose(Root, _Container);

    function Root(opts) {
      var _this;

      _this = _Container.call(this, opts) || this;
      _this.type = _types.ROOT;
      return _this;
    }

    var _proto = Root.prototype;

    _proto.toString = function toString() {
      var str = this.reduce(function (memo, selector) {
        memo.push(String(selector));
        return memo;
      }, []).join(',');
      return this.trailingComma ? str + ',' : str;
    };

    _proto.error = function error(message, options) {
      if (this._error) {
        return this._error(message, options);
      } else {
        return new Error(message);
      }
    };

    _createClass(Root, [{
      key: "errorGenerator",
      set: function set(handler) {
        this._error = handler;
      }
    }]);

    return Root;
  }(_container["default"]);

  exports["default"] = Root;
  module.exports = exports.default;
})(root$1, root$1.exports);

var selector$1 = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _container = _interopRequireDefault(container.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Selector = /*#__PURE__*/function (_Container) {
    _inheritsLoose(Selector, _Container);

    function Selector(opts) {
      var _this;

      _this = _Container.call(this, opts) || this;
      _this.type = _types.SELECTOR;
      return _this;
    }

    return Selector;
  }(_container["default"]);

  exports["default"] = Selector;
  module.exports = exports.default;
})(selector$1, selector$1.exports);

var className$1 = {exports: {}};

/*! https://mths.be/cssesc v3.0.0 by @mathias */

var object = {};
var hasOwnProperty = object.hasOwnProperty;

var merge = function merge(options, defaults) {
  if (!options) {
    return defaults;
  }

  var result = {};

  for (var key in defaults) {
    // `if (defaults.hasOwnProperty(key) { … }` is not needed here, since
    // only recognized option names are used.
    result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
  }

  return result;
};

var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g; // https://mathiasbynens.be/notes/css-escapes#css

var cssesc = function cssesc(string, options) {
  options = merge(options, cssesc.options);

  if (options.quotes != 'single' && options.quotes != 'double') {
    options.quotes = 'single';
  }

  var quote = options.quotes == 'double' ? '"' : '\'';
  var isIdentifier = options.isIdentifier;
  var firstChar = string.charAt(0);
  var output = '';
  var counter = 0;
  var length = string.length;

  while (counter < length) {
    var character = string.charAt(counter++);
    var codePoint = character.charCodeAt();
    var value = void 0; // If it’s not a printable ASCII character…

    if (codePoint < 0x20 || codePoint > 0x7E) {
      if (codePoint >= 0xD800 && codePoint <= 0xDBFF && counter < length) {
        // It’s a high surrogate, and there is a next character.
        var extra = string.charCodeAt(counter++);

        if ((extra & 0xFC00) == 0xDC00) {
          // next character is low surrogate
          codePoint = ((codePoint & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000;
        } else {
          // It’s an unmatched surrogate; only append this code unit, in case
          // the next code unit is the high surrogate of a surrogate pair.
          counter--;
        }
      }

      value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
    } else {
      if (options.escapeEverything) {
        if (regexAnySingleEscape.test(character)) {
          value = '\\' + character;
        } else {
          value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
        }
      } else if (/[\t\n\f\r\x0B]/.test(character)) {
        value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
      } else if (character == '\\' || !isIdentifier && (character == '"' && quote == character || character == '\'' && quote == character) || isIdentifier && regexSingleEscape.test(character)) {
        value = '\\' + character;
      } else {
        value = character;
      }
    }

    output += value;
  }

  if (isIdentifier) {
    if (/^-[-\d]/.test(output)) {
      output = '\\-' + output.slice(1);
    } else if (/\d/.test(firstChar)) {
      output = '\\3' + firstChar + ' ' + output.slice(1);
    }
  } // Remove spaces after `\HEX` escapes that are not followed by a hex digit,
  // since they’re redundant. Note that this is only possible if the escape
  // sequence isn’t preceded by an odd number of backslashes.


  output = output.replace(regexExcessiveSpaces, function ($0, $1, $2) {
    if ($1 && $1.length % 2) {
      // It’s not safe to remove the space, so don’t.
      return $0;
    } // Strip the space.


    return ($1 || '') + $2;
  });

  if (!isIdentifier && options.wrap) {
    return quote + output + quote;
  }

  return output;
}; // Expose default options (so they can be overridden globally).


cssesc.options = {
  'escapeEverything': false,
  'isIdentifier': false,
  'quotes': 'single',
  'wrap': false
};
cssesc.version = '3.0.0';
var cssesc_1 = cssesc;

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _cssesc = _interopRequireDefault(cssesc_1);

  var _util = util;

  var _node = _interopRequireDefault(node.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var ClassName = /*#__PURE__*/function (_Node) {
    _inheritsLoose(ClassName, _Node);

    function ClassName(opts) {
      var _this;

      _this = _Node.call(this, opts) || this;
      _this.type = _types.CLASS;
      _this._constructed = true;
      return _this;
    }

    var _proto = ClassName.prototype;

    _proto.valueToString = function valueToString() {
      return '.' + _Node.prototype.valueToString.call(this);
    };

    _createClass(ClassName, [{
      key: "value",
      get: function get() {
        return this._value;
      },
      set: function set(v) {
        if (this._constructed) {
          var escaped = (0, _cssesc["default"])(v, {
            isIdentifier: true
          });

          if (escaped !== v) {
            (0, _util.ensureObject)(this, "raws");
            this.raws.value = escaped;
          } else if (this.raws) {
            delete this.raws.value;
          }
        }

        this._value = v;
      }
    }]);

    return ClassName;
  }(_node["default"]);

  exports["default"] = ClassName;
  module.exports = exports.default;
})(className$1, className$1.exports);

var comment$2 = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _node = _interopRequireDefault(node.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Comment = /*#__PURE__*/function (_Node) {
    _inheritsLoose(Comment, _Node);

    function Comment(opts) {
      var _this;

      _this = _Node.call(this, opts) || this;
      _this.type = _types.COMMENT;
      return _this;
    }

    return Comment;
  }(_node["default"]);

  exports["default"] = Comment;
  module.exports = exports.default;
})(comment$2, comment$2.exports);

var id$1 = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _node = _interopRequireDefault(node.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var ID = /*#__PURE__*/function (_Node) {
    _inheritsLoose(ID, _Node);

    function ID(opts) {
      var _this;

      _this = _Node.call(this, opts) || this;
      _this.type = _types.ID;
      return _this;
    }

    var _proto = ID.prototype;

    _proto.valueToString = function valueToString() {
      return '#' + _Node.prototype.valueToString.call(this);
    };

    return ID;
  }(_node["default"]);

  exports["default"] = ID;
  module.exports = exports.default;
})(id$1, id$1.exports);

var tag$1 = {exports: {}};

var namespace = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _cssesc = _interopRequireDefault(cssesc_1);

  var _util = util;

  var _node = _interopRequireDefault(node.exports);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Namespace = /*#__PURE__*/function (_Node) {
    _inheritsLoose(Namespace, _Node);

    function Namespace() {
      return _Node.apply(this, arguments) || this;
    }

    var _proto = Namespace.prototype;

    _proto.qualifiedName = function qualifiedName(value) {
      if (this.namespace) {
        return this.namespaceString + "|" + value;
      } else {
        return value;
      }
    };

    _proto.valueToString = function valueToString() {
      return this.qualifiedName(_Node.prototype.valueToString.call(this));
    };

    _createClass(Namespace, [{
      key: "namespace",
      get: function get() {
        return this._namespace;
      },
      set: function set(namespace) {
        if (namespace === true || namespace === "*" || namespace === "&") {
          this._namespace = namespace;

          if (this.raws) {
            delete this.raws.namespace;
          }

          return;
        }

        var escaped = (0, _cssesc["default"])(namespace, {
          isIdentifier: true
        });
        this._namespace = namespace;

        if (escaped !== namespace) {
          (0, _util.ensureObject)(this, "raws");
          this.raws.namespace = escaped;
        } else if (this.raws) {
          delete this.raws.namespace;
        }
      }
    }, {
      key: "ns",
      get: function get() {
        return this._namespace;
      },
      set: function set(namespace) {
        this.namespace = namespace;
      }
    }, {
      key: "namespaceString",
      get: function get() {
        if (this.namespace) {
          var ns = this.stringifyProperty("namespace");

          if (ns === true) {
            return '';
          } else {
            return ns;
          }
        } else {
          return '';
        }
      }
    }]);

    return Namespace;
  }(_node["default"]);

  exports["default"] = Namespace;
  module.exports = exports.default;
})(namespace, namespace.exports);

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _namespace = _interopRequireDefault(namespace.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Tag = /*#__PURE__*/function (_Namespace) {
    _inheritsLoose(Tag, _Namespace);

    function Tag(opts) {
      var _this;

      _this = _Namespace.call(this, opts) || this;
      _this.type = _types.TAG;
      return _this;
    }

    return Tag;
  }(_namespace["default"]);

  exports["default"] = Tag;
  module.exports = exports.default;
})(tag$1, tag$1.exports);

var string$1 = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _node = _interopRequireDefault(node.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var String = /*#__PURE__*/function (_Node) {
    _inheritsLoose(String, _Node);

    function String(opts) {
      var _this;

      _this = _Node.call(this, opts) || this;
      _this.type = _types.STRING;
      return _this;
    }

    return String;
  }(_node["default"]);

  exports["default"] = String;
  module.exports = exports.default;
})(string$1, string$1.exports);

var pseudo$1 = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _container = _interopRequireDefault(container.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Pseudo = /*#__PURE__*/function (_Container) {
    _inheritsLoose(Pseudo, _Container);

    function Pseudo(opts) {
      var _this;

      _this = _Container.call(this, opts) || this;
      _this.type = _types.PSEUDO;
      return _this;
    }

    var _proto = Pseudo.prototype;

    _proto.toString = function toString() {
      var params = this.length ? '(' + this.map(String).join(',') + ')' : '';
      return [this.rawSpaceBefore, this.stringifyProperty("value"), params, this.rawSpaceAfter].join('');
    };

    return Pseudo;
  }(_container["default"]);

  exports["default"] = Pseudo;
  module.exports = exports.default;
})(pseudo$1, pseudo$1.exports);

var attribute$1 = {};

/**
 * Module exports.
 */

var browser = deprecate;
/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate(fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;

  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }

      warned = true;
    }

    return fn.apply(this, arguments);
  }

  return deprecated;
}
/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */


function config(name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!commonjsGlobal.localStorage) return false;
  } catch (_) {
    return false;
  }

  var val = commonjsGlobal.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

(function (exports) {

  exports.__esModule = true;
  exports.unescapeValue = unescapeValue;
  exports["default"] = void 0;

  var _cssesc = _interopRequireDefault(cssesc_1);

  var _unesc = _interopRequireDefault(unesc.exports);

  var _namespace = _interopRequireDefault(namespace.exports);

  var _types = types;

  var _CSSESC_QUOTE_OPTIONS;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var deprecate = browser;
  var WRAPPED_IN_QUOTES = /^('|")([^]*)\1$/;
  var warnOfDeprecatedValueAssignment = deprecate(function () {}, "Assigning an attribute a value containing characters that might need to be escaped is deprecated. " + "Call attribute.setValue() instead.");
  var warnOfDeprecatedQuotedAssignment = deprecate(function () {}, "Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead.");
  var warnOfDeprecatedConstructor = deprecate(function () {}, "Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.");

  function unescapeValue(value) {
    var deprecatedUsage = false;
    var quoteMark = null;
    var unescaped = value;
    var m = unescaped.match(WRAPPED_IN_QUOTES);

    if (m) {
      quoteMark = m[1];
      unescaped = m[2];
    }

    unescaped = (0, _unesc["default"])(unescaped);

    if (unescaped !== value) {
      deprecatedUsage = true;
    }

    return {
      deprecatedUsage: deprecatedUsage,
      unescaped: unescaped,
      quoteMark: quoteMark
    };
  }

  function handleDeprecatedContructorOpts(opts) {
    if (opts.quoteMark !== undefined) {
      return opts;
    }

    if (opts.value === undefined) {
      return opts;
    }

    warnOfDeprecatedConstructor();

    var _unescapeValue = unescapeValue(opts.value),
        quoteMark = _unescapeValue.quoteMark,
        unescaped = _unescapeValue.unescaped;

    if (!opts.raws) {
      opts.raws = {};
    }

    if (opts.raws.value === undefined) {
      opts.raws.value = opts.value;
    }

    opts.value = unescaped;
    opts.quoteMark = quoteMark;
    return opts;
  }

  var Attribute = /*#__PURE__*/function (_Namespace) {
    _inheritsLoose(Attribute, _Namespace);

    function Attribute(opts) {
      var _this;

      if (opts === void 0) {
        opts = {};
      }

      _this = _Namespace.call(this, handleDeprecatedContructorOpts(opts)) || this;
      _this.type = _types.ATTRIBUTE;
      _this.raws = _this.raws || {};
      Object.defineProperty(_this.raws, 'unquoted', {
        get: deprecate(function () {
          return _this.value;
        }, "attr.raws.unquoted is deprecated. Call attr.value instead."),
        set: deprecate(function () {
          return _this.value;
        }, "Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now.")
      });
      _this._constructed = true;
      return _this;
    }
    /**
     * Returns the Attribute's value quoted such that it would be legal to use
     * in the value of a css file. The original value's quotation setting
     * used for stringification is left unchanged. See `setValue(value, options)`
     * if you want to control the quote settings of a new value for the attribute.
     *
     * You can also change the quotation used for the current value by setting quoteMark.
     *
     * Options:
     *   * quoteMark {'"' | "'" | null} - Use this value to quote the value. If this
     *     option is not set, the original value for quoteMark will be used. If
     *     indeterminate, a double quote is used. The legal values are:
     *     * `null` - the value will be unquoted and characters will be escaped as necessary.
     *     * `'` - the value will be quoted with a single quote and single quotes are escaped.
     *     * `"` - the value will be quoted with a double quote and double quotes are escaped.
     *   * preferCurrentQuoteMark {boolean} - if true, prefer the source quote mark
     *     over the quoteMark option value.
     *   * smart {boolean} - if true, will select a quote mark based on the value
     *     and the other options specified here. See the `smartQuoteMark()`
     *     method.
     **/


    var _proto = Attribute.prototype;

    _proto.getQuotedValue = function getQuotedValue(options) {
      if (options === void 0) {
        options = {};
      }

      var quoteMark = this._determineQuoteMark(options);

      var cssescopts = CSSESC_QUOTE_OPTIONS[quoteMark];
      var escaped = (0, _cssesc["default"])(this._value, cssescopts);
      return escaped;
    };

    _proto._determineQuoteMark = function _determineQuoteMark(options) {
      return options.smart ? this.smartQuoteMark(options) : this.preferredQuoteMark(options);
    }
    /**
     * Set the unescaped value with the specified quotation options. The value
     * provided must not include any wrapping quote marks -- those quotes will
     * be interpreted as part of the value and escaped accordingly.
     */
    ;

    _proto.setValue = function setValue(value, options) {
      if (options === void 0) {
        options = {};
      }

      this._value = value;
      this._quoteMark = this._determineQuoteMark(options);

      this._syncRawValue();
    }
    /**
     * Intelligently select a quoteMark value based on the value's contents. If
     * the value is a legal CSS ident, it will not be quoted. Otherwise a quote
     * mark will be picked that minimizes the number of escapes.
     *
     * If there's no clear winner, the quote mark from these options is used,
     * then the source quote mark (this is inverted if `preferCurrentQuoteMark` is
     * true). If the quoteMark is unspecified, a double quote is used.
     *
     * @param options This takes the quoteMark and preferCurrentQuoteMark options
     * from the quoteValue method.
     */
    ;

    _proto.smartQuoteMark = function smartQuoteMark(options) {
      var v = this.value;
      var numSingleQuotes = v.replace(/[^']/g, '').length;
      var numDoubleQuotes = v.replace(/[^"]/g, '').length;

      if (numSingleQuotes + numDoubleQuotes === 0) {
        var escaped = (0, _cssesc["default"])(v, {
          isIdentifier: true
        });

        if (escaped === v) {
          return Attribute.NO_QUOTE;
        } else {
          var pref = this.preferredQuoteMark(options);

          if (pref === Attribute.NO_QUOTE) {
            // pick a quote mark that isn't none and see if it's smaller
            var quote = this.quoteMark || options.quoteMark || Attribute.DOUBLE_QUOTE;
            var opts = CSSESC_QUOTE_OPTIONS[quote];
            var quoteValue = (0, _cssesc["default"])(v, opts);

            if (quoteValue.length < escaped.length) {
              return quote;
            }
          }

          return pref;
        }
      } else if (numDoubleQuotes === numSingleQuotes) {
        return this.preferredQuoteMark(options);
      } else if (numDoubleQuotes < numSingleQuotes) {
        return Attribute.DOUBLE_QUOTE;
      } else {
        return Attribute.SINGLE_QUOTE;
      }
    }
    /**
     * Selects the preferred quote mark based on the options and the current quote mark value.
     * If you want the quote mark to depend on the attribute value, call `smartQuoteMark(opts)`
     * instead.
     */
    ;

    _proto.preferredQuoteMark = function preferredQuoteMark(options) {
      var quoteMark = options.preferCurrentQuoteMark ? this.quoteMark : options.quoteMark;

      if (quoteMark === undefined) {
        quoteMark = options.preferCurrentQuoteMark ? options.quoteMark : this.quoteMark;
      }

      if (quoteMark === undefined) {
        quoteMark = Attribute.DOUBLE_QUOTE;
      }

      return quoteMark;
    };

    _proto._syncRawValue = function _syncRawValue() {
      var rawValue = (0, _cssesc["default"])(this._value, CSSESC_QUOTE_OPTIONS[this.quoteMark]);

      if (rawValue === this._value) {
        if (this.raws) {
          delete this.raws.value;
        }
      } else {
        this.raws.value = rawValue;
      }
    };

    _proto._handleEscapes = function _handleEscapes(prop, value) {
      if (this._constructed) {
        var escaped = (0, _cssesc["default"])(value, {
          isIdentifier: true
        });

        if (escaped !== value) {
          this.raws[prop] = escaped;
        } else {
          delete this.raws[prop];
        }
      }
    };

    _proto._spacesFor = function _spacesFor(name) {
      var attrSpaces = {
        before: '',
        after: ''
      };
      var spaces = this.spaces[name] || {};
      var rawSpaces = this.raws.spaces && this.raws.spaces[name] || {};
      return Object.assign(attrSpaces, spaces, rawSpaces);
    };

    _proto._stringFor = function _stringFor(name, spaceName, concat) {
      if (spaceName === void 0) {
        spaceName = name;
      }

      if (concat === void 0) {
        concat = defaultAttrConcat;
      }

      var attrSpaces = this._spacesFor(spaceName);

      return concat(this.stringifyProperty(name), attrSpaces);
    }
    /**
     * returns the offset of the attribute part specified relative to the
     * start of the node of the output string.
     *
     * * "ns" - alias for "namespace"
     * * "namespace" - the namespace if it exists.
     * * "attribute" - the attribute name
     * * "attributeNS" - the start of the attribute or its namespace
     * * "operator" - the match operator of the attribute
     * * "value" - The value (string or identifier)
     * * "insensitive" - the case insensitivity flag;
     * @param part One of the possible values inside an attribute.
     * @returns -1 if the name is invalid or the value doesn't exist in this attribute.
     */
    ;

    _proto.offsetOf = function offsetOf(name) {
      var count = 1;

      var attributeSpaces = this._spacesFor("attribute");

      count += attributeSpaces.before.length;

      if (name === "namespace" || name === "ns") {
        return this.namespace ? count : -1;
      }

      if (name === "attributeNS") {
        return count;
      }

      count += this.namespaceString.length;

      if (this.namespace) {
        count += 1;
      }

      if (name === "attribute") {
        return count;
      }

      count += this.stringifyProperty("attribute").length;
      count += attributeSpaces.after.length;

      var operatorSpaces = this._spacesFor("operator");

      count += operatorSpaces.before.length;
      var operator = this.stringifyProperty("operator");

      if (name === "operator") {
        return operator ? count : -1;
      }

      count += operator.length;
      count += operatorSpaces.after.length;

      var valueSpaces = this._spacesFor("value");

      count += valueSpaces.before.length;
      var value = this.stringifyProperty("value");

      if (name === "value") {
        return value ? count : -1;
      }

      count += value.length;
      count += valueSpaces.after.length;

      var insensitiveSpaces = this._spacesFor("insensitive");

      count += insensitiveSpaces.before.length;

      if (name === "insensitive") {
        return this.insensitive ? count : -1;
      }

      return -1;
    };

    _proto.toString = function toString() {
      var _this2 = this;

      var selector = [this.rawSpaceBefore, '['];
      selector.push(this._stringFor('qualifiedAttribute', 'attribute'));

      if (this.operator && (this.value || this.value === '')) {
        selector.push(this._stringFor('operator'));
        selector.push(this._stringFor('value'));
        selector.push(this._stringFor('insensitiveFlag', 'insensitive', function (attrValue, attrSpaces) {
          if (attrValue.length > 0 && !_this2.quoted && attrSpaces.before.length === 0 && !(_this2.spaces.value && _this2.spaces.value.after)) {
            attrSpaces.before = " ";
          }

          return defaultAttrConcat(attrValue, attrSpaces);
        }));
      }

      selector.push(']');
      selector.push(this.rawSpaceAfter);
      return selector.join('');
    };

    _createClass(Attribute, [{
      key: "quoted",
      get: function get() {
        var qm = this.quoteMark;
        return qm === "'" || qm === '"';
      },
      set: function set(value) {
        warnOfDeprecatedQuotedAssignment();
      }
      /**
       * returns a single (`'`) or double (`"`) quote character if the value is quoted.
       * returns `null` if the value is not quoted.
       * returns `undefined` if the quotation state is unknown (this can happen when
       * the attribute is constructed without specifying a quote mark.)
       */

    }, {
      key: "quoteMark",
      get: function get() {
        return this._quoteMark;
      }
      /**
       * Set the quote mark to be used by this attribute's value.
       * If the quote mark changes, the raw (escaped) value at `attr.raws.value` of the attribute
       * value is updated accordingly.
       *
       * @param {"'" | '"' | null} quoteMark The quote mark or `null` if the value should be unquoted.
       */
      ,
      set: function set(quoteMark) {
        if (!this._constructed) {
          this._quoteMark = quoteMark;
          return;
        }

        if (this._quoteMark !== quoteMark) {
          this._quoteMark = quoteMark;

          this._syncRawValue();
        }
      }
    }, {
      key: "qualifiedAttribute",
      get: function get() {
        return this.qualifiedName(this.raws.attribute || this.attribute);
      }
    }, {
      key: "insensitiveFlag",
      get: function get() {
        return this.insensitive ? 'i' : '';
      }
    }, {
      key: "value",
      get: function get() {
        return this._value;
      }
      /**
       * Before 3.0, the value had to be set to an escaped value including any wrapped
       * quote marks. In 3.0, the semantics of `Attribute.value` changed so that the value
       * is unescaped during parsing and any quote marks are removed.
       *
       * Because the ambiguity of this semantic change, if you set `attr.value = newValue`,
       * a deprecation warning is raised when the new value contains any characters that would
       * require escaping (including if it contains wrapped quotes).
       *
       * Instead, you should call `attr.setValue(newValue, opts)` and pass options that describe
       * how the new value is quoted.
       */
      ,
      set: function set(v) {
        if (this._constructed) {
          var _unescapeValue2 = unescapeValue(v),
              deprecatedUsage = _unescapeValue2.deprecatedUsage,
              unescaped = _unescapeValue2.unescaped,
              quoteMark = _unescapeValue2.quoteMark;

          if (deprecatedUsage) {
            warnOfDeprecatedValueAssignment();
          }

          if (unescaped === this._value && quoteMark === this._quoteMark) {
            return;
          }

          this._value = unescaped;
          this._quoteMark = quoteMark;

          this._syncRawValue();
        } else {
          this._value = v;
        }
      }
    }, {
      key: "attribute",
      get: function get() {
        return this._attribute;
      },
      set: function set(name) {
        this._handleEscapes("attribute", name);

        this._attribute = name;
      }
    }]);

    return Attribute;
  }(_namespace["default"]);

  exports["default"] = Attribute;
  Attribute.NO_QUOTE = null;
  Attribute.SINGLE_QUOTE = "'";
  Attribute.DOUBLE_QUOTE = '"';
  var CSSESC_QUOTE_OPTIONS = (_CSSESC_QUOTE_OPTIONS = {
    "'": {
      quotes: 'single',
      wrap: true
    },
    '"': {
      quotes: 'double',
      wrap: true
    }
  }, _CSSESC_QUOTE_OPTIONS[null] = {
    isIdentifier: true
  }, _CSSESC_QUOTE_OPTIONS);

  function defaultAttrConcat(attrValue, attrSpaces) {
    return "" + attrSpaces.before + attrValue + attrSpaces.after;
  }
})(attribute$1);

var universal$1 = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _namespace = _interopRequireDefault(namespace.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Universal = /*#__PURE__*/function (_Namespace) {
    _inheritsLoose(Universal, _Namespace);

    function Universal(opts) {
      var _this;

      _this = _Namespace.call(this, opts) || this;
      _this.type = _types.UNIVERSAL;
      _this.value = '*';
      return _this;
    }

    return Universal;
  }(_namespace["default"]);

  exports["default"] = Universal;
  module.exports = exports.default;
})(universal$1, universal$1.exports);

var combinator$2 = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _node = _interopRequireDefault(node.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Combinator = /*#__PURE__*/function (_Node) {
    _inheritsLoose(Combinator, _Node);

    function Combinator(opts) {
      var _this;

      _this = _Node.call(this, opts) || this;
      _this.type = _types.COMBINATOR;
      return _this;
    }

    return Combinator;
  }(_node["default"]);

  exports["default"] = Combinator;
  module.exports = exports.default;
})(combinator$2, combinator$2.exports);

var nesting$1 = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _node = _interopRequireDefault(node.exports);

  var _types = types;

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var Nesting = /*#__PURE__*/function (_Node) {
    _inheritsLoose(Nesting, _Node);

    function Nesting(opts) {
      var _this;

      _this = _Node.call(this, opts) || this;
      _this.type = _types.NESTING;
      _this.value = '&';
      return _this;
    }

    return Nesting;
  }(_node["default"]);

  exports["default"] = Nesting;
  module.exports = exports.default;
})(nesting$1, nesting$1.exports);

var sortAscending = {exports: {}};

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = sortAscending;

  function sortAscending(list) {
    return list.sort(function (a, b) {
      return a - b;
    });
  }
  module.exports = exports.default;
})(sortAscending, sortAscending.exports);

var tokenize = {};

var tokenTypes = {};

tokenTypes.__esModule = true;
tokenTypes.combinator = tokenTypes.word = tokenTypes.comment = tokenTypes.str = tokenTypes.tab = tokenTypes.newline = tokenTypes.feed = tokenTypes.cr = tokenTypes.backslash = tokenTypes.bang = tokenTypes.slash = tokenTypes.doubleQuote = tokenTypes.singleQuote = tokenTypes.space = tokenTypes.greaterThan = tokenTypes.pipe = tokenTypes.equals = tokenTypes.plus = tokenTypes.caret = tokenTypes.tilde = tokenTypes.dollar = tokenTypes.closeSquare = tokenTypes.openSquare = tokenTypes.closeParenthesis = tokenTypes.openParenthesis = tokenTypes.semicolon = tokenTypes.colon = tokenTypes.comma = tokenTypes.at = tokenTypes.asterisk = tokenTypes.ampersand = void 0;
var ampersand = 38; // `&`.charCodeAt(0);

tokenTypes.ampersand = ampersand;
var asterisk = 42; // `*`.charCodeAt(0);

tokenTypes.asterisk = asterisk;
var at = 64; // `@`.charCodeAt(0);

tokenTypes.at = at;
var comma$1 = 44; // `,`.charCodeAt(0);

tokenTypes.comma = comma$1;
var colon = 58; // `:`.charCodeAt(0);

tokenTypes.colon = colon;
var semicolon = 59; // `;`.charCodeAt(0);

tokenTypes.semicolon = semicolon;
var openParenthesis = 40; // `(`.charCodeAt(0);

tokenTypes.openParenthesis = openParenthesis;
var closeParenthesis = 41; // `)`.charCodeAt(0);

tokenTypes.closeParenthesis = closeParenthesis;
var openSquare = 91; // `[`.charCodeAt(0);

tokenTypes.openSquare = openSquare;
var closeSquare = 93; // `]`.charCodeAt(0);

tokenTypes.closeSquare = closeSquare;
var dollar = 36; // `$`.charCodeAt(0);

tokenTypes.dollar = dollar;
var tilde = 126; // `~`.charCodeAt(0);

tokenTypes.tilde = tilde;
var caret = 94; // `^`.charCodeAt(0);

tokenTypes.caret = caret;
var plus = 43; // `+`.charCodeAt(0);

tokenTypes.plus = plus;
var equals = 61; // `=`.charCodeAt(0);

tokenTypes.equals = equals;
var pipe = 124; // `|`.charCodeAt(0);

tokenTypes.pipe = pipe;
var greaterThan = 62; // `>`.charCodeAt(0);

tokenTypes.greaterThan = greaterThan;
var space = 32; // ` `.charCodeAt(0);

tokenTypes.space = space;
var singleQuote = 39; // `'`.charCodeAt(0);

tokenTypes.singleQuote = singleQuote;
var doubleQuote = 34; // `"`.charCodeAt(0);

tokenTypes.doubleQuote = doubleQuote;
var slash = 47; // `/`.charCodeAt(0);

tokenTypes.slash = slash;
var bang = 33; // `!`.charCodeAt(0);

tokenTypes.bang = bang;
var backslash = 92; // '\\'.charCodeAt(0);

tokenTypes.backslash = backslash;
var cr = 13; // '\r'.charCodeAt(0);

tokenTypes.cr = cr;
var feed = 12; // '\f'.charCodeAt(0);

tokenTypes.feed = feed;
var newline = 10; // '\n'.charCodeAt(0);

tokenTypes.newline = newline;
var tab = 9; // '\t'.charCodeAt(0);
// Expose aliases primarily for readability.

tokenTypes.tab = tab;
var str = singleQuote; // No good single character representation!

tokenTypes.str = str;
var comment$1 = -1;
tokenTypes.comment = comment$1;
var word = -2;
tokenTypes.word = word;
var combinator$1 = -3;
tokenTypes.combinator = combinator$1;

(function (exports) {

  exports.__esModule = true;
  exports["default"] = tokenize;
  exports.FIELDS = void 0;

  var t = _interopRequireWildcard(tokenTypes);

  var _unescapable, _wordDelimiters;

  function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();

    _getRequireWildcardCache = function _getRequireWildcardCache() {
      return cache;
    };

    return cache;
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }

    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return {
        "default": obj
      };
    }

    var cache = _getRequireWildcardCache();

    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }

    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }

    newObj["default"] = obj;

    if (cache) {
      cache.set(obj, newObj);
    }

    return newObj;
  }

  var unescapable = (_unescapable = {}, _unescapable[t.tab] = true, _unescapable[t.newline] = true, _unescapable[t.cr] = true, _unescapable[t.feed] = true, _unescapable);
  var wordDelimiters = (_wordDelimiters = {}, _wordDelimiters[t.space] = true, _wordDelimiters[t.tab] = true, _wordDelimiters[t.newline] = true, _wordDelimiters[t.cr] = true, _wordDelimiters[t.feed] = true, _wordDelimiters[t.ampersand] = true, _wordDelimiters[t.asterisk] = true, _wordDelimiters[t.bang] = true, _wordDelimiters[t.comma] = true, _wordDelimiters[t.colon] = true, _wordDelimiters[t.semicolon] = true, _wordDelimiters[t.openParenthesis] = true, _wordDelimiters[t.closeParenthesis] = true, _wordDelimiters[t.openSquare] = true, _wordDelimiters[t.closeSquare] = true, _wordDelimiters[t.singleQuote] = true, _wordDelimiters[t.doubleQuote] = true, _wordDelimiters[t.plus] = true, _wordDelimiters[t.pipe] = true, _wordDelimiters[t.tilde] = true, _wordDelimiters[t.greaterThan] = true, _wordDelimiters[t.equals] = true, _wordDelimiters[t.dollar] = true, _wordDelimiters[t.caret] = true, _wordDelimiters[t.slash] = true, _wordDelimiters);
  var hex = {};
  var hexChars = "0123456789abcdefABCDEF";

  for (var i = 0; i < hexChars.length; i++) {
    hex[hexChars.charCodeAt(i)] = true;
  }
  /**
   *  Returns the last index of the bar css word
   * @param {string} css The string in which the word begins
   * @param {number} start The index into the string where word's first letter occurs
   */


  function consumeWord(css, start) {
    var next = start;
    var code;

    do {
      code = css.charCodeAt(next);

      if (wordDelimiters[code]) {
        return next - 1;
      } else if (code === t.backslash) {
        next = consumeEscape(css, next) + 1;
      } else {
        // All other characters are part of the word
        next++;
      }
    } while (next < css.length);

    return next - 1;
  }
  /**
   *  Returns the last index of the escape sequence
   * @param {string} css The string in which the sequence begins
   * @param {number} start The index into the string where escape character (`\`) occurs.
   */


  function consumeEscape(css, start) {
    var next = start;
    var code = css.charCodeAt(next + 1);

    if (unescapable[code]) ; else if (hex[code]) {
      var hexDigits = 0; // consume up to 6 hex chars

      do {
        next++;
        hexDigits++;
        code = css.charCodeAt(next + 1);
      } while (hex[code] && hexDigits < 6); // if fewer than 6 hex chars, a trailing space ends the escape


      if (hexDigits < 6 && code === t.space) {
        next++;
      }
    } else {
      // the next char is part of the current word
      next++;
    }

    return next;
  }

  var FIELDS = {
    TYPE: 0,
    START_LINE: 1,
    START_COL: 2,
    END_LINE: 3,
    END_COL: 4,
    START_POS: 5,
    END_POS: 6
  };
  exports.FIELDS = FIELDS;

  function tokenize(input) {
    var tokens = [];
    var css = input.css.valueOf();
    var _css = css,
        length = _css.length;
    var offset = -1;
    var line = 1;
    var start = 0;
    var end = 0;
    var code, content, endColumn, endLine, escaped, escapePos, last, lines, next, nextLine, nextOffset, quote, tokenType;

    function unclosed(what, fix) {
      if (input.safe) {
        // fyi: this is never set to true.
        css += fix;
        next = css.length - 1;
      } else {
        throw input.error('Unclosed ' + what, line, start - offset, start);
      }
    }

    while (start < length) {
      code = css.charCodeAt(start);

      if (code === t.newline) {
        offset = start;
        line += 1;
      }

      switch (code) {
        case t.space:
        case t.tab:
        case t.newline:
        case t.cr:
        case t.feed:
          next = start;

          do {
            next += 1;
            code = css.charCodeAt(next);

            if (code === t.newline) {
              offset = next;
              line += 1;
            }
          } while (code === t.space || code === t.newline || code === t.tab || code === t.cr || code === t.feed);

          tokenType = t.space;
          endLine = line;
          endColumn = next - offset - 1;
          end = next;
          break;

        case t.plus:
        case t.greaterThan:
        case t.tilde:
        case t.pipe:
          next = start;

          do {
            next += 1;
            code = css.charCodeAt(next);
          } while (code === t.plus || code === t.greaterThan || code === t.tilde || code === t.pipe);

          tokenType = t.combinator;
          endLine = line;
          endColumn = start - offset;
          end = next;
          break;
        // Consume these characters as single tokens.

        case t.asterisk:
        case t.ampersand:
        case t.bang:
        case t.comma:
        case t.equals:
        case t.dollar:
        case t.caret:
        case t.openSquare:
        case t.closeSquare:
        case t.colon:
        case t.semicolon:
        case t.openParenthesis:
        case t.closeParenthesis:
          next = start;
          tokenType = code;
          endLine = line;
          endColumn = start - offset;
          end = next + 1;
          break;

        case t.singleQuote:
        case t.doubleQuote:
          quote = code === t.singleQuote ? "'" : '"';
          next = start;

          do {
            escaped = false;
            next = css.indexOf(quote, next + 1);

            if (next === -1) {
              unclosed('quote', quote);
            }

            escapePos = next;

            while (css.charCodeAt(escapePos - 1) === t.backslash) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped);

          tokenType = t.str;
          endLine = line;
          endColumn = start - offset;
          end = next + 1;
          break;

        default:
          if (code === t.slash && css.charCodeAt(start + 1) === t.asterisk) {
            next = css.indexOf('*/', start + 2) + 1;

            if (next === 0) {
              unclosed('comment', '*/');
            }

            content = css.slice(start, next + 1);
            lines = content.split('\n');
            last = lines.length - 1;

            if (last > 0) {
              nextLine = line + last;
              nextOffset = next - lines[last].length;
            } else {
              nextLine = line;
              nextOffset = offset;
            }

            tokenType = t.comment;
            line = nextLine;
            endLine = nextLine;
            endColumn = next - nextOffset;
          } else if (code === t.slash) {
            next = start;
            tokenType = code;
            endLine = line;
            endColumn = start - offset;
            end = next + 1;
          } else {
            next = consumeWord(css, start);
            tokenType = t.word;
            endLine = line;
            endColumn = next - offset;
          }

          end = next + 1;
          break;
      } // Ensure that the token structure remains consistent


      tokens.push([tokenType, // [0] Token type
      line, // [1] Starting line
      start - offset, // [2] Starting column
      endLine, // [3] Ending line
      endColumn, // [4] Ending column
      start, // [5] Start position / Source index
      end // [6] End position
      ]); // Reset offset for the next token

      if (nextOffset) {
        offset = nextOffset;
        nextOffset = null;
      }

      start = end;
    }

    return tokens;
  }
})(tokenize);

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _root = _interopRequireDefault(root$1.exports);

  var _selector = _interopRequireDefault(selector$1.exports);

  var _className = _interopRequireDefault(className$1.exports);

  var _comment = _interopRequireDefault(comment$2.exports);

  var _id = _interopRequireDefault(id$1.exports);

  var _tag = _interopRequireDefault(tag$1.exports);

  var _string = _interopRequireDefault(string$1.exports);

  var _pseudo = _interopRequireDefault(pseudo$1.exports);

  var _attribute = _interopRequireWildcard(attribute$1);

  var _universal = _interopRequireDefault(universal$1.exports);

  var _combinator = _interopRequireDefault(combinator$2.exports);

  var _nesting = _interopRequireDefault(nesting$1.exports);

  var _sortAscending = _interopRequireDefault(sortAscending.exports);

  var _tokenize = _interopRequireWildcard(tokenize);

  var tokens = _interopRequireWildcard(tokenTypes);

  var types$1 = _interopRequireWildcard(types);

  var _util = util;

  var _WHITESPACE_TOKENS, _Object$assign;

  function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();

    _getRequireWildcardCache = function _getRequireWildcardCache() {
      return cache;
    };

    return cache;
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }

    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return {
        "default": obj
      };
    }

    var cache = _getRequireWildcardCache();

    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }

    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }

    newObj["default"] = obj;

    if (cache) {
      cache.set(obj, newObj);
    }

    return newObj;
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var WHITESPACE_TOKENS = (_WHITESPACE_TOKENS = {}, _WHITESPACE_TOKENS[tokens.space] = true, _WHITESPACE_TOKENS[tokens.cr] = true, _WHITESPACE_TOKENS[tokens.feed] = true, _WHITESPACE_TOKENS[tokens.newline] = true, _WHITESPACE_TOKENS[tokens.tab] = true, _WHITESPACE_TOKENS);
  var WHITESPACE_EQUIV_TOKENS = Object.assign({}, WHITESPACE_TOKENS, (_Object$assign = {}, _Object$assign[tokens.comment] = true, _Object$assign));

  function tokenStart(token) {
    return {
      line: token[_tokenize.FIELDS.START_LINE],
      column: token[_tokenize.FIELDS.START_COL]
    };
  }

  function tokenEnd(token) {
    return {
      line: token[_tokenize.FIELDS.END_LINE],
      column: token[_tokenize.FIELDS.END_COL]
    };
  }

  function getSource(startLine, startColumn, endLine, endColumn) {
    return {
      start: {
        line: startLine,
        column: startColumn
      },
      end: {
        line: endLine,
        column: endColumn
      }
    };
  }

  function getTokenSource(token) {
    return getSource(token[_tokenize.FIELDS.START_LINE], token[_tokenize.FIELDS.START_COL], token[_tokenize.FIELDS.END_LINE], token[_tokenize.FIELDS.END_COL]);
  }

  function getTokenSourceSpan(startToken, endToken) {
    if (!startToken) {
      return undefined;
    }

    return getSource(startToken[_tokenize.FIELDS.START_LINE], startToken[_tokenize.FIELDS.START_COL], endToken[_tokenize.FIELDS.END_LINE], endToken[_tokenize.FIELDS.END_COL]);
  }

  function unescapeProp(node, prop) {
    var value = node[prop];

    if (typeof value !== "string") {
      return;
    }

    if (value.indexOf("\\") !== -1) {
      (0, _util.ensureObject)(node, 'raws');
      node[prop] = (0, _util.unesc)(value);

      if (node.raws[prop] === undefined) {
        node.raws[prop] = value;
      }
    }

    return node;
  }

  function indexesOf(array, item) {
    var i = -1;
    var indexes = [];

    while ((i = array.indexOf(item, i + 1)) !== -1) {
      indexes.push(i);
    }

    return indexes;
  }

  function uniqs() {
    var list = Array.prototype.concat.apply([], arguments);
    return list.filter(function (item, i) {
      return i === list.indexOf(item);
    });
  }

  var Parser = /*#__PURE__*/function () {
    function Parser(rule, options) {
      if (options === void 0) {
        options = {};
      }

      this.rule = rule;
      this.options = Object.assign({
        lossy: false,
        safe: false
      }, options);
      this.position = 0;
      this.css = typeof this.rule === 'string' ? this.rule : this.rule.selector;
      this.tokens = (0, _tokenize["default"])({
        css: this.css,
        error: this._errorGenerator(),
        safe: this.options.safe
      });
      var rootSource = getTokenSourceSpan(this.tokens[0], this.tokens[this.tokens.length - 1]);
      this.root = new _root["default"]({
        source: rootSource
      });
      this.root.errorGenerator = this._errorGenerator();
      var selector = new _selector["default"]({
        source: {
          start: {
            line: 1,
            column: 1
          }
        }
      });
      this.root.append(selector);
      this.current = selector;
      this.loop();
    }

    var _proto = Parser.prototype;

    _proto._errorGenerator = function _errorGenerator() {
      var _this = this;

      return function (message, errorOptions) {
        if (typeof _this.rule === 'string') {
          return new Error(message);
        }

        return _this.rule.error(message, errorOptions);
      };
    };

    _proto.attribute = function attribute() {
      var attr = [];
      var startingToken = this.currToken;
      this.position++;

      while (this.position < this.tokens.length && this.currToken[_tokenize.FIELDS.TYPE] !== tokens.closeSquare) {
        attr.push(this.currToken);
        this.position++;
      }

      if (this.currToken[_tokenize.FIELDS.TYPE] !== tokens.closeSquare) {
        return this.expected('closing square bracket', this.currToken[_tokenize.FIELDS.START_POS]);
      }

      var len = attr.length;
      var node = {
        source: getSource(startingToken[1], startingToken[2], this.currToken[3], this.currToken[4]),
        sourceIndex: startingToken[_tokenize.FIELDS.START_POS]
      };

      if (len === 1 && !~[tokens.word].indexOf(attr[0][_tokenize.FIELDS.TYPE])) {
        return this.expected('attribute', attr[0][_tokenize.FIELDS.START_POS]);
      }

      var pos = 0;
      var spaceBefore = '';
      var commentBefore = '';
      var lastAdded = null;
      var spaceAfterMeaningfulToken = false;

      while (pos < len) {
        var token = attr[pos];
        var content = this.content(token);
        var next = attr[pos + 1];

        switch (token[_tokenize.FIELDS.TYPE]) {
          case tokens.space:
            // if (
            //     len === 1 ||
            //     pos === 0 && this.content(next) === '|'
            // ) {
            //     return this.expected('attribute', token[TOKEN.START_POS], content);
            // }
            spaceAfterMeaningfulToken = true;

            if (this.options.lossy) {
              break;
            }

            if (lastAdded) {
              (0, _util.ensureObject)(node, 'spaces', lastAdded);
              var prevContent = node.spaces[lastAdded].after || '';
              node.spaces[lastAdded].after = prevContent + content;
              var existingComment = (0, _util.getProp)(node, 'raws', 'spaces', lastAdded, 'after') || null;

              if (existingComment) {
                node.raws.spaces[lastAdded].after = existingComment + content;
              }
            } else {
              spaceBefore = spaceBefore + content;
              commentBefore = commentBefore + content;
            }

            break;

          case tokens.asterisk:
            if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
              node.operator = content;
              lastAdded = 'operator';
            } else if ((!node.namespace || lastAdded === "namespace" && !spaceAfterMeaningfulToken) && next) {
              if (spaceBefore) {
                (0, _util.ensureObject)(node, 'spaces', 'attribute');
                node.spaces.attribute.before = spaceBefore;
                spaceBefore = '';
              }

              if (commentBefore) {
                (0, _util.ensureObject)(node, 'raws', 'spaces', 'attribute');
                node.raws.spaces.attribute.before = spaceBefore;
                commentBefore = '';
              }

              node.namespace = (node.namespace || "") + content;
              var rawValue = (0, _util.getProp)(node, 'raws', 'namespace') || null;

              if (rawValue) {
                node.raws.namespace += content;
              }

              lastAdded = 'namespace';
            }

            spaceAfterMeaningfulToken = false;
            break;

          case tokens.dollar:
            if (lastAdded === "value") {
              var oldRawValue = (0, _util.getProp)(node, 'raws', 'value');
              node.value += "$";

              if (oldRawValue) {
                node.raws.value = oldRawValue + "$";
              }

              break;
            }

          // Falls through

          case tokens.caret:
            if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
              node.operator = content;
              lastAdded = 'operator';
            }

            spaceAfterMeaningfulToken = false;
            break;

          case tokens.combinator:
            if (content === '~' && next[_tokenize.FIELDS.TYPE] === tokens.equals) {
              node.operator = content;
              lastAdded = 'operator';
            }

            if (content !== '|') {
              spaceAfterMeaningfulToken = false;
              break;
            }

            if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
              node.operator = content;
              lastAdded = 'operator';
            } else if (!node.namespace && !node.attribute) {
              node.namespace = true;
            }

            spaceAfterMeaningfulToken = false;
            break;

          case tokens.word:
            if (next && this.content(next) === '|' && attr[pos + 2] && attr[pos + 2][_tokenize.FIELDS.TYPE] !== tokens.equals && // this look-ahead probably fails with comment nodes involved.
            !node.operator && !node.namespace) {
              node.namespace = content;
              lastAdded = 'namespace';
            } else if (!node.attribute || lastAdded === "attribute" && !spaceAfterMeaningfulToken) {
              if (spaceBefore) {
                (0, _util.ensureObject)(node, 'spaces', 'attribute');
                node.spaces.attribute.before = spaceBefore;
                spaceBefore = '';
              }

              if (commentBefore) {
                (0, _util.ensureObject)(node, 'raws', 'spaces', 'attribute');
                node.raws.spaces.attribute.before = commentBefore;
                commentBefore = '';
              }

              node.attribute = (node.attribute || "") + content;

              var _rawValue = (0, _util.getProp)(node, 'raws', 'attribute') || null;

              if (_rawValue) {
                node.raws.attribute += content;
              }

              lastAdded = 'attribute';
            } else if (!node.value && node.value !== "" || lastAdded === "value" && !spaceAfterMeaningfulToken) {
              var _unescaped = (0, _util.unesc)(content);

              var _oldRawValue = (0, _util.getProp)(node, 'raws', 'value') || '';

              var oldValue = node.value || '';
              node.value = oldValue + _unescaped;
              node.quoteMark = null;

              if (_unescaped !== content || _oldRawValue) {
                (0, _util.ensureObject)(node, 'raws');
                node.raws.value = (_oldRawValue || oldValue) + content;
              }

              lastAdded = 'value';
            } else {
              var insensitive = content === 'i' || content === "I";

              if ((node.value || node.value === '') && (node.quoteMark || spaceAfterMeaningfulToken)) {
                node.insensitive = insensitive;

                if (!insensitive || content === "I") {
                  (0, _util.ensureObject)(node, 'raws');
                  node.raws.insensitiveFlag = content;
                }

                lastAdded = 'insensitive';

                if (spaceBefore) {
                  (0, _util.ensureObject)(node, 'spaces', 'insensitive');
                  node.spaces.insensitive.before = spaceBefore;
                  spaceBefore = '';
                }

                if (commentBefore) {
                  (0, _util.ensureObject)(node, 'raws', 'spaces', 'insensitive');
                  node.raws.spaces.insensitive.before = commentBefore;
                  commentBefore = '';
                }
              } else if (node.value || node.value === '') {
                lastAdded = 'value';
                node.value += content;

                if (node.raws.value) {
                  node.raws.value += content;
                }
              }
            }

            spaceAfterMeaningfulToken = false;
            break;

          case tokens.str:
            if (!node.attribute || !node.operator) {
              return this.error("Expected an attribute followed by an operator preceding the string.", {
                index: token[_tokenize.FIELDS.START_POS]
              });
            }

            var _unescapeValue = (0, _attribute.unescapeValue)(content),
                unescaped = _unescapeValue.unescaped,
                quoteMark = _unescapeValue.quoteMark;

            node.value = unescaped;
            node.quoteMark = quoteMark;
            lastAdded = 'value';
            (0, _util.ensureObject)(node, 'raws');
            node.raws.value = content;
            spaceAfterMeaningfulToken = false;
            break;

          case tokens.equals:
            if (!node.attribute) {
              return this.expected('attribute', token[_tokenize.FIELDS.START_POS], content);
            }

            if (node.value) {
              return this.error('Unexpected "=" found; an operator was already defined.', {
                index: token[_tokenize.FIELDS.START_POS]
              });
            }

            node.operator = node.operator ? node.operator + content : content;
            lastAdded = 'operator';
            spaceAfterMeaningfulToken = false;
            break;

          case tokens.comment:
            if (lastAdded) {
              if (spaceAfterMeaningfulToken || next && next[_tokenize.FIELDS.TYPE] === tokens.space || lastAdded === 'insensitive') {
                var lastComment = (0, _util.getProp)(node, 'spaces', lastAdded, 'after') || '';
                var rawLastComment = (0, _util.getProp)(node, 'raws', 'spaces', lastAdded, 'after') || lastComment;
                (0, _util.ensureObject)(node, 'raws', 'spaces', lastAdded);
                node.raws.spaces[lastAdded].after = rawLastComment + content;
              } else {
                var lastValue = node[lastAdded] || '';
                var rawLastValue = (0, _util.getProp)(node, 'raws', lastAdded) || lastValue;
                (0, _util.ensureObject)(node, 'raws');
                node.raws[lastAdded] = rawLastValue + content;
              }
            } else {
              commentBefore = commentBefore + content;
            }

            break;

          default:
            return this.error("Unexpected \"" + content + "\" found.", {
              index: token[_tokenize.FIELDS.START_POS]
            });
        }

        pos++;
      }

      unescapeProp(node, "attribute");
      unescapeProp(node, "namespace");
      this.newNode(new _attribute["default"](node));
      this.position++;
    }
    /**
     * return a node containing meaningless garbage up to (but not including) the specified token position.
     * if the token position is negative, all remaining tokens are consumed.
     *
     * This returns an array containing a single string node if all whitespace,
     * otherwise an array of comment nodes with space before and after.
     *
     * These tokens are not added to the current selector, the caller can add them or use them to amend
     * a previous node's space metadata.
     *
     * In lossy mode, this returns only comments.
     */
    ;

    _proto.parseWhitespaceEquivalentTokens = function parseWhitespaceEquivalentTokens(stopPosition) {
      if (stopPosition < 0) {
        stopPosition = this.tokens.length;
      }

      var startPosition = this.position;
      var nodes = [];
      var space = "";
      var lastComment = undefined;

      do {
        if (WHITESPACE_TOKENS[this.currToken[_tokenize.FIELDS.TYPE]]) {
          if (!this.options.lossy) {
            space += this.content();
          }
        } else if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.comment) {
          var spaces = {};

          if (space) {
            spaces.before = space;
            space = "";
          }

          lastComment = new _comment["default"]({
            value: this.content(),
            source: getTokenSource(this.currToken),
            sourceIndex: this.currToken[_tokenize.FIELDS.START_POS],
            spaces: spaces
          });
          nodes.push(lastComment);
        }
      } while (++this.position < stopPosition);

      if (space) {
        if (lastComment) {
          lastComment.spaces.after = space;
        } else if (!this.options.lossy) {
          var firstToken = this.tokens[startPosition];
          var lastToken = this.tokens[this.position - 1];
          nodes.push(new _string["default"]({
            value: '',
            source: getSource(firstToken[_tokenize.FIELDS.START_LINE], firstToken[_tokenize.FIELDS.START_COL], lastToken[_tokenize.FIELDS.END_LINE], lastToken[_tokenize.FIELDS.END_COL]),
            sourceIndex: firstToken[_tokenize.FIELDS.START_POS],
            spaces: {
              before: space,
              after: ''
            }
          }));
        }
      }

      return nodes;
    }
    /**
     * 
     * @param {*} nodes 
     */
    ;

    _proto.convertWhitespaceNodesToSpace = function convertWhitespaceNodesToSpace(nodes, requiredSpace) {
      var _this2 = this;

      if (requiredSpace === void 0) {
        requiredSpace = false;
      }

      var space = "";
      var rawSpace = "";
      nodes.forEach(function (n) {
        var spaceBefore = _this2.lossySpace(n.spaces.before, requiredSpace);

        var rawSpaceBefore = _this2.lossySpace(n.rawSpaceBefore, requiredSpace);

        space += spaceBefore + _this2.lossySpace(n.spaces.after, requiredSpace && spaceBefore.length === 0);
        rawSpace += spaceBefore + n.value + _this2.lossySpace(n.rawSpaceAfter, requiredSpace && rawSpaceBefore.length === 0);
      });

      if (rawSpace === space) {
        rawSpace = undefined;
      }

      var result = {
        space: space,
        rawSpace: rawSpace
      };
      return result;
    };

    _proto.isNamedCombinator = function isNamedCombinator(position) {
      if (position === void 0) {
        position = this.position;
      }

      return this.tokens[position + 0] && this.tokens[position + 0][_tokenize.FIELDS.TYPE] === tokens.slash && this.tokens[position + 1] && this.tokens[position + 1][_tokenize.FIELDS.TYPE] === tokens.word && this.tokens[position + 2] && this.tokens[position + 2][_tokenize.FIELDS.TYPE] === tokens.slash;
    };

    _proto.namedCombinator = function namedCombinator() {
      if (this.isNamedCombinator()) {
        var nameRaw = this.content(this.tokens[this.position + 1]);
        var name = (0, _util.unesc)(nameRaw).toLowerCase();
        var raws = {};

        if (name !== nameRaw) {
          raws.value = "/" + nameRaw + "/";
        }

        var node = new _combinator["default"]({
          value: "/" + name + "/",
          source: getSource(this.currToken[_tokenize.FIELDS.START_LINE], this.currToken[_tokenize.FIELDS.START_COL], this.tokens[this.position + 2][_tokenize.FIELDS.END_LINE], this.tokens[this.position + 2][_tokenize.FIELDS.END_COL]),
          sourceIndex: this.currToken[_tokenize.FIELDS.START_POS],
          raws: raws
        });
        this.position = this.position + 3;
        return node;
      } else {
        this.unexpected();
      }
    };

    _proto.combinator = function combinator() {
      var _this3 = this;

      if (this.content() === '|') {
        return this.namespace();
      } // We need to decide between a space that's a descendant combinator and meaningless whitespace at the end of a selector.


      var nextSigTokenPos = this.locateNextMeaningfulToken(this.position);

      if (nextSigTokenPos < 0 || this.tokens[nextSigTokenPos][_tokenize.FIELDS.TYPE] === tokens.comma) {
        var nodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);

        if (nodes.length > 0) {
          var last = this.current.last;

          if (last) {
            var _this$convertWhitespa = this.convertWhitespaceNodesToSpace(nodes),
                space = _this$convertWhitespa.space,
                rawSpace = _this$convertWhitespa.rawSpace;

            if (rawSpace !== undefined) {
              last.rawSpaceAfter += rawSpace;
            }

            last.spaces.after += space;
          } else {
            nodes.forEach(function (n) {
              return _this3.newNode(n);
            });
          }
        }

        return;
      }

      var firstToken = this.currToken;
      var spaceOrDescendantSelectorNodes = undefined;

      if (nextSigTokenPos > this.position) {
        spaceOrDescendantSelectorNodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
      }

      var node;

      if (this.isNamedCombinator()) {
        node = this.namedCombinator();
      } else if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.combinator) {
        node = new _combinator["default"]({
          value: this.content(),
          source: getTokenSource(this.currToken),
          sourceIndex: this.currToken[_tokenize.FIELDS.START_POS]
        });
        this.position++;
      } else if (WHITESPACE_TOKENS[this.currToken[_tokenize.FIELDS.TYPE]]) ; else if (!spaceOrDescendantSelectorNodes) {
        this.unexpected();
      }

      if (node) {
        if (spaceOrDescendantSelectorNodes) {
          var _this$convertWhitespa2 = this.convertWhitespaceNodesToSpace(spaceOrDescendantSelectorNodes),
              _space = _this$convertWhitespa2.space,
              _rawSpace = _this$convertWhitespa2.rawSpace;

          node.spaces.before = _space;
          node.rawSpaceBefore = _rawSpace;
        }
      } else {
        // descendant combinator
        var _this$convertWhitespa3 = this.convertWhitespaceNodesToSpace(spaceOrDescendantSelectorNodes, true),
            _space2 = _this$convertWhitespa3.space,
            _rawSpace2 = _this$convertWhitespa3.rawSpace;

        if (!_rawSpace2) {
          _rawSpace2 = _space2;
        }

        var spaces = {};
        var raws = {
          spaces: {}
        };

        if (_space2.endsWith(' ') && _rawSpace2.endsWith(' ')) {
          spaces.before = _space2.slice(0, _space2.length - 1);
          raws.spaces.before = _rawSpace2.slice(0, _rawSpace2.length - 1);
        } else if (_space2.startsWith(' ') && _rawSpace2.startsWith(' ')) {
          spaces.after = _space2.slice(1);
          raws.spaces.after = _rawSpace2.slice(1);
        } else {
          raws.value = _rawSpace2;
        }

        node = new _combinator["default"]({
          value: ' ',
          source: getTokenSourceSpan(firstToken, this.tokens[this.position - 1]),
          sourceIndex: firstToken[_tokenize.FIELDS.START_POS],
          spaces: spaces,
          raws: raws
        });
      }

      if (this.currToken && this.currToken[_tokenize.FIELDS.TYPE] === tokens.space) {
        node.spaces.after = this.optionalSpace(this.content());
        this.position++;
      }

      return this.newNode(node);
    };

    _proto.comma = function comma() {
      if (this.position === this.tokens.length - 1) {
        this.root.trailingComma = true;
        this.position++;
        return;
      }

      this.current._inferEndPosition();

      var selector = new _selector["default"]({
        source: {
          start: tokenStart(this.tokens[this.position + 1])
        }
      });
      this.current.parent.append(selector);
      this.current = selector;
      this.position++;
    };

    _proto.comment = function comment() {
      var current = this.currToken;
      this.newNode(new _comment["default"]({
        value: this.content(),
        source: getTokenSource(current),
        sourceIndex: current[_tokenize.FIELDS.START_POS]
      }));
      this.position++;
    };

    _proto.error = function error(message, opts) {
      throw this.root.error(message, opts);
    };

    _proto.missingBackslash = function missingBackslash() {
      return this.error('Expected a backslash preceding the semicolon.', {
        index: this.currToken[_tokenize.FIELDS.START_POS]
      });
    };

    _proto.missingParenthesis = function missingParenthesis() {
      return this.expected('opening parenthesis', this.currToken[_tokenize.FIELDS.START_POS]);
    };

    _proto.missingSquareBracket = function missingSquareBracket() {
      return this.expected('opening square bracket', this.currToken[_tokenize.FIELDS.START_POS]);
    };

    _proto.unexpected = function unexpected() {
      return this.error("Unexpected '" + this.content() + "'. Escaping special characters with \\ may help.", this.currToken[_tokenize.FIELDS.START_POS]);
    };

    _proto.namespace = function namespace() {
      var before = this.prevToken && this.content(this.prevToken) || true;

      if (this.nextToken[_tokenize.FIELDS.TYPE] === tokens.word) {
        this.position++;
        return this.word(before);
      } else if (this.nextToken[_tokenize.FIELDS.TYPE] === tokens.asterisk) {
        this.position++;
        return this.universal(before);
      }
    };

    _proto.nesting = function nesting() {
      if (this.nextToken) {
        var nextContent = this.content(this.nextToken);

        if (nextContent === "|") {
          this.position++;
          return;
        }
      }

      var current = this.currToken;
      this.newNode(new _nesting["default"]({
        value: this.content(),
        source: getTokenSource(current),
        sourceIndex: current[_tokenize.FIELDS.START_POS]
      }));
      this.position++;
    };

    _proto.parentheses = function parentheses() {
      var last = this.current.last;
      var unbalanced = 1;
      this.position++;

      if (last && last.type === types$1.PSEUDO) {
        var selector = new _selector["default"]({
          source: {
            start: tokenStart(this.tokens[this.position - 1])
          }
        });
        var cache = this.current;
        last.append(selector);
        this.current = selector;

        while (this.position < this.tokens.length && unbalanced) {
          if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis) {
            unbalanced++;
          }

          if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.closeParenthesis) {
            unbalanced--;
          }

          if (unbalanced) {
            this.parse();
          } else {
            this.current.source.end = tokenEnd(this.currToken);
            this.current.parent.source.end = tokenEnd(this.currToken);
            this.position++;
          }
        }

        this.current = cache;
      } else {
        // I think this case should be an error. It's used to implement a basic parse of media queries
        // but I don't think it's a good idea.
        var parenStart = this.currToken;
        var parenValue = "(";
        var parenEnd;

        while (this.position < this.tokens.length && unbalanced) {
          if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis) {
            unbalanced++;
          }

          if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.closeParenthesis) {
            unbalanced--;
          }

          parenEnd = this.currToken;
          parenValue += this.parseParenthesisToken(this.currToken);
          this.position++;
        }

        if (last) {
          last.appendToPropertyAndEscape("value", parenValue, parenValue);
        } else {
          this.newNode(new _string["default"]({
            value: parenValue,
            source: getSource(parenStart[_tokenize.FIELDS.START_LINE], parenStart[_tokenize.FIELDS.START_COL], parenEnd[_tokenize.FIELDS.END_LINE], parenEnd[_tokenize.FIELDS.END_COL]),
            sourceIndex: parenStart[_tokenize.FIELDS.START_POS]
          }));
        }
      }

      if (unbalanced) {
        return this.expected('closing parenthesis', this.currToken[_tokenize.FIELDS.START_POS]);
      }
    };

    _proto.pseudo = function pseudo() {
      var _this4 = this;

      var pseudoStr = '';
      var startingToken = this.currToken;

      while (this.currToken && this.currToken[_tokenize.FIELDS.TYPE] === tokens.colon) {
        pseudoStr += this.content();
        this.position++;
      }

      if (!this.currToken) {
        return this.expected(['pseudo-class', 'pseudo-element'], this.position - 1);
      }

      if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.word) {
        this.splitWord(false, function (first, length) {
          pseudoStr += first;

          _this4.newNode(new _pseudo["default"]({
            value: pseudoStr,
            source: getTokenSourceSpan(startingToken, _this4.currToken),
            sourceIndex: startingToken[_tokenize.FIELDS.START_POS]
          }));

          if (length > 1 && _this4.nextToken && _this4.nextToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis) {
            _this4.error('Misplaced parenthesis.', {
              index: _this4.nextToken[_tokenize.FIELDS.START_POS]
            });
          }
        });
      } else {
        return this.expected(['pseudo-class', 'pseudo-element'], this.currToken[_tokenize.FIELDS.START_POS]);
      }
    };

    _proto.space = function space() {
      var content = this.content(); // Handle space before and after the selector

      if (this.position === 0 || this.prevToken[_tokenize.FIELDS.TYPE] === tokens.comma || this.prevToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis || this.current.nodes.every(function (node) {
        return node.type === 'comment';
      })) {
        this.spaces = this.optionalSpace(content);
        this.position++;
      } else if (this.position === this.tokens.length - 1 || this.nextToken[_tokenize.FIELDS.TYPE] === tokens.comma || this.nextToken[_tokenize.FIELDS.TYPE] === tokens.closeParenthesis) {
        this.current.last.spaces.after = this.optionalSpace(content);
        this.position++;
      } else {
        this.combinator();
      }
    };

    _proto.string = function string() {
      var current = this.currToken;
      this.newNode(new _string["default"]({
        value: this.content(),
        source: getTokenSource(current),
        sourceIndex: current[_tokenize.FIELDS.START_POS]
      }));
      this.position++;
    };

    _proto.universal = function universal(namespace) {
      var nextToken = this.nextToken;

      if (nextToken && this.content(nextToken) === '|') {
        this.position++;
        return this.namespace();
      }

      var current = this.currToken;
      this.newNode(new _universal["default"]({
        value: this.content(),
        source: getTokenSource(current),
        sourceIndex: current[_tokenize.FIELDS.START_POS]
      }), namespace);
      this.position++;
    };

    _proto.splitWord = function splitWord(namespace, firstCallback) {
      var _this5 = this;

      var nextToken = this.nextToken;
      var word = this.content();

      while (nextToken && ~[tokens.dollar, tokens.caret, tokens.equals, tokens.word].indexOf(nextToken[_tokenize.FIELDS.TYPE])) {
        this.position++;
        var current = this.content();
        word += current;

        if (current.lastIndexOf('\\') === current.length - 1) {
          var next = this.nextToken;

          if (next && next[_tokenize.FIELDS.TYPE] === tokens.space) {
            word += this.requiredSpace(this.content(next));
            this.position++;
          }
        }

        nextToken = this.nextToken;
      }

      var hasClass = indexesOf(word, '.').filter(function (i) {
        // Allow escaped dot within class name
        var escapedDot = word[i - 1] === '\\'; // Allow decimal numbers percent in @keyframes

        var isKeyframesPercent = /^\d+\.\d+%$/.test(word);
        return !escapedDot && !isKeyframesPercent;
      });
      var hasId = indexesOf(word, '#').filter(function (i) {
        return word[i - 1] !== '\\';
      }); // Eliminate Sass interpolations from the list of id indexes

      var interpolations = indexesOf(word, '#{');

      if (interpolations.length) {
        hasId = hasId.filter(function (hashIndex) {
          return !~interpolations.indexOf(hashIndex);
        });
      }

      var indices = (0, _sortAscending["default"])(uniqs([0].concat(hasClass, hasId)));
      indices.forEach(function (ind, i) {
        var index = indices[i + 1] || word.length;
        var value = word.slice(ind, index);

        if (i === 0 && firstCallback) {
          return firstCallback.call(_this5, value, indices.length);
        }

        var node;
        var current = _this5.currToken;
        var sourceIndex = current[_tokenize.FIELDS.START_POS] + indices[i];
        var source = getSource(current[1], current[2] + ind, current[3], current[2] + (index - 1));

        if (~hasClass.indexOf(ind)) {
          var classNameOpts = {
            value: value.slice(1),
            source: source,
            sourceIndex: sourceIndex
          };
          node = new _className["default"](unescapeProp(classNameOpts, "value"));
        } else if (~hasId.indexOf(ind)) {
          var idOpts = {
            value: value.slice(1),
            source: source,
            sourceIndex: sourceIndex
          };
          node = new _id["default"](unescapeProp(idOpts, "value"));
        } else {
          var tagOpts = {
            value: value,
            source: source,
            sourceIndex: sourceIndex
          };
          unescapeProp(tagOpts, "value");
          node = new _tag["default"](tagOpts);
        }

        _this5.newNode(node, namespace); // Ensure that the namespace is used only once


        namespace = null;
      });
      this.position++;
    };

    _proto.word = function word(namespace) {
      var nextToken = this.nextToken;

      if (nextToken && this.content(nextToken) === '|') {
        this.position++;
        return this.namespace();
      }

      return this.splitWord(namespace);
    };

    _proto.loop = function loop() {
      while (this.position < this.tokens.length) {
        this.parse(true);
      }

      this.current._inferEndPosition();

      return this.root;
    };

    _proto.parse = function parse(throwOnParenthesis) {
      switch (this.currToken[_tokenize.FIELDS.TYPE]) {
        case tokens.space:
          this.space();
          break;

        case tokens.comment:
          this.comment();
          break;

        case tokens.openParenthesis:
          this.parentheses();
          break;

        case tokens.closeParenthesis:
          if (throwOnParenthesis) {
            this.missingParenthesis();
          }

          break;

        case tokens.openSquare:
          this.attribute();
          break;

        case tokens.dollar:
        case tokens.caret:
        case tokens.equals:
        case tokens.word:
          this.word();
          break;

        case tokens.colon:
          this.pseudo();
          break;

        case tokens.comma:
          this.comma();
          break;

        case tokens.asterisk:
          this.universal();
          break;

        case tokens.ampersand:
          this.nesting();
          break;

        case tokens.slash:
        case tokens.combinator:
          this.combinator();
          break;

        case tokens.str:
          this.string();
          break;
        // These cases throw; no break needed.

        case tokens.closeSquare:
          this.missingSquareBracket();

        case tokens.semicolon:
          this.missingBackslash();

        default:
          this.unexpected();
      }
    }
    /**
     * Helpers
     */
    ;

    _proto.expected = function expected(description, index, found) {
      if (Array.isArray(description)) {
        var last = description.pop();
        description = description.join(', ') + " or " + last;
      }

      var an = /^[aeiou]/.test(description[0]) ? 'an' : 'a';

      if (!found) {
        return this.error("Expected " + an + " " + description + ".", {
          index: index
        });
      }

      return this.error("Expected " + an + " " + description + ", found \"" + found + "\" instead.", {
        index: index
      });
    };

    _proto.requiredSpace = function requiredSpace(space) {
      return this.options.lossy ? ' ' : space;
    };

    _proto.optionalSpace = function optionalSpace(space) {
      return this.options.lossy ? '' : space;
    };

    _proto.lossySpace = function lossySpace(space, required) {
      if (this.options.lossy) {
        return required ? ' ' : '';
      } else {
        return space;
      }
    };

    _proto.parseParenthesisToken = function parseParenthesisToken(token) {
      var content = this.content(token);

      if (token[_tokenize.FIELDS.TYPE] === tokens.space) {
        return this.requiredSpace(content);
      } else {
        return content;
      }
    };

    _proto.newNode = function newNode(node, namespace) {
      if (namespace) {
        if (/^ +$/.test(namespace)) {
          if (!this.options.lossy) {
            this.spaces = (this.spaces || '') + namespace;
          }

          namespace = true;
        }

        node.namespace = namespace;
        unescapeProp(node, "namespace");
      }

      if (this.spaces) {
        node.spaces.before = this.spaces;
        this.spaces = '';
      }

      return this.current.append(node);
    };

    _proto.content = function content(token) {
      if (token === void 0) {
        token = this.currToken;
      }

      return this.css.slice(token[_tokenize.FIELDS.START_POS], token[_tokenize.FIELDS.END_POS]);
    };
    /**
     * returns the index of the next non-whitespace, non-comment token.
     * returns -1 if no meaningful token is found.
     */


    _proto.locateNextMeaningfulToken = function locateNextMeaningfulToken(startPosition) {
      if (startPosition === void 0) {
        startPosition = this.position + 1;
      }

      var searchPosition = startPosition;

      while (searchPosition < this.tokens.length) {
        if (WHITESPACE_EQUIV_TOKENS[this.tokens[searchPosition][_tokenize.FIELDS.TYPE]]) {
          searchPosition++;
          continue;
        } else {
          return searchPosition;
        }
      }

      return -1;
    };

    _createClass(Parser, [{
      key: "currToken",
      get: function get() {
        return this.tokens[this.position];
      }
    }, {
      key: "nextToken",
      get: function get() {
        return this.tokens[this.position + 1];
      }
    }, {
      key: "prevToken",
      get: function get() {
        return this.tokens[this.position - 1];
      }
    }]);

    return Parser;
  }();

  exports["default"] = Parser;
  module.exports = exports.default;
})(parser$1, parser$1.exports);

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _parser = _interopRequireDefault(parser$1.exports);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  var Processor = /*#__PURE__*/function () {
    function Processor(func, options) {
      this.func = func || function noop() {};

      this.funcRes = null;
      this.options = options;
    }

    var _proto = Processor.prototype;

    _proto._shouldUpdateSelector = function _shouldUpdateSelector(rule, options) {
      if (options === void 0) {
        options = {};
      }

      var merged = Object.assign({}, this.options, options);

      if (merged.updateSelector === false) {
        return false;
      } else {
        return typeof rule !== "string";
      }
    };

    _proto._isLossy = function _isLossy(options) {
      if (options === void 0) {
        options = {};
      }

      var merged = Object.assign({}, this.options, options);

      if (merged.lossless === false) {
        return true;
      } else {
        return false;
      }
    };

    _proto._root = function _root(rule, options) {
      if (options === void 0) {
        options = {};
      }

      var parser = new _parser["default"](rule, this._parseOptions(options));
      return parser.root;
    };

    _proto._parseOptions = function _parseOptions(options) {
      return {
        lossy: this._isLossy(options)
      };
    };

    _proto._run = function _run(rule, options) {
      var _this = this;

      if (options === void 0) {
        options = {};
      }

      return new Promise(function (resolve, reject) {
        try {
          var root = _this._root(rule, options);

          Promise.resolve(_this.func(root)).then(function (transform) {
            var string = undefined;

            if (_this._shouldUpdateSelector(rule, options)) {
              string = root.toString();
              rule.selector = string;
            }

            return {
              transform: transform,
              root: root,
              string: string
            };
          }).then(resolve, reject);
        } catch (e) {
          reject(e);
          return;
        }
      });
    };

    _proto._runSync = function _runSync(rule, options) {
      if (options === void 0) {
        options = {};
      }

      var root = this._root(rule, options);

      var transform = this.func(root);

      if (transform && typeof transform.then === "function") {
        throw new Error("Selector processor returned a promise to a synchronous call.");
      }

      var string = undefined;

      if (options.updateSelector && typeof rule !== "string") {
        string = root.toString();
        rule.selector = string;
      }

      return {
        transform: transform,
        root: root,
        string: string
      };
    }
    /**
     * Process rule into a selector AST.
     *
     * @param rule {postcss.Rule | string} The css selector to be processed
     * @param options The options for processing
     * @returns {Promise<parser.Root>} The AST of the selector after processing it.
     */
    ;

    _proto.ast = function ast(rule, options) {
      return this._run(rule, options).then(function (result) {
        return result.root;
      });
    }
    /**
     * Process rule into a selector AST synchronously.
     *
     * @param rule {postcss.Rule | string} The css selector to be processed
     * @param options The options for processing
     * @returns {parser.Root} The AST of the selector after processing it.
     */
    ;

    _proto.astSync = function astSync(rule, options) {
      return this._runSync(rule, options).root;
    }
    /**
     * Process a selector into a transformed value asynchronously
     *
     * @param rule {postcss.Rule | string} The css selector to be processed
     * @param options The options for processing
     * @returns {Promise<any>} The value returned by the processor.
     */
    ;

    _proto.transform = function transform(rule, options) {
      return this._run(rule, options).then(function (result) {
        return result.transform;
      });
    }
    /**
     * Process a selector into a transformed value synchronously.
     *
     * @param rule {postcss.Rule | string} The css selector to be processed
     * @param options The options for processing
     * @returns {any} The value returned by the processor.
     */
    ;

    _proto.transformSync = function transformSync(rule, options) {
      return this._runSync(rule, options).transform;
    }
    /**
     * Process a selector into a new selector string asynchronously.
     *
     * @param rule {postcss.Rule | string} The css selector to be processed
     * @param options The options for processing
     * @returns {string} the selector after processing.
     */
    ;

    _proto.process = function process(rule, options) {
      return this._run(rule, options).then(function (result) {
        return result.string || result.root.toString();
      });
    }
    /**
     * Process a selector into a new selector string synchronously.
     *
     * @param rule {postcss.Rule | string} The css selector to be processed
     * @param options The options for processing
     * @returns {string} the selector after processing.
     */
    ;

    _proto.processSync = function processSync(rule, options) {
      var result = this._runSync(rule, options);

      return result.string || result.root.toString();
    };

    return Processor;
  }();

  exports["default"] = Processor;
  module.exports = exports.default;
})(processor, processor.exports);

var selectors = {};

var constructors = {};

constructors.__esModule = true;
constructors.universal = constructors.tag = constructors.string = constructors.selector = constructors.root = constructors.pseudo = constructors.nesting = constructors.id = constructors.comment = constructors.combinator = constructors.className = constructors.attribute = void 0;

var _attribute = _interopRequireDefault(attribute$1);

var _className = _interopRequireDefault(className$1.exports);

var _combinator = _interopRequireDefault(combinator$2.exports);

var _comment = _interopRequireDefault(comment$2.exports);

var _id = _interopRequireDefault(id$1.exports);

var _nesting = _interopRequireDefault(nesting$1.exports);

var _pseudo = _interopRequireDefault(pseudo$1.exports);

var _root = _interopRequireDefault(root$1.exports);

var _selector = _interopRequireDefault(selector$1.exports);

var _string = _interopRequireDefault(string$1.exports);

var _tag = _interopRequireDefault(tag$1.exports);

var _universal = _interopRequireDefault(universal$1.exports);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

var attribute = function attribute(opts) {
  return new _attribute["default"](opts);
};

constructors.attribute = attribute;

var className = function className(opts) {
  return new _className["default"](opts);
};

constructors.className = className;

var combinator = function combinator(opts) {
  return new _combinator["default"](opts);
};

constructors.combinator = combinator;

var comment = function comment(opts) {
  return new _comment["default"](opts);
};

constructors.comment = comment;

var id = function id(opts) {
  return new _id["default"](opts);
};

constructors.id = id;

var nesting = function nesting(opts) {
  return new _nesting["default"](opts);
};

constructors.nesting = nesting;

var pseudo = function pseudo(opts) {
  return new _pseudo["default"](opts);
};

constructors.pseudo = pseudo;

var root = function root(opts) {
  return new _root["default"](opts);
};

constructors.root = root;

var selector = function selector(opts) {
  return new _selector["default"](opts);
};

constructors.selector = selector;

var string = function string(opts) {
  return new _string["default"](opts);
};

constructors.string = string;

var tag = function tag(opts) {
  return new _tag["default"](opts);
};

constructors.tag = tag;

var universal = function universal(opts) {
  return new _universal["default"](opts);
};

constructors.universal = universal;

var guards = {};

guards.__esModule = true;
guards.isNode = isNode;
guards.isPseudoElement = isPseudoElement;
guards.isPseudoClass = isPseudoClass;
guards.isContainer = isContainer;
guards.isNamespace = isNamespace;
guards.isUniversal = guards.isTag = guards.isString = guards.isSelector = guards.isRoot = guards.isPseudo = guards.isNesting = guards.isIdentifier = guards.isComment = guards.isCombinator = guards.isClassName = guards.isAttribute = void 0;
var _types = types;

var _IS_TYPE;

var IS_TYPE = (_IS_TYPE = {}, _IS_TYPE[_types.ATTRIBUTE] = true, _IS_TYPE[_types.CLASS] = true, _IS_TYPE[_types.COMBINATOR] = true, _IS_TYPE[_types.COMMENT] = true, _IS_TYPE[_types.ID] = true, _IS_TYPE[_types.NESTING] = true, _IS_TYPE[_types.PSEUDO] = true, _IS_TYPE[_types.ROOT] = true, _IS_TYPE[_types.SELECTOR] = true, _IS_TYPE[_types.STRING] = true, _IS_TYPE[_types.TAG] = true, _IS_TYPE[_types.UNIVERSAL] = true, _IS_TYPE);

function isNode(node) {
  return typeof node === "object" && IS_TYPE[node.type];
}

function isNodeType(type, node) {
  return isNode(node) && node.type === type;
}

var isAttribute = isNodeType.bind(null, _types.ATTRIBUTE);
guards.isAttribute = isAttribute;
var isClassName = isNodeType.bind(null, _types.CLASS);
guards.isClassName = isClassName;
var isCombinator = isNodeType.bind(null, _types.COMBINATOR);
guards.isCombinator = isCombinator;
var isComment = isNodeType.bind(null, _types.COMMENT);
guards.isComment = isComment;
var isIdentifier = isNodeType.bind(null, _types.ID);
guards.isIdentifier = isIdentifier;
var isNesting = isNodeType.bind(null, _types.NESTING);
guards.isNesting = isNesting;
var isPseudo$1 = isNodeType.bind(null, _types.PSEUDO);
guards.isPseudo = isPseudo$1;
var isRoot = isNodeType.bind(null, _types.ROOT);
guards.isRoot = isRoot;
var isSelector = isNodeType.bind(null, _types.SELECTOR);
guards.isSelector = isSelector;
var isString = isNodeType.bind(null, _types.STRING);
guards.isString = isString;
var isTag = isNodeType.bind(null, _types.TAG);
guards.isTag = isTag;
var isUniversal = isNodeType.bind(null, _types.UNIVERSAL);
guards.isUniversal = isUniversal;

function isPseudoElement(node) {
  return isPseudo$1(node) && node.value && (node.value.startsWith("::") || node.value.toLowerCase() === ":before" || node.value.toLowerCase() === ":after");
}

function isPseudoClass(node) {
  return isPseudo$1(node) && !isPseudoElement(node);
}

function isContainer(node) {
  return !!(isNode(node) && node.walk);
}

function isNamespace(node) {
  return isAttribute(node) || isTag(node);
}

(function (exports) {

  exports.__esModule = true;
  var _types = types;
  Object.keys(_types).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (key in exports && exports[key] === _types[key]) return;
    exports[key] = _types[key];
  });
  var _constructors = constructors;
  Object.keys(_constructors).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (key in exports && exports[key] === _constructors[key]) return;
    exports[key] = _constructors[key];
  });
  var _guards = guards;
  Object.keys(_guards).forEach(function (key) {
    if (key === "default" || key === "__esModule") return;
    if (key in exports && exports[key] === _guards[key]) return;
    exports[key] = _guards[key];
  });
})(selectors);

(function (module, exports) {

  exports.__esModule = true;
  exports["default"] = void 0;

  var _processor = _interopRequireDefault(processor.exports);

  var selectors$1 = _interopRequireWildcard(selectors);

  function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();

    _getRequireWildcardCache = function _getRequireWildcardCache() {
      return cache;
    };

    return cache;
  }

  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }

    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
      return {
        "default": obj
      };
    }

    var cache = _getRequireWildcardCache();

    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }

    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }

    newObj["default"] = obj;

    if (cache) {
      cache.set(obj, newObj);
    }

    return newObj;
  }

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  var parser = function parser(processor) {
    return new _processor["default"](processor);
  };

  Object.assign(parser, selectors$1);
  delete parser.__esModule;
  var _default = parser;
  exports["default"] = _default;
  module.exports = exports.default;
})(dist, dist.exports);

var parser = /*@__PURE__*/getDefaultExportFromCjs(dist.exports);

function combinationsWithSizeN(set, n) {
  // set is the list of parent selectors
  // n is the amount of `&` selectors in the current selector.
  // all combinations of values in the set with an array size of n must be generated to match the nesting selector behavior.
  //
  // for example :
  // a current selector like: `& + & {}`
  // with parent : `.foo, .bar {}`
  //
  // the set is `['.foo', '.bar']` and n is 2, the resulting combinations are:
  // ['.foo', '.bar']
  // ['.foo', '.foo']
  // ['.bar', '.foo']
  // ['.bar', '.bar']
  //
  // outputted like :
  // .foo + .bar,
  // .foo + .foo,
  // .bar + .foo,
  // .bar + .bar {}
  if (n < 2) {
    // should never happen and is checked by caller
    throw new Error('n must be greater than 1');
  }

  if (set.length < 2) {
    // should never happen and is checked by caller
    throw new Error('s must be greater than 1');
  }

  if (Math.pow(set.length, n) > 10000) {
    // Throwing is best here as a warning would be impossible to handle gracefully on our end.
    // This will error mid transform and there is no possible fallback at this point.
    // The user should reduce complexity.
    throw new Error('Too many combinations when trying to resolve a nested selector with lists, reduce the complexity of your selectors');
  }

  const counters = [];

  for (let i = 0; i < n; i++) {
    counters[i] = 0;
  }

  const result = []; // eslint-disable-next-line no-constant-condition

  while (true) {
    const ss = [];

    for (let i = n - 1; i >= 0; i--) {
      let currentCounter = counters[i];

      if (currentCounter >= set.length) {
        currentCounter = 0;
        counters[i] = 0;

        if (i === 0) {
          return result;
        } else {
          counters[i - 1] += 1;
        }
      }

      ss[i] = set[currentCounter];
    }

    result.push(ss);
    counters[counters.length - 1]++;
  }
}

const isPseudo = parser.pseudo({
  value: ':is'
});
function wrapMultipleTagSelectorsWithIsPseudo(node) {
  // This is a fallback for broken selectors like:
  // `h1h2`
  // These selectors are also useless as `h1:is(h2)`.
  // Wrapping with is only prevents accidentally forming other words which might have meaning.
  const tagNodes = node.nodes.filter(x => {
    return x.type === 'tag';
  });

  if (tagNodes.length > 1) {
    tagNodes.slice(1).forEach(child => {
      const isPseudoClone = isPseudo.clone();
      child.replaceWith(isPseudoClone);
      isPseudoClone.append(child);
    });
  }
}

function sortCompoundSelectorsInsideComplexSelector(node, wrapWithIsPseudo) {
  let compound = [];
  let foundOtherNesting = false;
  const nodes = [...node.nodes];

  for (let i = 0; i < nodes.length + 1; i++) {
    const child = nodes[i];

    if (!child || child.type === 'combinator') {
      if (foundOtherNesting) {
        // nesting walker will further manipulate the selector and revisit this function later.
        // not skipping here will break the nesting walker as the order and contents of the nodes have changed too much.
        compound = [];
        continue;
      }

      if (compound.length > 1) {
        const compoundSelector = parser.selector();
        compound[0].replaceWith(compoundSelector);
        compound.slice(1).forEach(compoundPart => {
          compoundPart.remove();
        });
        compound.forEach(compoundPart => {
          compoundSelector.append(compoundPart);
        });
        sortCompoundSelector(compoundSelector);

        if (wrapWithIsPseudo) {
          wrapMultipleTagSelectorsWithIsPseudo(compoundSelector);
        }

        compoundSelector.replaceWith(...compoundSelector.nodes);
      }

      compound = [];
      continue;
    }

    if (child.type === 'nesting') {
      foundOtherNesting = true;
    }

    compound.push(child);
  }
}
function sortCompoundSelector(node) {
  // simply concatenating with selectors can lead to :
  // `.fooh1`
  //
  // applying a sort where tag selectors are first will result in :
  // `h1.foo`
  node.nodes.sort((a, b) => {
    if (a.type === b.type) {
      return 0;
    }

    if (selectorTypeOrder[a.type] < selectorTypeOrder[b.type]) {
      return -1;
    }

    return 1;
  });
}
const selectorTypeOrder = {
  universal: 0,
  tag: 1,
  id: 2,
  class: 3,
  attribute: 4,
  pseudo: 5,
  selector: 7,
  string: 8,
  root: 9,
  comment: 10,
  nesting: 9999
};

function nodesAreEquallySpecific(nodes) {
  // Selector specificity is important when the parent selector is a list.
  // These cases should be resolved with `:is()` pseudo.
  // Since browser support for `:is()` is not great, we try to avoid it.
  // If the selector specificity is equal for all items in the selector list, we don't need `:is`.
  const specificities = nodes.map(node => {
    return parser().astSync(node);
  }).map(ast => {
    return selectorSpecificity(ast);
  });
  const first = specificities[0];

  for (let i = 1; i < specificities.length; i++) {
    if (first.a === specificities[i].a && first.b === specificities[i].b && first.c === specificities[i].c) {
      continue;
    }

    return false;
  }

  return true;
}
function selectorSpecificity(node) {
  let a = 0;
  let b = 0;
  let c = 0;

  if (node.type === 'id') {
    a += 1;
  } else if (node.type === 'tag') {
    c += 1;
  } else if (node.type === 'class') {
    b += 1;
  } else if (node.type === 'attribute') {
    b += 1;
  } else if (node.type === 'pseudo') {
    switch (node.value) {
      case '::after':
      case ':after':
      case '::backdrop':
      case '::before':
      case ':before':
      case '::cue':
      case '::cue-region':
      case '::first-letter':
      case ':first-letter':
      case '::first-line':
      case ':first-line':
      case '::file-selector-button':
      case '::grammar-error':
      case '::marker':
      case '::part':
      case '::placeholder':
      case '::selection':
      case '::slotted':
      case '::spelling-error':
      case '::target-text':
        c += 1;
        break;

      case ':is':
      case ':has':
      case ':not':
        {
          if (node.nodes && node.nodes.length > 0) {
            let mostSpecificListItem = {
              a: 0,
              b: 0,
              c: 0
            };
            node.nodes.forEach(child => {
              const itemSpecificity = selectorSpecificity(child);

              if (itemSpecificity.a > mostSpecificListItem.a) {
                mostSpecificListItem = itemSpecificity;
                return;
              } else if (itemSpecificity.a < mostSpecificListItem.a) {
                return;
              }

              if (itemSpecificity.b > mostSpecificListItem.b) {
                mostSpecificListItem = itemSpecificity;
                return;
              } else if (itemSpecificity.b < mostSpecificListItem.b) {
                return;
              }

              if (itemSpecificity.c > mostSpecificListItem.c) {
                mostSpecificListItem = itemSpecificity;
                return;
              }
            });
            a += mostSpecificListItem.a;
            b += mostSpecificListItem.b;
            c += mostSpecificListItem.c;
          }

          break;
        }

      case 'where':
        break;

      case ':nth-child':
      case ':nth-last-child':
        {
          const ofSeparatorIndex = node.nodes.findIndex(x => {
            x.value === 'of';
          });

          if (ofSeparatorIndex > -1) {
            const ofSpecificity = selectorSpecificity(parser.selector({
              nodes: node.nodes.slice(ofSeparatorIndex + 1)
            }));
            a += ofSpecificity.a;
            b += ofSpecificity.b;
            c += ofSpecificity.c;
          } else {
            a += a;
            b += b;
            c += c;
          }
        }
        break;

      default:
        b += 1;
    }
  } else if (node.nodes && node.nodes.length > 0) {
    node.nodes.forEach(child => {
      const specificity = selectorSpecificity(child);
      a += specificity.a;
      b += specificity.b;
      c += specificity.c;
    });
  }

  return {
    a,
    b,
    c
  };
}

function mergeSelectors(fromSelectors, toSelectors, opts) {
  const fromListHasUniformSpecificity = nodesAreEquallySpecific(fromSelectors);
  let fromSelectorsAST = [];

  if (fromListHasUniformSpecificity || opts.noIsPseudoSelector) {
    fromSelectorsAST = fromSelectors.map(selector => {
      return parser().astSync(selector);
    });
  } else {
    fromSelectorsAST = [parser().astSync(`:is(${fromSelectors.join(',')})`)];
  }

  let result = [];

  for (let x = 0; x < toSelectors.length; x++) {
    const toSelector = toSelectors[x];
    let iterations = 1;
    let fromSelectorCombinations = [];
    let nestingCounter = 0;
    parser().astSync(toSelector).walkNesting(() => {
      nestingCounter++;
    });

    if (nestingCounter > 1 && fromSelectorsAST.length > 1) {
      fromSelectorCombinations = combinationsWithSizeN(fromSelectorsAST, nestingCounter);
      iterations = fromSelectorCombinations.length;
    } else {
      iterations = fromSelectorsAST.length;

      for (let i = 0; i < fromSelectorsAST.length; i++) {
        fromSelectorCombinations.push([]);

        for (let j = 0; j < nestingCounter; j++) {
          fromSelectorCombinations[i].push(fromSelectorsAST[i]);
        }
      }
    }

    for (let y = 0; y < iterations; y++) {
      let counter = 0;
      const toSelectorAST = parser().astSync(toSelector);
      toSelectorAST.walk(nesting => {
        if (nesting.type !== 'nesting') {
          return;
        }

        let fromSelectorAST = fromSelectorCombinations[y][counter];
        counter++; // If the from selector is simple we extract the first non root, non selector node

        if (fromSelectorAST.type === 'root' && fromSelectorAST.nodes.length === 1) {
          fromSelectorAST = fromSelectorAST.nodes[0];
        }

        const fromSelectorWithIsAST = parser().astSync(`:is(${fromSelectorAST.toString()})`);
        const fromIsSimple = isSimpleSelector(fromSelectorAST.nodes[0]); // this function looks at the parent of the node passed as an argument

        const fromIsCompound = isCompoundSelector(fromSelectorAST.nodes[0]); // this function looks at the parent of the node passed as an argument

        const toIsSimple = isSimpleSelector(nesting);
        const toIsCompound = isCompoundSelector(nesting); // Parent and child are simple

        if (fromIsSimple && toIsSimple) {
          nesting.replaceWith(fromSelectorAST.clone());
          return;
        } // Parent and child are simple or compound


        if ((fromIsSimple || fromIsCompound) && (toIsSimple || toIsCompound)) {
          const parent = nesting.parent;

          if (fromIsSimple && fromSelectorAST.type === 'selector') {
            // fromSelectorAST has type selector with a single child
            nesting.replaceWith(fromSelectorAST.clone().nodes[0]);
          } else {
            // fromSelectorAST has type selector containing a compound selector
            nesting.replaceWith(...fromSelectorAST.clone().nodes);
          }

          if (parent && parent.nodes.length > 1) {
            sortCompoundSelector(parent);

            if (!opts.noIsPseudoSelector) {
              wrapMultipleTagSelectorsWithIsPseudo(parent);
            }
          }

          return;
        }

        if (fromIsSimple) {
          const parent = nesting.parent;
          nesting.replaceWith(fromSelectorAST.clone().nodes[0]);

          if (parent) {
            sortCompoundSelectorsInsideComplexSelector(parent, !opts.noIsPseudoSelector);
          }

          return;
        }

        if (fromIsCompound) {
          const parent = nesting.parent;
          nesting.replaceWith(...fromSelectorAST.clone().nodes);

          if (parent) {
            sortCompoundSelectorsInsideComplexSelector(parent, !opts.noIsPseudoSelector);
          }

          return;
        }

        if (nestingIsFirstAndOnlyInSelectorWithEitherSpaceOrChildCombinator(nesting)) {
          const parent = nesting.parent;
          nesting.replaceWith(...fromSelectorAST.clone().nodes);

          if (parent) {
            sortCompoundSelectorsInsideComplexSelector(parent, !opts.noIsPseudoSelector);
          }

          return;
        }

        if (nestingIsNotInsideCompoundSelector(nesting)) {
          const parent = nesting.parent;
          nesting.replaceWith(...fromSelectorAST.clone().nodes);

          if (parent) {
            sortCompoundSelectorsInsideComplexSelector(parent, !opts.noIsPseudoSelector);
          }

          return;
        }

        const parent = nesting.parent;

        if (opts.noIsPseudoSelector) {
          nesting.replaceWith(...fromSelectorAST.clone().nodes);
        } else {
          nesting.replaceWith(...fromSelectorWithIsAST.clone().nodes);
        }

        if (parent) {
          sortCompoundSelectorsInsideComplexSelector(parent, !opts.noIsPseudoSelector);
        }
      });
      result.push(toSelectorAST.toString());
    }
  }

  return result;
}

function isSimpleSelector(selector) {
  if (selector.type === 'combinator') {
    return false;
  }

  if (selector.parent && selector.parent.nodes.length > 1) {
    return false;
  }

  return true;
}

function isCompoundSelector(selector, toSelector = null) {
  if (isSimpleSelector(selector)) {
    return false;
  }

  if (!selector.parent) {
    return false;
  }

  const hasCombinators = !!selector.parent.nodes.find(x => {
    return x.type === 'combinator' || x.type === 'comment';
  });

  if (hasCombinators) {
    return false;
  }

  const hasExtraNesting = !!selector.parent.nodes.find(x => {
    return x.type === 'nesting';
  });

  if (hasExtraNesting && toSelector && !isCompoundSelector(toSelector)) {
    return false;
  }

  return true;
}

function nestingIsFirstAndOnlyInSelectorWithEitherSpaceOrChildCombinator(selector) {
  if (!selector.parent) {
    return false;
  }

  if (selector.parent.nodes.indexOf(selector) !== 0) {
    return false;
  }

  for (let i = 1; i < selector.parent.nodes.length; i++) {
    if (selector.parent.nodes[i].type === 'combinator' && selector.parent.nodes[i].value !== ' ' && selector.parent.nodes[i].value !== '>') {
      return false;
    }
  }

  return true;
}

function nestingIsNotInsideCompoundSelector(selector) {
  if (isSimpleSelector(selector)) {
    return true;
  }

  if (!selector.parent) {
    return false;
  }

  for (let i = 0; i < selector.parent.nodes.length; i++) {
    if (!selector.parent.nodes[i].type === 'nesting') {
      continue;
    }

    if (!selector.parent.nodes[i].prev() && !selector.parent.nodes[i].next()) {
      continue;
    }

    if (selector.parent.nodes[i].prev() && selector.parent.nodes[i].prev().type !== 'combinator') {
      return false;
    }

    if (selector.parent.nodes[i].next() && selector.parent.nodes[i].next().type !== 'combinator') {
      return false;
    }
  }

  return true;
}

function transformRuleWithinRule(node, opts) {
  // move previous siblings and the node to before the parent
  const parent = shiftNodesBeforeParent(node); // update the selectors of the node to be merged with the parent

  node.selectors = mergeSelectors(parent.selectors, node.selectors, opts); // merge similar rules back together

  const areSameRule = node.type === 'rule' && parent.type === 'rule' && node.selector === parent.selector || node.type === 'atrule' && parent.type === 'atrule' && node.params === parent.params;

  if (areSameRule) {
    node.append(...parent.nodes);
  } // conditionally cleanup an empty parent rule


  cleanupParent(parent);
}
const isRuleWithinRule = node => node.type === 'rule' && Object(node.parent).type === 'rule' && node.selectors.every(selector => selector.trim().indexOf('&') === 0 && selector.indexOf('|') === -1);

const comma = string => {
  let array = [];
  let current = '';
  let split = false;
  let func = 0;
  let quote = false;
  let escape = false;

  for (let letter of string) {
    if (escape) {
      escape = false;
    } else if (letter === '\\') {
      escape = true;
    } else if (quote) {
      if (letter === quote) {
        quote = false;
      }
    } else if (letter === '"' || letter === '\'') {
      quote = letter;
    } else if (letter === '(') {
      func += 1;
    } else if (letter === ')') {
      if (func > 0) {
        func -= 1;
      }
    } else if (func === 0) {
      if (letter === ',') {
        split = true;
      }
    }

    if (split) {
      if (current !== '') {
        array.push(current.trim());
      }

      current = '';
      split = false;
    } else {
      current += letter;
    }
  }

  array.push(current.trim());
  return array;
};

function transformNestRuleWithinRule(node, walk, opts) {
  // move previous siblings and the node to before the parent
  const parent = shiftNodesBeforeParent(node); // clone the parent as a new rule with children appended to it

  const rule = parent.clone().removeAll().append(node.nodes); // replace the node with the new rule

  node.replaceWith(rule); // update the selectors of the node to be merged with the parent

  rule.selectors = mergeSelectors(parent.selectors, comma(node.params), opts); // conditionally cleanup an empty parent rule

  cleanupParent(parent); // walk the children of the new rule

  walk(rule, opts);
}
const isNestRuleWithinRule = node => node.type === 'atrule' && node.name === 'nest' && Object(node.parent).type === 'rule' && comma(node.params).every(selector => selector.split('&').length >= 2 && selector.indexOf('|') === -1);

var validAtrules = ['container', 'document', 'media', 'supports'];

function atruleWithinRule(node, walk, opts) {
  // move previous siblings and the node to before the parent
  const parent = shiftNodesBeforeParent(node); // clone the parent as a new rule with children appended to it

  const rule = parent.clone().removeAll().append(node.nodes); // append the new rule to the node

  node.append(rule); // conditionally cleanup an empty parent rule

  cleanupParent(parent); // walk the children of the new rule

  walk(rule, opts);
}
const isAtruleWithinRule = node => node.type === 'atrule' && validAtrules.includes(node.name) && Object(node.parent).type === 'rule';

function mergeParams(fromParams, toParams) {
  return comma(fromParams).map(params1 => comma(toParams).map(params2 => `${params1} and ${params2}`).join(', ')).join(', ');
}

/*
 * DEPRECATED: In v7.0.0 these features will be removed as they are not part of
 * the nesting proposal.
 */

function transformAtruleWithinAtrule(node) {
  // move previous siblings and the node to before the parent
  const parent = shiftNodesBeforeParent(node); // update the params of the node to be merged with the parent

  node.params = mergeParams(parent.params, node.params); // conditionally cleanup an empty parent rule

  cleanupParent(parent);
}
const isAtruleWithinAtrule = node => node.type === 'atrule' && validAtrules.includes(node.name) && Object(node.parent).type === 'atrule' && node.name === node.parent.name;

function walk(node, opts) {
  node.each(child => {
    if (isRuleWithinRule(child)) {
      transformRuleWithinRule(child, opts);
    } else if (isNestRuleWithinRule(child)) {
      transformNestRuleWithinRule(child, walk, opts);
    } else if (isAtruleWithinRule(child)) {
      atruleWithinRule(child, walk, opts);
    } else if (isAtruleWithinAtrule(child)) {
      transformAtruleWithinAtrule(child);
    }

    if (Object(child.nodes).length) {
      walk(child, opts);
    }
  });
}

/**
 * @param {{noIsPseudoSelector?: boolean}} opts
 * @returns {import('postcss').Plugin}
 */

function postcssNesting(opts) {
  const noIsPseudoSelector = Object(opts).noIsPseudoSelector || false;
  return {
    postcssPlugin: 'postcss-nesting',

    Rule(rule) {
      walk(rule, {
        noIsPseudoSelector: noIsPseudoSelector
      });
    }

  };
}
postcssNesting.postcss = true;

export { postcssNesting as default };
