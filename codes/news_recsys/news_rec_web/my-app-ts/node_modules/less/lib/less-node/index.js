"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var environment_1 = tslib_1.__importDefault(require("./environment"));
var file_manager_1 = tslib_1.__importDefault(require("./file-manager"));
var url_file_manager_1 = tslib_1.__importDefault(require("./url-file-manager"));
var less_1 = tslib_1.__importDefault(require("../less"));
var less = less_1.default(environment_1.default, [new file_manager_1.default(), new url_file_manager_1.default()]);
var lessc_helper_1 = tslib_1.__importDefault(require("./lessc-helper"));
// allow people to create less with their own environment
less.createFromEnvironment = less_1.default;
less.lesscHelper = lessc_helper_1.default;
less.PluginLoader = require('./plugin-loader').default;
less.fs = require('./fs').default;
less.FileManager = file_manager_1.default;
less.UrlFileManager = url_file_manager_1.default;
// Set up options
less.options = require('../less/default-options').default();
// provide image-size functionality
require('./image-size').default(less.environment);
exports.default = less;
//# sourceMappingURL=index.js.map