"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var paren_1 = tslib_1.__importDefault(require("./paren"));
var comment_1 = tslib_1.__importDefault(require("./comment"));
var dimension_1 = tslib_1.__importDefault(require("./dimension"));
var Constants = tslib_1.__importStar(require("../constants"));
var MATH = Constants.Math;
var Expression = function (value, noSpacing) {
    this.value = value;
    this.noSpacing = noSpacing;
    if (!value) {
        throw new Error('Expression requires an array parameter');
    }
};
Expression.prototype = Object.assign(new node_1.default(), {
    type: 'Expression',
    accept: function (visitor) {
        this.value = visitor.visitArray(this.value);
    },
    eval: function (context) {
        var returnValue;
        var mathOn = context.isMathOn();
        var inParenthesis = this.parens;
        var doubleParen = false;
        if (inParenthesis) {
            context.inParenthesis();
        }
        if (this.value.length > 1) {
            returnValue = new Expression(this.value.map(function (e) {
                if (!e.eval) {
                    return e;
                }
                return e.eval(context);
            }), this.noSpacing);
        }
        else if (this.value.length === 1) {
            if (this.value[0].parens && !this.value[0].parensInOp && !context.inCalc) {
                doubleParen = true;
            }
            returnValue = this.value[0].eval(context);
        }
        else {
            returnValue = this;
        }
        if (inParenthesis) {
            context.outOfParenthesis();
        }
        if (this.parens && this.parensInOp && !mathOn && !doubleParen
            && (!(returnValue instanceof dimension_1.default))) {
            returnValue = new paren_1.default(returnValue);
        }
        return returnValue;
    },
    genCSS: function (context, output) {
        for (var i = 0; i < this.value.length; i++) {
            this.value[i].genCSS(context, output);
            if (!this.noSpacing && i + 1 < this.value.length) {
                output.add(' ');
            }
        }
    },
    throwAwayComments: function () {
        this.value = this.value.filter(function (v) {
            return !(v instanceof comment_1.default);
        });
    }
});
exports.default = Expression;
//# sourceMappingURL=expression.js.map