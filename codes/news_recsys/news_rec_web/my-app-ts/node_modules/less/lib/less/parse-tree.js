"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var less_error_1 = tslib_1.__importDefault(require("./less-error"));
var transform_tree_1 = tslib_1.__importDefault(require("./transform-tree"));
var logger_1 = tslib_1.__importDefault(require("./logger"));
function default_1(SourceMapBuilder) {
    var ParseTree = /** @class */ (function () {
        function ParseTree(root, imports) {
            this.root = root;
            this.imports = imports;
        }
        ParseTree.prototype.toCSS = function (options) {
            var evaldRoot;
            var result = {};
            var sourceMapBuilder;
            try {
                evaldRoot = transform_tree_1.default(this.root, options);
            }
            catch (e) {
                throw new less_error_1.default(e, this.imports);
            }
            try {
                var compress = Boolean(options.compress);
                if (compress) {
                    logger_1.default.warn('The compress option has been deprecated. ' +
                        'We recommend you use a dedicated css minifier, for instance see less-plugin-clean-css.');
                }
                var toCSSOptions = {
                    compress: compress,
                    dumpLineNumbers: options.dumpLineNumbers,
                    strictUnits: Boolean(options.strictUnits),
                    numPrecision: 8
                };
                if (options.sourceMap) {
                    sourceMapBuilder = new SourceMapBuilder(options.sourceMap);
                    result.css = sourceMapBuilder.toCSS(evaldRoot, toCSSOptions, this.imports);
                }
                else {
                    result.css = evaldRoot.toCSS(toCSSOptions);
                }
            }
            catch (e) {
                throw new less_error_1.default(e, this.imports);
            }
            if (options.pluginManager) {
                var postProcessors = options.pluginManager.getPostProcessors();
                for (var i = 0; i < postProcessors.length; i++) {
                    result.css = postProcessors[i].process(result.css, { sourceMap: sourceMapBuilder, options: options, imports: this.imports });
                }
            }
            if (options.sourceMap) {
                result.map = sourceMapBuilder.getExternalSourceMap();
            }
            result.imports = [];
            for (var file in this.imports.files) {
                if (this.imports.files.hasOwnProperty(file) && file !== this.imports.rootFilename) {
                    result.imports.push(file);
                }
            }
            return result;
        };
        return ParseTree;
    }());
    return ParseTree;
}
exports.default = default_1;
;
//# sourceMappingURL=parse-tree.js.map