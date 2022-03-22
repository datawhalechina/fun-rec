"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var Attribute = function (key, op, value) {
    this.key = key;
    this.op = op;
    this.value = value;
};
Attribute.prototype = Object.assign(new node_1.default(), {
    type: 'Attribute',
    eval: function (context) {
        return new Attribute(this.key.eval ? this.key.eval(context) : this.key, this.op, (this.value && this.value.eval) ? this.value.eval(context) : this.value);
    },
    genCSS: function (context, output) {
        output.add(this.toCSS(context));
    },
    toCSS: function (context) {
        var value = this.key.toCSS ? this.key.toCSS(context) : this.key;
        if (this.op) {
            value += this.op;
            value += (this.value.toCSS ? this.value.toCSS(context) : this.value);
        }
        return "[" + value + "]";
    }
});
exports.default = Attribute;
//# sourceMappingURL=attribute.js.map