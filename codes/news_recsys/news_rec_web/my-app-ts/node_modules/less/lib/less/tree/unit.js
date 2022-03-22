"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var unit_conversions_1 = tslib_1.__importDefault(require("../data/unit-conversions"));
var utils = tslib_1.__importStar(require("../utils"));
var Unit = function (numerator, denominator, backupUnit) {
    this.numerator = numerator ? utils.copyArray(numerator).sort() : [];
    this.denominator = denominator ? utils.copyArray(denominator).sort() : [];
    if (backupUnit) {
        this.backupUnit = backupUnit;
    }
    else if (numerator && numerator.length) {
        this.backupUnit = numerator[0];
    }
};
Unit.prototype = Object.assign(new node_1.default(), {
    type: 'Unit',
    clone: function () {
        return new Unit(utils.copyArray(this.numerator), utils.copyArray(this.denominator), this.backupUnit);
    },
    genCSS: function (context, output) {
        // Dimension checks the unit is singular and throws an error if in strict math mode.
        var strictUnits = context && context.strictUnits;
        if (this.numerator.length === 1) {
            output.add(this.numerator[0]); // the ideal situation
        }
        else if (!strictUnits && this.backupUnit) {
            output.add(this.backupUnit);
        }
        else if (!strictUnits && this.denominator.length) {
            output.add(this.denominator[0]);
        }
    },
    toString: function () {
        var i, returnStr = this.numerator.join('*');
        for (i = 0; i < this.denominator.length; i++) {
            returnStr += "/" + this.denominator[i];
        }
        return returnStr;
    },
    compare: function (other) {
        return this.is(other.toString()) ? 0 : undefined;
    },
    is: function (unitString) {
        return this.toString().toUpperCase() === unitString.toUpperCase();
    },
    isLength: function () {
        return RegExp('^(px|em|ex|ch|rem|in|cm|mm|pc|pt|ex|vw|vh|vmin|vmax)$', 'gi').test(this.toCSS());
    },
    isEmpty: function () {
        return this.numerator.length === 0 && this.denominator.length === 0;
    },
    isSingular: function () {
        return this.numerator.length <= 1 && this.denominator.length === 0;
    },
    map: function (callback) {
        var i;
        for (i = 0; i < this.numerator.length; i++) {
            this.numerator[i] = callback(this.numerator[i], false);
        }
        for (i = 0; i < this.denominator.length; i++) {
            this.denominator[i] = callback(this.denominator[i], true);
        }
    },
    usedUnits: function () {
        var group;
        var result = {};
        var mapUnit;
        var groupName;
        mapUnit = function (atomicUnit) {
            /* jshint loopfunc:true */
            if (group.hasOwnProperty(atomicUnit) && !result[groupName]) {
                result[groupName] = atomicUnit;
            }
            return atomicUnit;
        };
        for (groupName in unit_conversions_1.default) {
            if (unit_conversions_1.default.hasOwnProperty(groupName)) {
                group = unit_conversions_1.default[groupName];
                this.map(mapUnit);
            }
        }
        return result;
    },
    cancel: function () {
        var counter = {};
        var atomicUnit;
        var i;
        for (i = 0; i < this.numerator.length; i++) {
            atomicUnit = this.numerator[i];
            counter[atomicUnit] = (counter[atomicUnit] || 0) + 1;
        }
        for (i = 0; i < this.denominator.length; i++) {
            atomicUnit = this.denominator[i];
            counter[atomicUnit] = (counter[atomicUnit] || 0) - 1;
        }
        this.numerator = [];
        this.denominator = [];
        for (atomicUnit in counter) {
            if (counter.hasOwnProperty(atomicUnit)) {
                var count = counter[atomicUnit];
                if (count > 0) {
                    for (i = 0; i < count; i++) {
                        this.numerator.push(atomicUnit);
                    }
                }
                else if (count < 0) {
                    for (i = 0; i < -count; i++) {
                        this.denominator.push(atomicUnit);
                    }
                }
            }
        }
        this.numerator.sort();
        this.denominator.sort();
    }
});
exports.default = Unit;
//# sourceMappingURL=unit.js.map