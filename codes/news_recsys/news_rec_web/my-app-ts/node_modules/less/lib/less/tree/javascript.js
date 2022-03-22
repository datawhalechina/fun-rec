"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var js_eval_node_1 = tslib_1.__importDefault(require("./js-eval-node"));
var dimension_1 = tslib_1.__importDefault(require("./dimension"));
var quoted_1 = tslib_1.__importDefault(require("./quoted"));
var anonymous_1 = tslib_1.__importDefault(require("./anonymous"));
var JavaScript = function (string, escaped, index, currentFileInfo) {
    this.escaped = escaped;
    this.expression = string;
    this._index = index;
    this._fileInfo = currentFileInfo;
};
JavaScript.prototype = Object.assign(new js_eval_node_1.default(), {
    type: 'JavaScript',
    eval: function (context) {
        var result = this.evaluateJavaScript(this.expression, context);
        var type = typeof result;
        if (type === 'number' && !isNaN(result)) {
            return new dimension_1.default(result);
        }
        else if (type === 'string') {
            return new quoted_1.default("\"" + result + "\"", result, this.escaped, this._index);
        }
        else if (Array.isArray(result)) {
            return new anonymous_1.default(result.join(', '));
        }
        else {
            return new anonymous_1.default(result);
        }
    }
});
exports.default = JavaScript;
//# sourceMappingURL=javascript.js.map