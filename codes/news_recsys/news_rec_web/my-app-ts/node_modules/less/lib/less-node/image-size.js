"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dimension_1 = tslib_1.__importDefault(require("../less/tree/dimension"));
var expression_1 = tslib_1.__importDefault(require("../less/tree/expression"));
var function_registry_1 = tslib_1.__importDefault(require("./../less/functions/function-registry"));
exports.default = (function (environment) {
    function imageSize(functionContext, filePathNode) {
        var filePath = filePathNode.value;
        var currentFileInfo = functionContext.currentFileInfo;
        var currentDirectory = currentFileInfo.rewriteUrls ?
            currentFileInfo.currentDirectory : currentFileInfo.entryPath;
        var fragmentStart = filePath.indexOf('#');
        var fragment = '';
        if (fragmentStart !== -1) {
            fragment = filePath.slice(fragmentStart);
            filePath = filePath.slice(0, fragmentStart);
        }
        var fileManager = environment.getFileManager(filePath, currentDirectory, functionContext.context, environment, true);
        if (!fileManager) {
            throw {
                type: 'File',
                message: "Can not set up FileManager for " + filePathNode
            };
        }
        var fileSync = fileManager.loadFileSync(filePath, currentDirectory, functionContext.context, environment);
        if (fileSync.error) {
            throw fileSync.error;
        }
        var sizeOf = require('image-size');
        return sizeOf(fileSync.filename);
    }
    var imageFunctions = {
        'image-size': function (filePathNode) {
            var size = imageSize(this, filePathNode);
            return new expression_1.default([
                new dimension_1.default(size.width, 'px'),
                new dimension_1.default(size.height, 'px')
            ]);
        },
        'image-width': function (filePathNode) {
            var size = imageSize(this, filePathNode);
            return new dimension_1.default(size.width, 'px');
        },
        'image-height': function (filePathNode) {
            var size = imageSize(this, filePathNode);
            return new dimension_1.default(size.height, 'px');
        }
    };
    function_registry_1.default.addMultiple(imageFunctions);
});
//# sourceMappingURL=image-size.js.map