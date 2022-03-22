"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var function_registry_1 = tslib_1.__importDefault(require("./function-registry"));
var function_caller_1 = tslib_1.__importDefault(require("./function-caller"));
var boolean_1 = tslib_1.__importDefault(require("./boolean"));
var default_1 = tslib_1.__importDefault(require("./default"));
var color_1 = tslib_1.__importDefault(require("./color"));
var color_blending_1 = tslib_1.__importDefault(require("./color-blending"));
var data_uri_1 = tslib_1.__importDefault(require("./data-uri"));
var list_1 = tslib_1.__importDefault(require("./list"));
var math_1 = tslib_1.__importDefault(require("./math"));
var number_1 = tslib_1.__importDefault(require("./number"));
var string_1 = tslib_1.__importDefault(require("./string"));
var svg_1 = tslib_1.__importDefault(require("./svg"));
var types_1 = tslib_1.__importDefault(require("./types"));
exports.default = (function (environment) {
    var functions = { functionRegistry: function_registry_1.default, functionCaller: function_caller_1.default };
    // register functions
    function_registry_1.default.addMultiple(boolean_1.default);
    function_registry_1.default.add('default', default_1.default.eval.bind(default_1.default));
    function_registry_1.default.addMultiple(color_1.default);
    function_registry_1.default.addMultiple(color_blending_1.default);
    function_registry_1.default.addMultiple(data_uri_1.default(environment));
    function_registry_1.default.addMultiple(list_1.default);
    function_registry_1.default.addMultiple(math_1.default);
    function_registry_1.default.addMultiple(number_1.default);
    function_registry_1.default.addMultiple(string_1.default);
    function_registry_1.default.addMultiple(svg_1.default(environment));
    function_registry_1.default.addMultiple(types_1.default);
    return functions;
});
//# sourceMappingURL=index.js.map