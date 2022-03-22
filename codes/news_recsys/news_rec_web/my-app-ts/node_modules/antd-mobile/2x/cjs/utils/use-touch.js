"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTouch = useTouch;

var _react = require("react");

const MIN_DISTANCE = 10;

function getDirection(x, y) {
  if (x > y && x > MIN_DISTANCE) {
    return 'horizontal';
  }

  if (y > x && y > MIN_DISTANCE) {
    return 'vertical';
  }

  return '';
}

function useTouch() {
  const startX = (0, _react.useRef)(0);
  const startY = (0, _react.useRef)(0);
  const deltaX = (0, _react.useRef)(0);
  const deltaY = (0, _react.useRef)(0);
  const offsetX = (0, _react.useRef)(0);
  const offsetY = (0, _react.useRef)(0);
  const direction = (0, _react.useRef)('');

  const isVertical = () => direction.current === 'vertical';

  const isHorizontal = () => direction.current === 'horizontal';

  const reset = () => {
    deltaX.current = 0;
    deltaY.current = 0;
    offsetX.current = 0;
    offsetY.current = 0;
    direction.current = '';
  };

  const start = event => {
    reset();
    startX.current = event.touches[0].clientX;
    startY.current = event.touches[0].clientY;
  };

  const move = event => {
    const touch = event.touches[0]; // Fix: Safari back will set clientX to negative number

    deltaX.current = touch.clientX < 0 ? 0 : touch.clientX - startX.current;
    deltaY.current = touch.clientY - startY.current;
    offsetX.current = Math.abs(deltaX.current);
    offsetY.current = Math.abs(deltaY.current);

    if (!direction.current) {
      direction.current = getDirection(offsetX.current, offsetY.current);
    }
  };

  return {
    move,
    start,
    reset,
    startX,
    startY,
    deltaX,
    deltaY,
    offsetX,
    offsetY,
    direction,
    isVertical,
    isHorizontal
  };
}