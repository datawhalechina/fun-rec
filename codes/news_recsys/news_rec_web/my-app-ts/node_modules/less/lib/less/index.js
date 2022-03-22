"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var environment_1 = tslib_1.__importDefault(require("./environment/environment"));
var data_1 = tslib_1.__importDefault(require("./data"));
var tree_1 = tslib_1.__importDefault(require("./tree"));
var abstract_file_manager_1 = tslib_1.__importDefault(require("./environment/abstract-file-manager"));
var abstract_plugin_loader_1 = tslib_1.__importDefault(require("./environment/abstract-plugin-loader"));
var visitors_1 = tslib_1.__importDefault(require("./visitors"));
var parser_1 = tslib_1.__importDefault(require("./parser/parser"));
var functions_1 = tslib_1.__importDefault(require("./functions"));
var contexts_1 = tslib_1.__importDefault(require("./contexts"));
var less_error_1 = tslib_1.__importDefault(require("./less-error"));
var transform_tree_1 = tslib_1.__importDefault(require("./transform-tree"));
var utils = tslib_1.__importStar(require("./utils"));
var plugin_manager_1 = tslib_1.__importDefault(require("./plugin-manager"));
var logger_1 = tslib_1.__importDefault(require("./logger"));
var source_map_output_1 = tslib_1.__importDefault(require("./source-map-output"));
var source_map_builder_1 = tslib_1.__importDefault(require("./source-map-builder"));
var parse_tree_1 = tslib_1.__importDefault(require("./parse-tree"));
var import_manager_1 = tslib_1.__importDefault(require("./import-manager"));
var parse_1 = tslib_1.__importDefault(require("./parse"));
var render_1 = tslib_1.__importDefault(require("./render"));
var package_json_1 = require("../../package.json");
var parse_node_version_1 = tslib_1.__importDefault(require("parse-node-version"));
function default_1(environment, fileManagers) {
    var sourceMapOutput, sourceMapBuilder, parseTree, importManager;
    environment = new environment_1.default(environment, fileManagers);
    sourceMapOutput = source_map_output_1.default(environment);
    sourceMapBuilder = source_map_builder_1.default(sourceMapOutput, environment);
    parseTree = parse_tree_1.default(sourceMapBuilder);
    importManager = import_manager_1.default(environment);
    var render = render_1.default(environment, parseTree, importManager);
    var parse = parse_1.default(environment, parseTree, importManager);
    var v = parse_node_version_1.default("v" + package_json_1.version);
    var initial = {
        version: [v.major, v.minor, v.patch],
        data: data_1.default,
        tree: tree_1.default,
        Environment: environment_1.default,
        AbstractFileManager: abstract_file_manager_1.default,
        AbstractPluginLoader: abstract_plugin_loader_1.default,
        environment: environment,
        visitors: visitors_1.default,
        Parser: parser_1.default,
        functions: functions_1.default(environment),
        contexts: contexts_1.default,
        SourceMapOutput: sourceMapOutput,
        SourceMapBuilder: sourceMapBuilder,
        ParseTree: parseTree,
        ImportManager: importManager,
        render: render,
        parse: parse,
        LessError: less_error_1.default,
        transformTree: transform_tree_1.default,
        utils: utils,
        PluginManager: plugin_manager_1.default,
        logger: logger_1.default
    };
    // Create a public API
    var ctor = function (t) {
        return function () {
            var obj = Object.create(t.prototype);
            t.apply(obj, Array.prototype.slice.call(arguments, 0));
            return obj;
        };
    };
    var t;
    var api = Object.create(initial);
    for (var n in initial.tree) {
        /* eslint guard-for-in: 0 */
        t = initial.tree[n];
        if (typeof t === 'function') {
            api[n.toLowerCase()] = ctor(t);
        }
        else {
            api[n] = Object.create(null);
            for (var o in t) {
                /* eslint guard-for-in: 0 */
                api[n][o.toLowerCase()] = ctor(t[o]);
            }
        }
    }
    /**
     * Some of the functions assume a `this` context of the API object,
     * which causes it to fail when wrapped for ES6 imports.
     *
     * An assumed `this` should be removed in the future.
     */
    initial.parse = initial.parse.bind(api);
    initial.render = initial.render.bind(api);
    return api;
}
exports.default = default_1;
;
//# sourceMappingURL=index.js.map