"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var contexts_1 = tslib_1.__importDefault(require("./contexts"));
var parser_1 = tslib_1.__importDefault(require("./parser/parser"));
var plugin_manager_1 = tslib_1.__importDefault(require("./plugin-manager"));
var less_error_1 = tslib_1.__importDefault(require("./less-error"));
var utils = tslib_1.__importStar(require("./utils"));
function default_1(environment, ParseTree, ImportManager) {
    var parse = function (input, options, callback) {
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
                parse.call(self_1, input, options, function (err, output) {
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
            var context_1;
            var rootFileInfo = void 0;
            var pluginManager_1 = new plugin_manager_1.default(this, !options.reUsePluginManager);
            options.pluginManager = pluginManager_1;
            context_1 = new contexts_1.default.Parse(options);
            if (options.rootFileInfo) {
                rootFileInfo = options.rootFileInfo;
            }
            else {
                var filename = options.filename || 'input';
                var entryPath = filename.replace(/[^\/\\]*$/, '');
                rootFileInfo = {
                    filename: filename,
                    rewriteUrls: context_1.rewriteUrls,
                    rootpath: context_1.rootpath || '',
                    currentDirectory: entryPath,
                    entryPath: entryPath,
                    rootFilename: filename
                };
                // add in a missing trailing slash
                if (rootFileInfo.rootpath && rootFileInfo.rootpath.slice(-1) !== '/') {
                    rootFileInfo.rootpath += '/';
                }
            }
            var imports_1 = new ImportManager(this, context_1, rootFileInfo);
            this.importManager = imports_1;
            // TODO: allow the plugins to be just a list of paths or names
            // Do an async plugin queue like lessc
            if (options.plugins) {
                options.plugins.forEach(function (plugin) {
                    var evalResult, contents;
                    if (plugin.fileContent) {
                        contents = plugin.fileContent.replace(/^\uFEFF/, '');
                        evalResult = pluginManager_1.Loader.evalPlugin(contents, context_1, imports_1, plugin.options, plugin.filename);
                        if (evalResult instanceof less_error_1.default) {
                            return callback(evalResult);
                        }
                    }
                    else {
                        pluginManager_1.addPlugin(plugin);
                    }
                });
            }
            new parser_1.default(context_1, imports_1, rootFileInfo)
                .parse(input, function (e, root) {
                if (e) {
                    return callback(e);
                }
                callback(null, root, imports_1, options);
            }, options);
        }
    };
    return parse;
}
exports.default = default_1;
;
//# sourceMappingURL=parse.js.map