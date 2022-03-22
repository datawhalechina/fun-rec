"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dimension_1 = tslib_1.__importDefault(require("../tree/dimension"));
var MathHelper = function (fn, unit, n) {
    if (!(n instanceof dimension_1.default)) {
        throw { type: 'Argument', message: 'argument must be a number' };
    }
    if (unit == null) {
        unit = n.unit;
    }
    else {
        n = n.unify();
    }
    return new dimension_1.default(fn(parseFloat(n.value)), unit);
};
exports.default = MathHelper;
//# sourceMappingURL=math-helper.js.map