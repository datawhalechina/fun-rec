"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.formatVariantSelector = formatVariantSelector;
exports.finalizeSelector = finalizeSelector;
exports.selectorFunctions = void 0;
var _postcssSelectorParser = _interopRequireDefault(require("postcss-selector-parser"));
var _unesc = _interopRequireDefault(require("postcss-selector-parser/dist/util/unesc"));
var _escapeClassName = _interopRequireDefault(require("../util/escapeClassName"));
var _prefixSelector = _interopRequireDefault(require("../util/prefixSelector"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let MERGE = ':merge';
let PARENT = '&';
let selectorFunctions = new Set([
    MERGE
]);
exports.selectorFunctions = selectorFunctions;
function formatVariantSelector(current, ...others) {
    for (let other of others){
        let incomingValue = resolveFunctionArgument(other, MERGE);
        if (incomingValue !== null) {
            let existingValue = resolveFunctionArgument(current, MERGE, incomingValue);
            if (existingValue !== null) {
                let existingTarget = `${MERGE}(${incomingValue})`;
                let splitIdx = other.indexOf(existingTarget);
                let addition = other.slice(splitIdx + existingTarget.length).split(' ')[0];
                current = current.replace(existingTarget, existingTarget + addition);
                continue;
            }
        }
        current = other.replace(PARENT, current);
    }
    return current;
}
function finalizeSelector(format, { selector: selector1 , candidate , context  }) {
    var ref, ref1;
    var ref2;
    let separator = (ref2 = context === null || context === void 0 ? void 0 : (ref = context.tailwindConfig) === null || ref === void 0 ? void 0 : ref.separator) !== null && ref2 !== void 0 ? ref2 : ':';
    // Split by the separator, but ignore the separator inside square brackets:
    //
    // E.g.: dark:lg:hover:[paint-order:markers]
    //           ┬  ┬     ┬            ┬
    //           │  │     │            ╰── We will not split here
    //           ╰──┴─────┴─────────────── We will split here
    //
    let splitter = new RegExp(`\\${separator}(?![^[]*\\])`);
    let base = candidate.split(splitter).pop();
    if (context === null || context === void 0 ? void 0 : (ref1 = context.tailwindConfig) === null || ref1 === void 0 ? void 0 : ref1.prefix) {
        format = (0, _prefixSelector).default(context.tailwindConfig.prefix, format);
    }
    format = format.replace(PARENT, `.${(0, _escapeClassName).default(candidate)}`);
    // Normalize escaped classes, e.g.:
    //
    // The idea would be to replace the escaped `base` in the selector with the
    // `format`. However, in css you can escape the same selector in a few
    // different ways. This would result in different strings and therefore we
    // can't replace it properly.
    //
    //               base: bg-[rgb(255,0,0)]
    //   base in selector: bg-\\[rgb\\(255\\,0\\,0\\)\\]
    //       escaped base: bg-\\[rgb\\(255\\2c 0\\2c 0\\)\\]
    //
    selector1 = (0, _postcssSelectorParser).default((selectors)=>{
        return selectors.walkClasses((node)=>{
            if (node.raws && node.value.includes(base)) {
                node.raws.value = (0, _escapeClassName).default((0, _unesc).default(node.raws.value));
            }
            return node;
        });
    }).processSync(selector1);
    // We can safely replace the escaped base now, since the `base` section is
    // now in a normalized escaped value.
    selector1 = selector1.replace(`.${(0, _escapeClassName).default(base)}`, format);
    // Remove unnecessary pseudo selectors that we used as placeholders
    return (0, _postcssSelectorParser).default((selectors)=>{
        return selectors.map((selector2)=>{
            selector2.walkPseudos((p)=>{
                if (selectorFunctions.has(p.value)) {
                    p.replaceWith(p.nodes);
                }
                return p;
            });
            // This will make sure to move pseudo's to the correct spot (the end for
            // pseudo elements) because otherwise the selector will never work
            // anyway.
            //
            // E.g.:
            //  - `before:hover:text-center` would result in `.before\:hover\:text-center:hover::before`
            //  - `hover:before:text-center` would result in `.hover\:before\:text-center:hover::before`
            //
            // `::before:hover` doesn't work, which means that we can make it work for you by flipping the order.
            function collectPseudoElements(selector) {
                let nodes = [];
                for (let node of selector.nodes){
                    if (isPseudoElement(node)) {
                        nodes.push(node);
                        selector.removeChild(node);
                    }
                    if (node === null || node === void 0 ? void 0 : node.nodes) {
                        nodes.push(...collectPseudoElements(node));
                    }
                }
                return nodes;
            }
            let pseudoElements = collectPseudoElements(selector2);
            if (pseudoElements.length > 0) {
                selector2.nodes.push(pseudoElements.sort(sortSelector));
            }
            return selector2;
        });
    }).processSync(selector1);
}
// Note: As a rule, double colons (::) should be used instead of a single colon
// (:). This distinguishes pseudo-classes from pseudo-elements. However, since
// this distinction was not present in older versions of the W3C spec, most
// browsers support both syntaxes for the original pseudo-elements.
let pseudoElementsBC = [
    ':before',
    ':after',
    ':first-line',
    ':first-letter'
];
// These pseudo-elements _can_ be combined with other pseudo selectors AND the order does matter.
let pseudoElementExceptions = [
    '::file-selector-button'
];
// This will make sure to move pseudo's to the correct spot (the end for
// pseudo elements) because otherwise the selector will never work
// anyway.
//
// E.g.:
//  - `before:hover:text-center` would result in `.before\:hover\:text-center:hover::before`
//  - `hover:before:text-center` would result in `.hover\:before\:text-center:hover::before`
//
// `::before:hover` doesn't work, which means that we can make it work
// for you by flipping the order.
function sortSelector(a, z) {
    // Both nodes are non-pseudo's so we can safely ignore them and keep
    // them in the same order.
    if (a.type !== 'pseudo' && z.type !== 'pseudo') {
        return 0;
    }
    // If one of them is a combinator, we need to keep it in the same order
    // because that means it will start a new "section" in the selector.
    if (a.type === 'combinator' ^ z.type === 'combinator') {
        return 0;
    }
    // One of the items is a pseudo and the other one isn't. Let's move
    // the pseudo to the right.
    if (a.type === 'pseudo' ^ z.type === 'pseudo') {
        return (a.type === 'pseudo') - (z.type === 'pseudo');
    }
    // Both are pseudo's, move the pseudo elements (except for
    // ::file-selector-button) to the right.
    return isPseudoElement(a) - isPseudoElement(z);
}
function isPseudoElement(node) {
    if (node.type !== 'pseudo') return false;
    if (pseudoElementExceptions.includes(node.value)) return false;
    return node.value.startsWith('::') || pseudoElementsBC.includes(node.value);
}
function resolveFunctionArgument(haystack, needle, arg) {
    let startIdx = haystack.indexOf(arg ? `${needle}(${arg})` : needle);
    if (startIdx === -1) return null;
    // Start inside the `(`
    startIdx += needle.length + 1;
    let target = '';
    let count = 0;
    for (let char of haystack.slice(startIdx)){
        if (char !== '(' && char !== ')') {
            target += char;
        } else if (char === '(') {
            target += char;
            count++;
        } else if (char === ')') {
            if (--count < 0) break; // unbalanced
            target += char;
        }
    }
    return target;
}
