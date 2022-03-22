"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
function escapePath(path) {
    return path.replace(/[\(\)'"\s]/g, function (match) { return "\\" + match; });
}
var URL = function (val, index, currentFileInfo, isEvald) {
    this.value = val;
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.isEvald = isEvald;
};
URL.prototype = Object.assign(new node_1.default(), {
    type: 'Url',
    accept: function (visitor) {
        this.value = visitor.visit(this.value);
    },
    genCSS: function (context, output) {
        output.add('url(');
        this.value.genCSS(context, output);
        output.add(')');
    },
    eval: function (context) {
        var val = this.value.eval(context);
        var rootpath;
        if (!this.isEvald) {
            // Add the rootpath if the URL requires a rewrite
            rootpath = this.fileInfo() && this.fileInfo().rootpath;
            if (typeof rootpath === 'string' &&
                typeof val.value === 'string' &&
                context.pathRequiresRewrite(val.value)) {
                if (!val.quote) {
                    rootpath = escapePath(rootpath);
                }
                val.value = context.rewritePath(val.value, rootpath);
            }
            else {
                val.value = context.normalizePath(val.value);
            }
            // Add url args if enabled
            if (context.urlArgs) {
                if (!val.value.match(/^\s*data:/)) {
                    var delimiter = val.value.indexOf('?') === -1 ? '?' : '&';
                    var urlArgs = delimiter + context.urlArgs;
                    if (val.value.indexOf('#') !== -1) {
                        val.value = val.value.replace('#', urlArgs + "#");
                    }
                    else {
                        val.value += urlArgs;
                    }
                }
            }
        }
        return new URL(val, this.getIndex(), this.fileInfo(), true);
    }
});
exports.default = URL;
//# sourceMappingURL=url.js.map