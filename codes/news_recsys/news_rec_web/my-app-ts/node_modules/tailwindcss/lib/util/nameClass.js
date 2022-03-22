"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.asClass = asClass;
exports.default = nameClass;
exports.formatClass = formatClass;
var _escapeClassName = _interopRequireDefault(require("./escapeClassName"));
var _escapeCommas = _interopRequireDefault(require("./escapeCommas"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function asClass(name) {
    return (0, _escapeCommas).default(`.${(0, _escapeClassName).default(name)}`);
}
function nameClass(classPrefix, key) {
    return asClass(formatClass(classPrefix, key));
}
function formatClass(classPrefix, key) {
    if (key === 'DEFAULT') {
        return classPrefix;
    }
    if (key === '-' || key === '-DEFAULT') {
        return `-${classPrefix}`;
    }
    if (key.startsWith('-')) {
        return `-${classPrefix}${key}`;
    }
    return `${classPrefix}-${key}`;
}
