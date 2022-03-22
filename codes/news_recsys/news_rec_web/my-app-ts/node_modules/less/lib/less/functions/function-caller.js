"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var expression_1 = tslib_1.__importDefault(require("../tree/expression"));
var functionCaller = /** @class */ (function () {
    function functionCaller(name, context, index, currentFileInfo) {
        this.name = name.toLowerCase();
        this.index = index;
        this.context = context;
        this.currentFileInfo = currentFileInfo;
        this.func = context.frames[0].functionRegistry.get(this.name);
    }
    functionCaller.prototype.isValid = function () {
        return Boolean(this.func);
    };
    functionCaller.prototype.call = function (args) {
        var _this = this;
        if (!(Array.isArray(args))) {
            args = [args];
        }
        var evalArgs = this.func.evalArgs;
        if (evalArgs !== false) {
            args = args.map(function (a) { return a.eval(_this.context); });
        }
        var commentFilter = function (item) { return !(item.type === 'Comment'); };
        // This code is terrible and should be replaced as per this issue...
        // https://github.com/less/less.js/issues/2477
        args = args
            .filter(commentFilter)
            .map(function (item) {
            if (item.type === 'Expression') {
                var subNodes = item.value.filter(commentFilter);
                if (subNodes.length === 1) {
                    // https://github.com/less/less.js/issues/3616
                    if (item.parens && subNodes[0].op === '/') {
                        return item;
                    }
                    return subNodes[0];
                }
                else {
                    return new expression_1.default(subNodes);
                }
            }
            return item;
        });
        if (evalArgs === false) {
            return this.func.apply(this, tslib_1.__spreadArray([this.context], args));
        }
        return this.func.apply(this, args);
    };
    return functionCaller;
}());
exports.default = functionCaller;
//# sourceMappingURL=function-caller.js.map