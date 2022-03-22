"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var function_registry_1 = tslib_1.__importDefault(require("./../less/functions/function-registry"));
exports.default = (function () {
    function imageSize() {
        throw {
            type: 'Runtime',
            message: 'Image size functions are not supported in browser version of less'
        };
    }
    var imageFunctions = {
        'image-size': function (filePathNode) {
            imageSize(this, filePathNode);
            return -1;
        },
        'image-width': function (filePathNode) {
            imageSize(this, filePathNode);
            return -1;
        },
        'image-height': function (filePathNode) {
            imageSize(this, filePathNode);
            return -1;
        }
    };
    function_registry_1.default.addMultiple(imageFunctions);
});
//# sourceMappingURL=image-size.js.map