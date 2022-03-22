"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var Paren = function (node) {
    this.value = node;
};
Paren.prototype = Object.assign(new node_1.default(), {
    type: 'Paren',
    genCSS: function (context, output) {
        output.add('(');
        this.value.genCSS(context, output);
        output.add(')');
    },
    eval: function (context) {
        return new Paren(this.value.eval(context));
    }
});
exports.default = Paren;
//# sourceMappingURL=paren.js.map