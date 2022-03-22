"use strict";
var _setupTrackingContext = _interopRequireDefault(require("./lib/setupTrackingContext"));
var _processTailwindFeatures = _interopRequireDefault(require("./processTailwindFeatures"));
var _sharedState = require("./lib/sharedState");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
module.exports = function tailwindcss(configOrPath) {
    return {
        postcssPlugin: 'tailwindcss',
        plugins: [
            _sharedState.env.DEBUG && function(root) {
                console.log('\n');
                console.time('JIT TOTAL');
                return root;
            },
            function(root, result) {
                (0, _processTailwindFeatures).default((0, _setupTrackingContext).default(configOrPath))(root, result);
            },
            _sharedState.env.DEBUG && function(root) {
                console.timeEnd('JIT TOTAL');
                console.log('\n');
                return root;
            }, 
        ].filter(Boolean)
    };
};
module.exports.postcss = true;
