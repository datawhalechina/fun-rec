import React, { memo } from 'react';
import { withNativeProps } from '../../utils/native-props';
export const Corner = memo(props => withNativeProps(props, React.createElement("svg", {
  viewBox: '0 0 30 30'
}, React.createElement("g", {
  stroke: 'none',
  strokeWidth: '1',
  fill: 'none',
  fillRule: 'evenodd'
}, React.createElement("path", {
  d: 'M30,0 C13.4314575,3.04359188e-15 -2.02906125e-15,13.4314575 0,30 L0,30 L0,0 Z',
  fill: 'var(--adm-color-white)',
  transform: 'translate(15.000000, 15.000000) scale(-1, -1) translate(-15.000000, -15.000000) '
})))));