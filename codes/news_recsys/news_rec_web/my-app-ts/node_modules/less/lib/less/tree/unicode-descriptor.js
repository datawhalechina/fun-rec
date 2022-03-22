"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var UnicodeDescriptor = function (value) {
    this.value = value;
};
UnicodeDescriptor.prototype = Object.assign(new node_1.default(), {
    type: 'UnicodeDescriptor'
});
exports.default = UnicodeDescriptor;
//# sourceMappingURL=unicode-descriptor.js.map