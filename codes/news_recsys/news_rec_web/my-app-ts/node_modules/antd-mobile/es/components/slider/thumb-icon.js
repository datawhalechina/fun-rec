import React from 'react';
import { withNativeProps } from '../../utils/native-props';
export const ThumbIcon = props => {
  return withNativeProps(props, React.createElement("svg", {
    viewBox: '0 0 20 20'
  }, React.createElement("g", {
    stroke: 'none',
    strokeWidth: '1',
    fill: 'none',
    fillRule: 'evenodd'
  }, React.createElement("g", {
    transform: 'translate(-604.000000, -656.000000)',
    fill: '#999999'
  }, React.createElement("g", {
    transform: 'translate(592.000000, 644.000000)'
  }, React.createElement("g", {
    transform: 'translate(12.000000, 12.000000)'
  }, React.createElement("polygon", {
    points: '0 3.33333333 2.22222222 3.33333333 2.22222222 17.7777778 0 17.7777778'
  }), React.createElement("polygon", {
    points: '17.7777778 3.33333333 20 3.33333333 20 17.7777778 17.7777778 17.7777778'
  }), React.createElement("path", {
    d: 'M10.8888889,0 L9.11111111,0 C8.98888889,0 8.88888889,0.107142857 8.88888889,0.238095238 L8.88888889,19.7619048 C8.88888889,19.8928571 8.98888889,20 9.11111111,20 L10.8888889,20 C11.0111111,20 11.1111111,19.8928571 11.1111111,19.7619048 L11.1111111,0.238095238 C11.1111111,0.107142857 11.0111111,0 10.8888889,0 Z'
  })))))));
};