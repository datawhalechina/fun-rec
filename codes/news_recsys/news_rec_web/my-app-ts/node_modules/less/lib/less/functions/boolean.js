"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var anonymous_1 = tslib_1.__importDefault(require("../tree/anonymous"));
var keyword_1 = tslib_1.__importDefault(require("../tree/keyword"));
function boolean(condition) {
    return condition ? keyword_1.default.True : keyword_1.default.False;
}
/**
 * Functions with evalArgs set to false are sent context
 * as the first argument.
 */
function If(context, condition, trueValue, falseValue) {
    return condition.eval(context) ? trueValue.eval(context)
        : (falseValue ? falseValue.eval(context) : new anonymous_1.default);
}
If.evalArgs = false;
function isdefined(context, variable) {
    try {
        variable.eval(context);
        return keyword_1.default.True;
    }
    catch (e) {
        return keyword_1.default.False;
    }
}
isdefined.evalArgs = false;
exports.default = { isdefined: isdefined, boolean: boolean, 'if': If };
//# sourceMappingURL=boolean.js.map