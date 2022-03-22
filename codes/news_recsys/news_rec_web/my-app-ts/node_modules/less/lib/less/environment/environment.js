"use strict";
/**
 * @todo Document why this abstraction exists, and the relationship between
 *       environment, file managers, and plugin manager
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var logger_1 = tslib_1.__importDefault(require("../logger"));
var Environment = /** @class */ (function () {
    function Environment(externalEnvironment, fileManagers) {
        this.fileManagers = fileManagers || [];
        externalEnvironment = externalEnvironment || {};
        var optionalFunctions = ['encodeBase64', 'mimeLookup', 'charsetLookup', 'getSourceMapGenerator'];
        var requiredFunctions = [];
        var functions = requiredFunctions.concat(optionalFunctions);
        for (var i = 0; i < functions.length; i++) {
            var propName = functions[i];
            var environmentFunc = externalEnvironment[propName];
            if (environmentFunc) {
                this[propName] = environmentFunc.bind(externalEnvironment);
            }
            else if (i < requiredFunctions.length) {
                this.warn("missing required function in environment - " + propName);
            }
        }
    }
    Environment.prototype.getFileManager = function (filename, currentDirectory, options, environment, isSync) {
        if (!filename) {
            logger_1.default.warn('getFileManager called with no filename.. Please report this issue. continuing.');
        }
        if (currentDirectory == null) {
            logger_1.default.warn('getFileManager called with null directory.. Please report this issue. continuing.');
        }
        var fileManagers = this.fileManagers;
        if (options.pluginManager) {
            fileManagers = [].concat(fileManagers).concat(options.pluginManager.getFileManagers());
        }
        for (var i = fileManagers.length - 1; i >= 0; i--) {
            var fileManager = fileManagers[i];
            if (fileManager[isSync ? 'supportsSync' : 'supports'](filename, currentDirectory, options, environment)) {
                return fileManager;
            }
        }
        return null;
    };
    Environment.prototype.addFileManager = function (fileManager) {
        this.fileManagers.push(fileManager);
    };
    Environment.prototype.clearFileManagers = function () {
        this.fileManagers = [];
    };
    return Environment;
}());
exports.default = Environment;
//# sourceMappingURL=environment.js.map