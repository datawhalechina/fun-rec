import React from 'react';
import { withNativeProps } from '../../utils/native-props';
import classNames from 'classnames';
import { generateIntArray } from '../../utils/generate-int-array';
import { mergeProps } from '../../utils/with-default-props';
const classPrefix = 'adm-skeleton';
export const Skeleton = props => {
  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, {
      [`${classPrefix}-animated`]: props.animated
    })
  }));
};
export const SkeletonTitle = props => {
  return withNativeProps(props, React.createElement(Skeleton, {
    animated: props.animated,
    className: `${classPrefix}-title`
  }));
};
const defaultSkeletonParagraphProps = {
  lineCount: 3
};
export const SkeletonParagraph = p => {
  const props = mergeProps(defaultSkeletonParagraphProps, p);
  const keys = generateIntArray(1, props.lineCount);
  const node = React.createElement("div", {
    className: `${classPrefix}-paragraph`
  }, keys.map(key => React.createElement(Skeleton, {
    key: key,
    animated: props.animated,
    className: `${classPrefix}-paragraph-line`
  })));
  return withNativeProps(props, node);
};