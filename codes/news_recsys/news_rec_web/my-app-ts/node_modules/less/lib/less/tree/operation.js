"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var color_1 = tslib_1.__importDefault(require("./color"));
var dimension_1 = tslib_1.__importDefault(require("./dimension"));
var Constants = tslib_1.__importStar(require("../constants"));
var MATH = Constants.Math;
var Operation = function (op, operands, isSpaced) {
    this.op = op.trim();
    this.operands = operands;
    this.isSpaced = isSpaced;
};
Operation.prototype = Object.assign(new node_1.default(), {
    type: 'Operation',
    accept: function (visitor) {
        this.operands = visitor.visitArray(this.operands);
    },
    eval: function (context) {
        var a = this.operands[0].eval(context), b = this.operands[1].eval(context), op;
        if (context.isMathOn(this.op)) {
            op = this.op === './' ? '/' : this.op;
            if (a instanceof dimension_1.default && b instanceof color_1.default) {
                a = a.toColor();
            }
            if (b instanceof dimension_1.default && a instanceof color_1.default) {
                b = b.toColor();
            }
            if (!a.operate || !b.operate) {
                if ((a instanceof Operation || b instanceof Operation)
                    && a.op === '/' && context.math === MATH.PARENS_DIVISION) {
                    return new Operation(this.op, [a, b], this.isSpaced);
                }
                throw { type: 'Operation',
                    message: 'Operation on an invalid type' };
            }
            return a.operate(context, op, b);
        }
        else {
            return new Operation(this.op, [a, b], this.isSpaced);
        }
    },
    genCSS: function (context, output) {
        this.operands[0].genCSS(context, output);
        if (this.isSpaced) {
            output.add(' ');
        }
        output.add(this.op);
        if (this.isSpaced) {
            output.add(' ');
        }
        this.operands[1].genCSS(context, output);
    }
});
exports.default = Operation;
//# sourceMappingURL=operation.js.map