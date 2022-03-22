"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _rolesMap = _interopRequireDefault(require("./rolesMap"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var elementRoles = [];

var keys = _rolesMap.default.keys();

for (var i = 0; i < keys.length; i++) {
  var _key = keys[i];

  var role = _rolesMap.default.get(_key);

  if (role) {
    var concepts = [].concat(role.baseConcepts, role.relatedConcepts);

    for (var k = 0; k < concepts.length; k++) {
      var relation = concepts[k];

      if (relation.module === 'HTML') {
        var concept = relation.concept;

        if (concept) {
          (function () {
            var conceptStr = JSON.stringify(concept);
            var elementRoleRelation = elementRoles.find(function (relation) {
              return JSON.stringify(relation[0]) === conceptStr;
            });
            var roles = void 0;

            if (elementRoleRelation) {
              roles = elementRoleRelation[1];
            } else {
              roles = [];
            }

            var isUnique = true;

            for (var _i = 0; _i < roles.length; _i++) {
              if (roles[_i] === _key) {
                isUnique = false;
                break;
              }
            }

            if (isUnique) {
              roles.push(_key);
            }

            elementRoles.push([concept, roles]);
          })();
        }
      }
    }
  }
}

var elementRoleMap = {
  entries: function entries() {
    return elementRoles;
  },
  get: function get(key) {
    var item = elementRoles.find(function (tuple) {
      return JSON.stringify(tuple[0]) === JSON.stringify(key) ? true : false;
    });
    return item && item[1];
  },
  has: function has(key) {
    return !!this.get(key);
  },
  keys: function keys() {
    return elementRoles.map(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          key = _ref2[0];

      return key;
    });
  },
  values: function values() {
    return elementRoles.map(function (_ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          values = _ref4[1];

      return values;
    });
  }
};
var _default = elementRoleMap;
exports.default = _default;