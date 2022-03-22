"use strict";
// TODO: Add tests for browser @plugin
/* global window */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var abstract_plugin_loader_js_1 = tslib_1.__importDefault(require("../less/environment/abstract-plugin-loader.js"));
/**
 * Browser Plugin Loader
 */
var PluginLoader = function (less) {
    this.less = less;
    // Should we shim this.require for browser? Probably not?
};
PluginLoader.prototype = Object.assign(new abstract_plugin_loader_js_1.default(), {
    loadPlugin: function (filename, basePath, context, environment, fileManager) {
        return new Promise(function (fulfill, reject) {
            fileManager.loadFile(filename, basePath, context, environment)
                .then(fulfill).catch(reject);
        });
    }
});
exports.default = PluginLoader;
//# sourceMappingURL=plugin-loader.js.map