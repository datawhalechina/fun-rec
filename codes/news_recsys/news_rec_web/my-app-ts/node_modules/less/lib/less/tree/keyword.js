"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var Keyword = function (value) {
    this.value = value;
};
Keyword.prototype = Object.assign(new node_1.default(), {
    type: 'Keyword',
    genCSS: function (context, output) {
        if (this.value === '%') {
            throw { type: 'Syntax', message: 'Invalid % without number' };
        }
        output.add(this.value);
    }
});
Keyword.True = new Keyword('true');
Keyword.False = new Keyword('false');
exports.default = Keyword;
//# sourceMappingURL=keyword.js.map