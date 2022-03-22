"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var variable_1 = tslib_1.__importDefault(require("./variable"));
var ruleset_1 = tslib_1.__importDefault(require("./ruleset"));
var selector_1 = tslib_1.__importDefault(require("./selector"));
var NamespaceValue = function (ruleCall, lookups, index, fileInfo) {
    this.value = ruleCall;
    this.lookups = lookups;
    this._index = index;
    this._fileInfo = fileInfo;
};
NamespaceValue.prototype = Object.assign(new node_1.default(), {
    type: 'NamespaceValue',
    eval: function (context) {
        var i, j, name, rules = this.value.eval(context);
        for (i = 0; i < this.lookups.length; i++) {
            name = this.lookups[i];
            /**
             * Eval'd DRs return rulesets.
             * Eval'd mixins return rules, so let's make a ruleset if we need it.
             * We need to do this because of late parsing of values
             */
            if (Array.isArray(rules)) {
                rules = new ruleset_1.default([new selector_1.default()], rules);
            }
            if (name === '') {
                rules = rules.lastDeclaration();
            }
            else if (name.charAt(0) === '@') {
                if (name.charAt(1) === '@') {
                    name = "@" + new variable_1.default(name.substr(1)).eval(context).value;
                }
                if (rules.variables) {
                    rules = rules.variable(name);
                }
                if (!rules) {
                    throw { type: 'Name',
                        message: "variable " + name + " not found",
                        filename: this.fileInfo().filename,
                        index: this.getIndex() };
                }
            }
            else {
                if (name.substring(0, 2) === '$@') {
                    name = "$" + new variable_1.default(name.substr(1)).eval(context).value;
                }
                else {
                    name = name.charAt(0) === '$' ? name : "$" + name;
                }
                if (rules.properties) {
                    rules = rules.property(name);
                }
                if (!rules) {
                    throw { type: 'Name',
                        message: "property \"" + name.substr(1) + "\" not found",
                        filename: this.fileInfo().filename,
                        index: this.getIndex() };
                }
                // Properties are an array of values, since a ruleset can have multiple props.
                // We pick the last one (the "cascaded" value)
                rules = rules[rules.length - 1];
            }
            if (rules.value) {
                rules = rules.eval(context).value;
            }
            if (rules.ruleset) {
                rules = rules.ruleset.eval(context);
            }
        }
        return rules;
    }
});
exports.default = NamespaceValue;
//# sourceMappingURL=namespace-value.js.map