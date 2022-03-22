import React, { memo } from 'react';
import { withNativeProps } from '../../utils/native-props';
export const IndeterminateIcon = memo(props => {
  return withNativeProps(props, React.createElement("svg", {
    viewBox: '0 0 40 40'
  }, React.createElement("path", {
    d: 'M20,9 C26.0752953,9 31,13.9247047 31,20 C31,26.0752953 26.0752953,31 20,31 C13.9247047,31 9,26.0752953 9,20 C9,13.9247047 13.9247047,9 20,9 Z',
    fill: 'currentColor'
  })));
});