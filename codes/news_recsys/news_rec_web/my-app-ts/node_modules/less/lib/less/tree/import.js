"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var node_1 = tslib_1.__importDefault(require("./node"));
var media_1 = tslib_1.__importDefault(require("./media"));
var url_1 = tslib_1.__importDefault(require("./url"));
var quoted_1 = tslib_1.__importDefault(require("./quoted"));
var ruleset_1 = tslib_1.__importDefault(require("./ruleset"));
var anonymous_1 = tslib_1.__importDefault(require("./anonymous"));
var utils = tslib_1.__importStar(require("../utils"));
var less_error_1 = tslib_1.__importDefault(require("../less-error"));
//
// CSS @import node
//
// The general strategy here is that we don't want to wait
// for the parsing to be completed, before we start importing
// the file. That's because in the context of a browser,
// most of the time will be spent waiting for the server to respond.
//
// On creation, we push the import path to our import queue, though
// `import,push`, we also pass it a callback, which it'll call once
// the file has been fetched, and parsed.
//
var Import = function (path, features, options, index, currentFileInfo, visibilityInfo) {
    this.options = options;
    this._index = index;
    this._fileInfo = currentFileInfo;
    this.path = path;
    this.features = features;
    this.allowRoot = true;
    if (this.options.less !== undefined || this.options.inline) {
        this.css = !this.options.less || this.options.inline;
    }
    else {
        var pathValue = this.getPath();
        if (pathValue && /[#\.\&\?]css([\?;].*)?$/.test(pathValue)) {
            this.css = true;
        }
    }
    this.copyVisibilityInfo(visibilityInfo);
    this.setParent(this.features, this);
    this.setParent(this.path, this);
};
Import.prototype = Object.assign(new node_1.default(), {
    type: 'Import',
    accept: function (visitor) {
        if (this.features) {
            this.features = visitor.visit(this.features);
        }
        this.path = visitor.visit(this.path);
        if (!this.options.isPlugin && !this.options.inline && this.root) {
            this.root = visitor.visit(this.root);
        }
    },
    genCSS: function (context, output) {
        if (this.css && this.path._fileInfo.reference === undefined) {
            output.add('@import ', this._fileInfo, this._index);
            this.path.genCSS(context, output);
            if (this.features) {
                output.add(' ');
                this.features.genCSS(context, output);
            }
            output.add(';');
        }
    },
    getPath: function () {
        return (this.path instanceof url_1.default) ?
            this.path.value.value : this.path.value;
    },
    isVariableImport: function () {
        var path = this.path;
        if (path instanceof url_1.default) {
            path = path.value;
        }
        if (path instanceof quoted_1.default) {
            return path.containsVariables();
        }
        return true;
    },
    evalForImport: function (context) {
        var path = this.path;
        if (path instanceof url_1.default) {
            path = path.value;
        }
        return new Import(path.eval(context), this.features, this.options, this._index, this._fileInfo, this.visibilityInfo());
    },
    evalPath: function (context) {
        var path = this.path.eval(context);
        var fileInfo = this._fileInfo;
        if (!(path instanceof url_1.default)) {
            // Add the rootpath if the URL requires a rewrite
            var pathValue = path.value;
            if (fileInfo &&
                pathValue &&
                context.pathRequiresRewrite(pathValue)) {
                path.value = context.rewritePath(pathValue, fileInfo.rootpath);
            }
            else {
                path.value = context.normalizePath(path.value);
            }
        }
        return path;
    },
    eval: function (context) {
        var result = this.doEval(context);
        if (this.options.reference || this.blocksVisibility()) {
            if (result.length || result.length === 0) {
                result.forEach(function (node) {
                    node.addVisibilityBlock();
                });
            }
            else {
                result.addVisibilityBlock();
            }
        }
        return result;
    },
    doEval: function (context) {
        var ruleset;
        var registry;
        var features = this.features && this.features.eval(context);
        if (this.options.isPlugin) {
            if (this.root && this.root.eval) {
                try {
                    this.root.eval(context);
                }
                catch (e) {
                    e.message = 'Plugin error during evaluation';
                    throw new less_error_1.default(e, this.root.imports, this.root.filename);
                }
            }
            registry = context.frames[0] && context.frames[0].functionRegistry;
            if (registry && this.root && this.root.functions) {
                registry.addMultiple(this.root.functions);
            }
            return [];
        }
        if (this.skip) {
            if (typeof this.skip === 'function') {
                this.skip = this.skip();
            }
            if (this.skip) {
                return [];
            }
        }
        if (this.options.inline) {
            var contents = new anonymous_1.default(this.root, 0, {
                filename: this.importedFilename,
                reference: this.path._fileInfo && this.path._fileInfo.reference
            }, true, true);
            return this.features ? new media_1.default([contents], this.features.value) : [contents];
        }
        else if (this.css) {
            var newImport = new Import(this.evalPath(context), features, this.options, this._index);
            if (!newImport.css && this.error) {
                throw this.error;
            }
            return newImport;
        }
        else if (this.root) {
            ruleset = new ruleset_1.default(null, utils.copyArray(this.root.rules));
            ruleset.evalImports(context);
            return this.features ? new media_1.default(ruleset.rules, this.features.value) : ruleset.rules;
        }
        else {
            return [];
        }
    }
});
exports.default = Import;
//# sourceMappingURL=import.js.map