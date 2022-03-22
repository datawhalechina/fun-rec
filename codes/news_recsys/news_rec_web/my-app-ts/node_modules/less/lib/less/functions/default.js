"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var keyword_1 = tslib_1.__importDefault(require("../tree/keyword"));
var defaultFunc = {
    eval: function () {
        var v = this.value_;
        var e = this.error_;
        if (e) {
            throw e;
        }
        if (v != null) {
            return v ? keyword_1.default.True : keyword_1.default.False;
        }
    },
    value: function (v) {
        this.value_ = v;
    },
    error: function (e) {
        this.error_ = e;
    },
    reset: function () {
        this.value_ = this.error_ = null;
    }
};
exports.default = defaultFunc;
//# sourceMappingURL=default.js.map