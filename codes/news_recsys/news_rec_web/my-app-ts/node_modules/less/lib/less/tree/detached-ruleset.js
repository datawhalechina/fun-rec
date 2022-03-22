"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var contexts_1 = tslib_1.__importDefault(require("../contexts"));
var utils = tslib_1.__importStar(require("../utils"));
var DetachedRuleset = function (ruleset, frames) {
    this.ruleset = ruleset;
    this.frames = frames;
    this.setParent(this.ruleset, this);
};
DetachedRuleset.prototype = Object.assign(new node_1.default(), {
    type: 'DetachedRuleset',
    evalFirst: true,
    accept: function (visitor) {
        this.ruleset = visitor.visit(this.ruleset);
    },
    eval: function (context) {
        var frames = this.frames || utils.copyArray(context.frames);
        return new DetachedRuleset(this.ruleset, frames);
    },
    callEval: function (context) {
        return this.ruleset.eval(this.frames ? new contexts_1.default.Eval(context, this.frames.concat(context.frames)) : context);
    }
});
exports.default = DetachedRuleset;
//# sourceMappingURL=detached-ruleset.js.map