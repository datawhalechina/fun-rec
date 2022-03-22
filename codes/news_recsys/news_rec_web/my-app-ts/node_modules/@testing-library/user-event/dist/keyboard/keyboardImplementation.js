"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyboardImplementation = keyboardImplementation;
exports.releaseAllKeys = releaseAllKeys;

var _dom = require("@testing-library/dom");

var _utils = require("../utils");

var _getNextKeyDef = require("./getNextKeyDef");

var plugins = _interopRequireWildcard(require("./plugins"));

var _getEventProps = require("./getEventProps");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

async function keyboardImplementation(text, options, state) {
  var _state$repeatKey;

  const {
    document
  } = options;

  const getCurrentElement = () => getActive(document);

  const {
    keyDef,
    consumedLength,
    releasePrevious,
    releaseSelf,
    repeat
  } = (_state$repeatKey = state.repeatKey) != null ? _state$repeatKey : (0, _getNextKeyDef.getNextKeyDef)(text, options);
  const replace = applyPlugins(plugins.replaceBehavior, keyDef, getCurrentElement(), options, state);

  if (!replace) {
    const pressed = state.pressed.find(p => p.keyDef === keyDef); // Release the key automatically if it was pressed before.
    // Do not release the key on iterations on `state.repeatKey`.

    if (pressed && !state.repeatKey) {
      keyup(keyDef, getCurrentElement, options, state, pressed.unpreventedDefault);
    }

    if (!releasePrevious) {
      const unpreventedDefault = keydown(keyDef, getCurrentElement, options, state);

      if (unpreventedDefault && hasKeyPress(keyDef, state)) {
        keypress(keyDef, getCurrentElement, options, state);
      } // Release the key only on the last iteration on `state.repeatKey`.


      if (releaseSelf && repeat <= 1) {
        keyup(keyDef, getCurrentElement, options, state, unpreventedDefault);
      }
    }
  }

  if (repeat > 1) {
    state.repeatKey = {
      // don't consume again on the next iteration
      consumedLength: 0,
      keyDef,
      releasePrevious,
      releaseSelf,
      repeat: repeat - 1
    };
  } else {
    delete state.repeatKey;
  }

  if (text.length > consumedLength || repeat > 1) {
    if (options.delay > 0) {
      await (0, _utils.wait)(options.delay);
    }

    return keyboardImplementation(text.slice(consumedLength), options, state);
  }

  return void undefined;
}

function getActive(document) {
  var _getActiveElement;

  return (_getActiveElement = (0, _utils.getActiveElement)(document)) != null ? _getActiveElement :
  /* istanbul ignore next */
  document.body;
}

function releaseAllKeys(options, state) {
  const getCurrentElement = () => getActive(options.document);

  for (const k of state.pressed) {
    keyup(k.keyDef, getCurrentElement, options, state, k.unpreventedDefault);
  }
}

function keydown(keyDef, getCurrentElement, options, state) {
  const element = getCurrentElement(); // clear carried characters when focus is moved

  if (element !== state.activeElement) {
    state.carryValue = undefined;
    state.carryChar = '';
  }

  state.activeElement = element;
  applyPlugins(plugins.preKeydownBehavior, keyDef, element, options, state);

  const unpreventedDefault = _dom.fireEvent.keyDown(element, (0, _getEventProps.getKeyEventProps)(keyDef, state));

  state.pressed.push({
    keyDef,
    unpreventedDefault
  });

  if (unpreventedDefault) {
    // all default behavior like keypress/submit etc is applied to the currentElement
    applyPlugins(plugins.keydownBehavior, keyDef, getCurrentElement(), options, state);
  }

  return unpreventedDefault;
}

function keypress(keyDef, getCurrentElement, options, state) {
  const element = getCurrentElement();

  const unpreventedDefault = _dom.fireEvent.keyPress(element, (0, _getEventProps.getKeyEventProps)(keyDef, state));

  if (unpreventedDefault) {
    applyPlugins(plugins.keypressBehavior, keyDef, getCurrentElement(), options, state);
  }
}

function keyup(keyDef, getCurrentElement, options, state, unprevented) {
  const element = getCurrentElement();
  applyPlugins(plugins.preKeyupBehavior, keyDef, element, options, state);

  const unpreventedDefault = _dom.fireEvent.keyUp(element, (0, _getEventProps.getKeyEventProps)(keyDef, state));

  if (unprevented && unpreventedDefault) {
    applyPlugins(plugins.keyupBehavior, keyDef, getCurrentElement(), options, state);
  }

  state.pressed = state.pressed.filter(k => k.keyDef !== keyDef);
  applyPlugins(plugins.postKeyupBehavior, keyDef, element, options, state);
}

function applyPlugins(pluginCollection, keyDef, element, options, state) {
  const plugin = pluginCollection.find(p => p.matches(keyDef, element, options, state));

  if (plugin) {
    plugin.handle(keyDef, element, options, state);
  }

  return !!plugin;
}

function hasKeyPress(keyDef, state) {
  var _keyDef$key;

  return (((_keyDef$key = keyDef.key) == null ? void 0 : _keyDef$key.length) === 1 || keyDef.key === 'Enter') && !state.modifiers.ctrl && !state.modifiers.alt;
}