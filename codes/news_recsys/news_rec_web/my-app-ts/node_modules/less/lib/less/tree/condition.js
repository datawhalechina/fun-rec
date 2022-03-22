"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var Condition = function (op, l, r, i, negate) {
    this.op = op.trim();
    this.lvalue = l;
    this.rvalue = r;
    this._index = i;
    this.negate = negate;
};
Condition.prototype = Object.assign(new node_1.default(), {
    type: 'Condition',
    accept: function (visitor) {
        this.lvalue = visitor.visit(this.lvalue);
        this.rvalue = visitor.visit(this.rvalue);
    },
    eval: function (context) {
        var result = (function (op, a, b) {
            switch (op) {
                case 'and': return a && b;
                case 'or': return a || b;
                default:
                    switch (node_1.default.compare(a, b)) {
                        case -1:
                            return op === '<' || op === '=<' || op === '<=';
                        case 0:
                            return op === '=' || op === '>=' || op === '=<' || op === '<=';
                        case 1:
                            return op === '>' || op === '>=';
                        default:
                            return false;
                    }
            }
        })(this.op, this.lvalue.eval(context), this.rvalue.eval(context));
        return this.negate ? !result : result;
    }
});
exports.default = Condition;
//# sourceMappingURL=condition.js.map