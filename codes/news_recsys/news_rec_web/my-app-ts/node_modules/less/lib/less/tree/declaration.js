"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var value_1 = tslib_1.__importDefault(require("./value"));
var keyword_1 = tslib_1.__importDefault(require("./keyword"));
var anonymous_1 = tslib_1.__importDefault(require("./anonymous"));
var Constants = tslib_1.__importStar(require("../constants"));
var MATH = Constants.Math;
function evalName(context, name) {
    var value = '';
    var i;
    var n = name.length;
    var output = { add: function (s) { value += s; } };
    for (i = 0; i < n; i++) {
        name[i].eval(context).genCSS(context, output);
    }
    return value;
}
var Declaration = function (name, value, important, merge, index, currentFileInfo, inline, variable) {
    this.name = name;
    this.value = (value instanceof node_1.default) ? value : new value_1.default([value ? new anonymous_1.default(value) : null]);
    this.important = important ? " " + important.trim() : '';
    this.merge = merge;
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.inline = inline || false;
    this.variable = (variable !== undefined) ? variable
        : (name.charAt && (name.charAt(0) === '@'));
    this.allowRoot = true;
    this.setParent(this.value, this);
};
Declaration.prototype = Object.assign(new node_1.default(), {
    type: 'Declaration',
    genCSS: function (context, output) {
        output.add(this.name + (context.compress ? ':' : ': '), this.fileInfo(), this.getIndex());
        try {
            this.value.genCSS(context, output);
        }
        catch (e) {
            e.index = this._index;
            e.filename = this._fileInfo.filename;
            throw e;
        }
        output.add(this.important + ((this.inline || (context.lastRule && context.compress)) ? '' : ';'), this._fileInfo, this._index);
    },
    eval: function (context) {
        var mathBypass = false, prevMath, name = this.name, evaldValue, variable = this.variable;
        if (typeof name !== 'string') {
            // expand 'primitive' name directly to get
            // things faster (~10% for benchmark.less):
            name = (name.length === 1) && (name[0] instanceof keyword_1.default) ?
                name[0].value : evalName(context, name);
            variable = false; // never treat expanded interpolation as new variable name
        }
        // @todo remove when parens-division is default
        if (name === 'font' && context.math === MATH.ALWAYS) {
            mathBypass = true;
            prevMath = context.math;
            context.math = MATH.PARENS_DIVISION;
        }
        try {
            context.importantScope.push({});
            evaldValue = this.value.eval(context);
            if (!this.variable && evaldValue.type === 'DetachedRuleset') {
                throw { message: 'Rulesets cannot be evaluated on a property.',
                    index: this.getIndex(), filename: this.fileInfo().filename };
            }
            var important = this.important;
            var importantResult = context.importantScope.pop();
            if (!important && importantResult.important) {
                important = importantResult.important;
            }
            return new Declaration(name, evaldValue, important, this.merge, this.getIndex(), this.fileInfo(), this.inline, variable);
        }
        catch (e) {
            if (typeof e.index !== 'number') {
                e.index = this.getIndex();
                e.filename = this.fileInfo().filename;
            }
            throw e;
        }
        finally {
            if (mathBypass) {
                context.math = prevMath;
            }
        }
    },
    makeImportant: function () {
        return new Declaration(this.name, this.value, '!important', this.merge, this.getIndex(), this.fileInfo(), this.inline);
    }
});
exports.default = Declaration;
//# sourceMappingURL=declaration.js.map