"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var operation_1 = tslib_1.__importDefault(require("./operation"));
var dimension_1 = tslib_1.__importDefault(require("./dimension"));
var Negative = function (node) {
    this.value = node;
};
Negative.prototype = Object.assign(new node_1.default(), {
    type: 'Negative',
    genCSS: function (context, output) {
        output.add('-');
        this.value.genCSS(context, output);
    },
    eval: function (context) {
        if (context.isMathOn()) {
            return (new operation_1.default('*', [new dimension_1.default(-1), this.value])).eval(context);
        }
        return new Negative(this.value.eval(context));
    }
});
exports.default = Negative;
//# sourceMappingURL=negative.js.map