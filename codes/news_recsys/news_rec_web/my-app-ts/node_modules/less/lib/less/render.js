"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var utils = tslib_1.__importStar(require("./utils"));
function default_1(environment, ParseTree, ImportManager) {
    var render = function (input, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = utils.copyOptions(this.options, {});
        }
        else {
            options = utils.copyOptions(this.options, options || {});
        }
        if (!callback) {
            var self_1 = this;
            return new Promise(function (resolve, reject) {
                render.call(self_1, input, options, function (err, output) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(output);
                    }
                });
            });
        }
        else {
            this.parse(input, options, function (err, root, imports, options) {
                if (err) {
                    return callback(err);
                }
                var result;
                try {
                    var parseTree = new ParseTree(root, imports);
                    result = parseTree.toCSS(options);
                }
                catch (err) {
                    return callback(err);
                }
                callback(null, result);
            });
        }
    };
    return render;
}
exports.default = default_1;
;
//# sourceMappingURL=render.js.map