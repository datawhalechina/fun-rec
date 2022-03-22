"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nesting = nesting;
var _postcss = _interopRequireDefault(require("postcss"));
var _postcssNested = _interopRequireDefault(require("postcss-nested"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function nesting(opts = _postcssNested.default) {
    return (root, result)=>{
        root.walkAtRules('screen', (rule)=>{
            rule.name = 'media';
            rule.params = `screen(${rule.params})`;
        });
        root.walkAtRules('apply', (rule)=>{
            rule.before(_postcss.default.decl({
                prop: '__apply',
                value: rule.params,
                source: rule.source
            }));
            rule.remove();
        });
        let plugin = (()=>{
            var ref;
            if (typeof opts === 'function' || typeof opts === 'object' && (opts === null || opts === void 0 ? void 0 : (ref = opts.hasOwnProperty) === null || ref === void 0 ? void 0 : ref.call(opts, 'postcssPlugin'))) {
                return opts;
            }
            if (typeof opts === 'string') {
                return require(opts);
            }
            if (Object.keys(opts).length <= 0) {
                return _postcssNested.default;
            }
            throw new Error('tailwindcss/nesting should be loaded with a nesting plugin.');
        })();
        (0, _postcss).default([
            plugin
        ]).process(root, result.opts).sync();
        root.walkDecls('__apply', (decl)=>{
            decl.before(_postcss.default.atRule({
                name: 'apply',
                params: decl.value,
                source: decl.source
            }));
            decl.remove();
        });
        return root;
    };
}
