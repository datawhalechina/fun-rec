'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var actions = require('@use-gesture/core/actions');
var React = require('react');
var core = require('@use-gesture/core');
var utils = require('@use-gesture/core/utils');
var types = require('@use-gesture/core/types');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function useRecognizers(handlers, config = {}, gestureKey, nativeHandlers) {
  const ctrl = React__default["default"].useMemo(() => new core.Controller(handlers), []);
  ctrl.applyHandlers(handlers, nativeHandlers);
  ctrl.applyConfig(config, gestureKey);
  React__default["default"].useEffect(ctrl.effect.bind(ctrl));
  React__default["default"].useEffect(() => {
    return ctrl.clean.bind(ctrl);
  }, []);

  if (config.target === undefined) {
    return ctrl.bind.bind(ctrl);
  }

  return undefined;
}

function useDrag(handler, config = {}) {
  actions.registerAction(actions.dragAction);
  return useRecognizers({
    drag: handler
  }, config, 'drag');
}

function usePinch(handler, config = {}) {
  actions.registerAction(actions.pinchAction);
  return useRecognizers({
    pinch: handler
  }, config, 'pinch');
}

function useWheel(handler, config = {}) {
  actions.registerAction(actions.wheelAction);
  return useRecognizers({
    wheel: handler
  }, config, 'wheel');
}

function useScroll(handler, config = {}) {
  actions.registerAction(actions.scrollAction);
  return useRecognizers({
    scroll: handler
  }, config, 'scroll');
}

function useMove(handler, config = {}) {
  actions.registerAction(actions.moveAction);
  return useRecognizers({
    move: handler
  }, config, 'move');
}

function useHover(handler, config = {}) {
  actions.registerAction(actions.hoverAction);
  return useRecognizers({
    hover: handler
  }, config, 'hover');
}

function createUseGesture(actions$1) {
  actions$1.forEach(actions.registerAction);
  return function useGesture(_handlers, _config = {}) {
    const {
      handlers,
      nativeHandlers,
      config
    } = core.parseMergedHandlers(_handlers, _config);
    return useRecognizers(handlers, config, undefined, nativeHandlers);
  };
}

function useGesture(handlers, config = {}) {
  const hook = createUseGesture([actions.dragAction, actions.pinchAction, actions.scrollAction, actions.wheelAction, actions.moveAction, actions.hoverAction]);
  return hook(handlers, config);
}

exports.createUseGesture = createUseGesture;
exports.useDrag = useDrag;
exports.useGesture = useGesture;
exports.useHover = useHover;
exports.useMove = useMove;
exports.usePinch = usePinch;
exports.useScroll = useScroll;
exports.useWheel = useWheel;
Object.keys(actions).forEach(function (k) {
  if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return actions[k]; }
  });
});
Object.keys(utils).forEach(function (k) {
  if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return utils[k]; }
  });
});
Object.keys(types).forEach(function (k) {
  if (k !== 'default' && !exports.hasOwnProperty(k)) Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () { return types[k]; }
  });
});
