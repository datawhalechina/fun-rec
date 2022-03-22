"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var Assignment = function (key, val) {
    this.key = key;
    this.value = val;
};
Assignment.prototype = Object.assign(new node_1.default(), {
    type: 'Assignment',
    accept: function (visitor) {
        this.value = visitor.visit(this.value);
    },
    eval: function (context) {
        if (this.value.eval) {
            return new Assignment(this.key, this.value.eval(context));
        }
        return this;
    },
    genCSS: function (context, output) {
        output.add(this.key + "=");
        if (this.value.genCSS) {
            this.value.genCSS(context, output);
        }
        else {
            output.add(this.value);
        }
    }
});
exports.default = Assignment;
//# sourceMappingURL=assignment.js.map