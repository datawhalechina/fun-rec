import React, { memo } from 'react';
import { mergeProps } from '../../utils/with-default-props';
import { withNativeProps } from '../../utils/native-props';
import classNames from 'classnames';
const classPrefix = `adm-dot-loading`;
const colorRecord = {
  default: 'var(--adm-color-weak)',
  primary: 'var(--adm-color-primary)',
  white: 'var(--adm-color-white)'
};
const defaultProps = {
  color: 'default'
};
export const DotLoading = memo(p => {
  var _a;

  const props = mergeProps(defaultProps, p);
  return withNativeProps(props, React.createElement("div", {
    style: {
      color: (_a = colorRecord[props.color]) !== null && _a !== void 0 ? _a : props.color
    },
    className: classNames('adm-loading', classPrefix)
  }, React.createElement("svg", {
    height: '1em',
    viewBox: '0 0 100 40',
    style: {
      verticalAlign: '-0.125em'
    }
  }, React.createElement("g", {
    stroke: 'none',
    strokeWidth: '1',
    fill: 'none',
    fillRule: 'evenodd'
  }, React.createElement("g", {
    transform: 'translate(-100.000000, -71.000000)'
  }, React.createElement("g", {
    transform: 'translate(95.000000, 71.000000)'
  }, React.createElement("g", {
    transform: 'translate(5.000000, 0.000000)'
  }, [0, 1, 2].map(i => React.createElement("rect", {
    key: i,
    fill: 'currentColor',
    x: 20 + i * 26,
    y: '16',
    width: '8',
    height: '8',
    rx: '2'
  }, React.createElement("animate", {
    attributeName: 'y',
    from: '16',
    to: '16',
    dur: '2s',
    begin: `${i * 0.2}s`,
    repeatCount: 'indefinite',
    values: '16; 6; 26; 16; 16',
    keyTimes: '0; 0.1; 0.3; 0.4; 1'
  }))))))))));
});