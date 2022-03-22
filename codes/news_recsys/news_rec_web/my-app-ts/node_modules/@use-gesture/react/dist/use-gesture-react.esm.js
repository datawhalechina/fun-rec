import { registerAction, dragAction, pinchAction, wheelAction, scrollAction, moveAction, hoverAction } from '@use-gesture/core/actions';
export * from '@use-gesture/core/actions';
import React from 'react';
import { Controller, parseMergedHandlers } from '@use-gesture/core';
export * from '@use-gesture/core/utils';
export * from '@use-gesture/core/types';

function useRecognizers(handlers, config = {}, gestureKey, nativeHandlers) {
  const ctrl = React.useMemo(() => new Controller(handlers), []);
  ctrl.applyHandlers(handlers, nativeHandlers);
  ctrl.applyConfig(config, gestureKey);
  React.useEffect(ctrl.effect.bind(ctrl));
  React.useEffect(() => {
    return ctrl.clean.bind(ctrl);
  }, []);

  if (config.target === undefined) {
    return ctrl.bind.bind(ctrl);
  }

  return undefined;
}

function useDrag(handler, config = {}) {
  registerAction(dragAction);
  return useRecognizers({
    drag: handler
  }, config, 'drag');
}

function usePinch(handler, config = {}) {
  registerAction(pinchAction);
  return useRecognizers({
    pinch: handler
  }, config, 'pinch');
}

function useWheel(handler, config = {}) {
  registerAction(wheelAction);
  return useRecognizers({
    wheel: handler
  }, config, 'wheel');
}

function useScroll(handler, config = {}) {
  registerAction(scrollAction);
  return useRecognizers({
    scroll: handler
  }, config, 'scroll');
}

function useMove(handler, config = {}) {
  registerAction(moveAction);
  return useRecognizers({
    move: handler
  }, config, 'move');
}

function useHover(handler, config = {}) {
  registerAction(hoverAction);
  return useRecognizers({
    hover: handler
  }, config, 'hover');
}

function createUseGesture(actions) {
  actions.forEach(registerAction);
  return function useGesture(_handlers, _config = {}) {
    const {
      handlers,
      nativeHandlers,
      config
    } = parseMergedHandlers(_handlers, _config);
    return useRecognizers(handlers, config, undefined, nativeHandlers);
  };
}

function useGesture(handlers, config = {}) {
  const hook = createUseGesture([dragAction, pinchAction, scrollAction, wheelAction, moveAction, hoverAction]);
  return hook(handlers, config);
}

export { createUseGesture, useDrag, useGesture, useHover, useMove, usePinch, useScroll, useWheel };
