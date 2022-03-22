import React, { useMemo, useRef } from 'react';
import { withNativeProps } from '../../utils/native-props';
import classNames from 'classnames';
import Ticks from './ticks';
import Marks from './marks';
import Thumb from './thumb';
import { mergeProps } from '../../utils/with-default-props';
import { nearest } from '../../utils/nearest';
import { usePropsValue } from '../../utils/use-props-value';
const classPrefix = `adm-slider`;
const defaultProps = {
  min: 0,
  max: 100,
  step: 1,
  ticks: false,
  range: false,
  disabled: false
};
export const Slider = p => {
  var _a;

  const props = mergeProps(defaultProps, p);
  const {
    min,
    max,
    disabled,
    marks,
    ticks,
    step
  } = props;

  function sortValue(val) {
    return val.sort((a, b) => a - b);
  }

  function convertValue(value) {
    return props.range ? value : [props.min, value];
  }

  function reverseValue(value) {
    return props.range ? value : value[1];
  }

  function onAfterChange(value) {
    var _a;

    (_a = props.onAfterChange) === null || _a === void 0 ? void 0 : _a.call(props, reverseValue(value));
  }

  const [rawValue, setRawValue] = usePropsValue({
    value: props.value,
    defaultValue: (_a = props.defaultValue) !== null && _a !== void 0 ? _a : props.range ? [min, min] : min,
    onChange: props.onChange
  });
  const sliderValue = sortValue(convertValue(rawValue));

  function setSliderValue(value) {
    const next = sortValue(value);
    const current = sliderValue;
    if (next[0] === current[0] && next[1] === current[1]) return;
    setRawValue(reverseValue(next));
  }

  const trackRef = useRef(null);
  const fillSize = `${100 * (sliderValue[1] - sliderValue[0]) / (max - min)}%`;
  const fillStart = `${100 * (sliderValue[0] - min) / (max - min)}%`; // 计算要显示的点

  const pointList = useMemo(() => {
    if (marks) {
      return Object.keys(marks).map(parseFloat).sort((a, b) => a - b);
    } else {
      const points = [];

      for (let i = min; i <= max; i += step) {
        points.push(i);
      }

      return points;
    }
  }, [marks, ticks, step, min, max]);

  function getValueByPosition(position) {
    const newPosition = position < min ? min : position > max ? max : position;
    let value = min; // 显示了刻度点，就只能移动到点上

    if (pointList.length) {
      value = nearest(pointList, newPosition);
    } else {
      const lengthPerStep = 100 / ((max - min) / step);
      const steps = Math.round(newPosition / lengthPerStep);
      value = steps * lengthPerStep * (max - min) * 0.01 + min;
    }

    return value;
  }

  const dragLockRef = useRef(0);

  const onTrackClick = event => {
    if (dragLockRef.current > 0) return;
    event.stopPropagation();
    if (disabled) return;
    const track = trackRef.current;
    if (!track) return;
    const sliderOffsetLeft = track.getBoundingClientRect().left;
    const position = (event.clientX - sliderOffsetLeft) / Math.ceil(track.offsetWidth) * (max - min) + min;
    const targetValue = getValueByPosition(position);
    let nextSliderValue;

    if (props.range) {
      // 移动的滑块采用就近原则
      if (Math.abs(targetValue - sliderValue[0]) > Math.abs(targetValue - sliderValue[1])) {
        nextSliderValue = [sliderValue[0], targetValue];
      } else {
        nextSliderValue = [targetValue, sliderValue[1]];
      }
    } else {
      nextSliderValue = [props.min, targetValue];
    }

    setSliderValue(nextSliderValue);
    onAfterChange(nextSliderValue);
  };

  const valueBeforeDragRef = useRef();

  const renderThumb = index => {
    return React.createElement(Thumb, {
      key: index,
      value: sliderValue[index],
      min: min,
      max: max,
      disabled: disabled,
      trackRef: trackRef,
      onDrag: (position, first, last) => {
        if (first) {
          dragLockRef.current += 1;
          valueBeforeDragRef.current = sliderValue;
        }

        const val = getValueByPosition(position);
        const valueBeforeDrag = valueBeforeDragRef.current;
        if (!valueBeforeDrag) return;
        const next = [...valueBeforeDrag];
        next[index] = val;
        setSliderValue(next);

        if (last) {
          onAfterChange(next);
          window.setTimeout(() => {
            dragLockRef.current -= 1;
          }, 100);
        }
      }
    });
  };

  return withNativeProps(props, React.createElement("div", {
    className: classNames(classPrefix, {
      [`${classPrefix}-disabled`]: disabled
    })
  }, React.createElement("div", {
    className: `${classPrefix}-track-container`,
    onClick: onTrackClick
  }, React.createElement("div", {
    className: `${classPrefix}-track`,
    onClick: onTrackClick,
    ref: trackRef
  }, React.createElement("div", {
    className: `${classPrefix}-fill`,
    style: {
      width: fillSize,
      left: fillStart
    }
  }), props.ticks && React.createElement(Ticks, {
    points: pointList,
    min: min,
    max: max,
    lowerBound: sliderValue[0],
    upperBound: sliderValue[1]
  }), props.range && renderThumb(0), renderThumb(1))), marks && React.createElement(Marks, {
    min: min,
    max: max,
    marks: marks,
    lowerBound: sliderValue[0],
    upperBound: sliderValue[1]
  })));
};