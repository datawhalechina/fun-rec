"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNextKeyDef = getNextKeyDef;
var bracketDict;

(function (bracketDict) {
  bracketDict["{"] = "}";
  bracketDict["["] = "]";
})(bracketDict || (bracketDict = {}));

var legacyModifiers;

(function (legacyModifiers) {
  legacyModifiers["alt"] = "alt";
  legacyModifiers["ctrl"] = "ctrl";
  legacyModifiers["meta"] = "meta";
  legacyModifiers["shift"] = "shift";
})(legacyModifiers || (legacyModifiers = {}));

var legacyKeyMap;
/**
 * Get the next key from keyMap
 *
 * Keys can be referenced by `{key}` or `{special}` as well as physical locations per `[code]`.
 * Everything else will be interpreted as a typed character - e.g. `a`.
 * Brackets `{` and `[` can be escaped by doubling - e.g. `foo[[bar` translates to `foo[bar`.
 * Keeping the key pressed can be written as `{key>}`.
 * When keeping the key pressed you can choose how long (how many keydown and keypress) the key is pressed `{key>3}`.
 * You can then release the key per `{key>3/}` or keep it pressed and continue with the next key.
 * Modifiers like `{shift}` imply being kept pressed. This can be turned of per `{shift/}`.
 */

(function (legacyKeyMap) {
  legacyKeyMap["ctrl"] = "Control";
  legacyKeyMap["del"] = "Delete";
  legacyKeyMap["esc"] = "Escape";
  legacyKeyMap["space"] = " ";
})(legacyKeyMap || (legacyKeyMap = {}));

function getNextKeyDef(text, options) {
  var _options$keyboardMap$;

  const {
    type,
    descriptor,
    consumedLength,
    releasePrevious,
    releaseSelf,
    repeat
  } = readNextDescriptor(text);
  const keyDef = (_options$keyboardMap$ = options.keyboardMap.find(def => {
    if (type === '[') {
      var _def$code;

      return ((_def$code = def.code) == null ? void 0 : _def$code.toLowerCase()) === descriptor.toLowerCase();
    } else if (type === '{') {
      var _def$key;

      const key = mapLegacyKey(descriptor);
      return ((_def$key = def.key) == null ? void 0 : _def$key.toLowerCase()) === key.toLowerCase();
    }

    return def.key === descriptor;
  })) != null ? _options$keyboardMap$ : {
    key: 'Unknown',
    code: 'Unknown',
    [type === '[' ? 'code' : 'key']: descriptor
  };
  return {
    keyDef,
    consumedLength,
    releasePrevious,
    releaseSelf,
    repeat
  };
}

function readNextDescriptor(text) {
  let pos = 0;
  const startBracket = text[pos] in bracketDict ? text[pos] : '';
  pos += startBracket.length; // `foo{{bar` is an escaped char at position 3,
  // but `foo{{{>5}bar` should be treated as `{` pressed down for 5 keydowns.

  const startBracketRepeated = startBracket ? text.match(new RegExp(`^\\${startBracket}+`))[0].length : 0;
  const isEscapedChar = startBracketRepeated === 2 || startBracket === '{' && startBracketRepeated > 3;
  const type = isEscapedChar ? '' : startBracket;
  return {
    type,
    ...(type === '' ? readPrintableChar(text, pos) : readTag(text, pos, type))
  };
}

function readPrintableChar(text, pos) {
  const descriptor = text[pos];
  assertDescriptor(descriptor, text, pos);
  pos += descriptor.length;
  return {
    consumedLength: pos,
    descriptor,
    releasePrevious: false,
    releaseSelf: true,
    repeat: 1
  };
}

function readTag(text, pos, startBracket) {
  var _text$slice$match, _text$slice$match$, _text$slice$match2;

  const releasePreviousModifier = text[pos] === '/' ? '/' : '';
  pos += releasePreviousModifier.length;
  const descriptor = (_text$slice$match = text.slice(pos).match(/^\w+/)) == null ? void 0 : _text$slice$match[0];
  assertDescriptor(descriptor, text, pos);
  pos += descriptor.length;
  const repeatModifier = (_text$slice$match$ = (_text$slice$match2 = text.slice(pos).match(/^>\d+/)) == null ? void 0 : _text$slice$match2[0]) != null ? _text$slice$match$ : '';
  pos += repeatModifier.length;
  const releaseSelfModifier = text[pos] === '/' || !repeatModifier && text[pos] === '>' ? text[pos] : '';
  pos += releaseSelfModifier.length;
  const expectedEndBracket = bracketDict[startBracket];
  const endBracket = text[pos] === expectedEndBracket ? expectedEndBracket : '';

  if (!endBracket) {
    throw new Error(getErrorMessage([!repeatModifier && 'repeat modifier', !releaseSelfModifier && 'release modifier', `"${expectedEndBracket}"`].filter(Boolean).join(' or '), text[pos], text));
  }

  pos += endBracket.length;
  return {
    consumedLength: pos,
    descriptor,
    releasePrevious: !!releasePreviousModifier,
    repeat: repeatModifier ? Math.max(Number(repeatModifier.substr(1)), 1) : 1,
    releaseSelf: hasReleaseSelf(startBracket, descriptor, releaseSelfModifier, repeatModifier)
  };
}

function assertDescriptor(descriptor, text, pos) {
  if (!descriptor) {
    throw new Error(getErrorMessage('key descriptor', text[pos], text));
  }
}

function getEnumValue(f, key) {
  return f[key];
}

function hasReleaseSelf(startBracket, descriptor, releaseSelfModifier, repeatModifier) {
  if (releaseSelfModifier) {
    return releaseSelfModifier === '/';
  }

  if (repeatModifier) {
    return false;
  }

  if (startBracket === '{' && getEnumValue(legacyModifiers, descriptor.toLowerCase())) {
    return false;
  }

  return true;
}

function mapLegacyKey(descriptor) {
  var _getEnumValue;

  return (_getEnumValue = getEnumValue(legacyKeyMap, descriptor)) != null ? _getEnumValue : descriptor;
}

function getErrorMessage(expected, found, text) {
  return `Expected ${expected} but found "${found != null ? found : ''}" in "${text}"
    See https://github.com/testing-library/user-event/blob/main/README.md#keyboardtext-options
    for more information about how userEvent parses your input.`;
}