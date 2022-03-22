"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var _noSpaceCombinators = {
    '': true,
    ' ': true,
    '|': true
};
var Combinator = function (value) {
    if (value === ' ') {
        this.value = ' ';
        this.emptyOrWhitespace = true;
    }
    else {
        this.value = value ? value.trim() : '';
        this.emptyOrWhitespace = this.value === '';
    }
};
Combinator.prototype = Object.assign(new node_1.default(), {
    type: 'Combinator',
    genCSS: function (context, output) {
        var spaceOrEmpty = (context.compress || _noSpaceCombinators[this.value]) ? '' : ' ';
        output.add(spaceOrEmpty + this.value + spaceOrEmpty);
    }
});
exports.default = Combinator;
//# sourceMappingURL=combinator.js.map