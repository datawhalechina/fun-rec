"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path_1 = tslib_1.__importDefault(require("path"));
var abstract_plugin_loader_js_1 = tslib_1.__importDefault(require("../less/environment/abstract-plugin-loader.js"));
/**
 * Node Plugin Loader
 */
var PluginLoader = function (less) {
    this.less = less;
    this.require = function (prefix) {
        prefix = path_1.default.dirname(prefix);
        return function (id) {
            var str = id.substr(0, 2);
            if (str === '..' || str === './') {
                return require(path_1.default.join(prefix, id));
            }
            else {
                return require(id);
            }
        };
    };
};
PluginLoader.prototype = Object.assign(new abstract_plugin_loader_js_1.default(), {
    loadPlugin: function (filename, basePath, context, environment, fileManager) {
        var prefix = filename.slice(0, 1);
        var explicit = prefix === '.' || prefix === '/' || filename.slice(-3).toLowerCase() === '.js';
        if (!explicit) {
            context.prefixes = ['less-plugin-', ''];
        }
        if (context.syncImport) {
            return fileManager.loadFileSync(filename, basePath, context, environment);
        }
        return new Promise(function (fulfill, reject) {
            fileManager.loadFile(filename, basePath, context, environment).then(function (data) {
                try {
                    fulfill(data);
                }
                catch (e) {
                    console.log(e);
                    reject(e);
                }
            }).catch(function (err) {
                reject(err);
            });
        });
    },
    loadPluginSync: function (filename, basePath, context, environment, fileManager) {
        context.syncImport = true;
        return this.loadPlugin(filename, basePath, context, environment, fileManager);
    }
});
exports.default = PluginLoader;
//# sourceMappingURL=plugin-loader.js.map