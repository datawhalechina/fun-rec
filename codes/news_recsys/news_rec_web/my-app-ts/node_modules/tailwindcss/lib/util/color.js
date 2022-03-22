"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.parseColor = parseColor;
exports.formatColor = formatColor;
var _colorName = _interopRequireDefault(require("color-name"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
let HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
let SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i;
let VALUE = `(?:\\d+|\\d*\\.\\d+)%?`;
let SEP = `(?:\\s*,\\s*|\\s+)`;
let ALPHA_SEP = `\\s*[,/]\\s*`;
let RGB = new RegExp(`^rgba?\\(\\s*(${VALUE})${SEP}(${VALUE})${SEP}(${VALUE})(?:${ALPHA_SEP}(${VALUE}))?\\s*\\)$`);
let HSL = new RegExp(`^hsla?\\(\\s*((?:${VALUE})(?:deg|rad|grad|turn)?)${SEP}(${VALUE})${SEP}(${VALUE})(?:${ALPHA_SEP}(${VALUE}))?\\s*\\)$`);
function parseColor(value) {
    if (typeof value !== 'string') {
        return null;
    }
    value = value.trim();
    if (value === 'transparent') {
        return {
            mode: 'rgb',
            color: [
                '0',
                '0',
                '0'
            ],
            alpha: '0'
        };
    }
    if (value in _colorName.default) {
        return {
            mode: 'rgb',
            color: _colorName.default[value].map((v)=>v.toString()
            )
        };
    }
    let hex = value.replace(SHORT_HEX, (_, r, g, b, a)=>[
            '#',
            r,
            r,
            g,
            g,
            b,
            b,
            a ? a + a : ''
        ].join('')
    ).match(HEX);
    if (hex !== null) {
        return {
            mode: 'rgb',
            color: [
                parseInt(hex[1], 16),
                parseInt(hex[2], 16),
                parseInt(hex[3], 16)
            ].map((v)=>v.toString()
            ),
            alpha: hex[4] ? (parseInt(hex[4], 16) / 255).toString() : undefined
        };
    }
    let rgbMatch = value.match(RGB);
    if (rgbMatch !== null) {
        var ref, ref1;
        return {
            mode: 'rgb',
            color: [
                rgbMatch[1],
                rgbMatch[2],
                rgbMatch[3]
            ].map((v)=>v.toString()
            ),
            alpha: (ref = rgbMatch[4]) === null || ref === void 0 ? void 0 : (ref1 = ref.toString) === null || ref1 === void 0 ? void 0 : ref1.call(ref)
        };
    }
    let hslMatch = value.match(HSL);
    if (hslMatch !== null) {
        var ref2, ref3;
        return {
            mode: 'hsl',
            color: [
                hslMatch[1],
                hslMatch[2],
                hslMatch[3]
            ].map((v)=>v.toString()
            ),
            alpha: (ref2 = hslMatch[4]) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.toString) === null || ref3 === void 0 ? void 0 : ref3.call(ref2)
        };
    }
    return null;
}
function formatColor({ mode , color , alpha  }) {
    let hasAlpha = alpha !== undefined;
    return `${mode}(${color.join(' ')}${hasAlpha ? ` / ${alpha}` : ''})`;
}
