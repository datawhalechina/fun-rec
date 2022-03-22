"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var Value = function (value) {
    if (!value) {
        throw new Error('Value requires an array argument');
    }
    if (!Array.isArray(value)) {
        this.value = [value];
    }
    else {
        this.value = value;
    }
};
Value.prototype = Object.assign(new node_1.default(), {
    type: 'Value',
    accept: function (visitor) {
        if (this.value) {
            this.value = visitor.visitArray(this.value);
        }
    },
    eval: function (context) {
        if (this.value.length === 1) {
            return this.value[0].eval(context);
        }
        else {
            return new Value(this.value.map(function (v) {
                return v.eval(context);
            }));
        }
    },
    genCSS: function (context, output) {
        var i;
        for (i = 0; i < this.value.length; i++) {
            this.value[i].genCSS(context, output);
            if (i + 1 < this.value.length) {
                output.add((context && context.compress) ? ',' : ', ');
            }
        }
    }
});
exports.default = Value;
//# sourceMappingURL=value.js.map