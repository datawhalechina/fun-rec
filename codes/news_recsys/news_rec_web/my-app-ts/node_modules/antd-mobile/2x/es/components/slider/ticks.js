import React from 'react';
import classNames from 'classnames';
const classPrefix = `adm-slider`;

const Ticks = ({
  points,
  max,
  min,
  upperBound,
  lowerBound
}) => {
  const range = max - min;
  const elements = points.map(point => {
    const offset = `${Math.abs(point - min) / range * 100}%`;
    const isActived = point <= upperBound && point >= lowerBound;
    const style = {
      left: offset
    };
    const pointClassName = classNames({
      [`${classPrefix}-tick`]: true,
      [`${classPrefix}-tick-active`]: isActived
    });
    return React.createElement("span", {
      className: pointClassName,
      style: style,
      key: point
    });
  });
  return React.createElement("div", {
    className: `${classPrefix}-ticks`
  }, elements);
};

export default Ticks;