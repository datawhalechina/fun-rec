"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var debug_info_1 = tslib_1.__importDefault(require("./debug-info"));
var Comment = function (value, isLineComment, index, currentFileInfo) {
    this.value = value;
    this.isLineComment = isLineComment;
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.allowRoot = true;
};
Comment.prototype = Object.assign(new node_1.default(), {
    type: 'Comment',
    genCSS: function (context, output) {
        if (this.debugInfo) {
            output.add(debug_info_1.default(context, this), this.fileInfo(), this.getIndex());
        }
        output.add(this.value);
    },
    isSilent: function (context) {
        var isCompressed = context.compress && this.value[2] !== '!';
        return this.isLineComment || isCompressed;
    }
});
exports.default = Comment;
//# sourceMappingURL=comment.js.map