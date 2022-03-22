import React, { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import Tabs from '../tabs';
import CheckList from '../check-list';
import { withNativeProps } from '../../utils/native-props';
import { mergeProps } from '../../utils/with-default-props';
import { usePropsValue } from '../../utils/use-props-value';
import { useCascaderValueExtend } from './use-cascader-value-extend';
import { useConfig } from '../config-provider';
import { optionSkeleton } from './option-skeleton';
import Skeleton from '../skeleton';
const classPrefix = `adm-cascader-view`;
const defaultProps = {
  defaultValue: []
};
export const CascaderView = p => {
  const {
    locale
  } = useConfig();
  const props = mergeProps(defaultProps, {
    placeholder: locale.Cascader.placeholder
  }, p);
  const [value, setValue] = usePropsValue(Object.assign(Object.assign({}, props), {
    onChange: val => {
      var _a;

      (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, val, generateValueExtend(val));
    }
  }));
  const [tabActiveKey, setTabActiveKey] = useState(0);
  const generateValueExtend = useCascaderValueExtend(props.options);
  const levels = useMemo(() => {
    const ret = [];
    let currentOptions = props.options;
    let reachedEnd = false;

    for (const v of value) {
      const target = currentOptions.find(option => option.value === v);
      ret.push({
        selected: target,
        options: currentOptions
      });

      if (!target || !target.children) {
        reachedEnd = true;
        break;
      }

      currentOptions = target.children;
    }

    if (!reachedEnd) {
      ret.push({
        selected: undefined,
        options: currentOptions
      });
    }

    return ret;
  }, [value, props.options]);
  useEffect(() => {
    setTabActiveKey(levels.length - 1);
  }, [value]);
  useEffect(() => {
    const max = levels.length - 1;

    if (tabActiveKey > max) {
      setTabActiveKey(max);
    }
  }, [tabActiveKey, levels]);

  const onItemSelect = (selectValue, depth) => {
    const next = value.slice(0, depth);

    if (selectValue !== undefined) {
      next[depth] = selectValue;
    }

    setValue(next);
  };

  return withNativeProps(props, React.createElement("div", {
    className: classPrefix
  }, React.createElement(Tabs, {
    activeKey: tabActiveKey.toString(),
    onChange: key => setTabActiveKey(parseInt(key)),
    stretch: false,
    className: `${classPrefix}-tabs`
  }, levels.map((level, index) => {
    const selected = level.selected;
    return React.createElement(Tabs.Tab, {
      key: index,
      title: React.createElement("div", {
        className: `${classPrefix}-header-title`
      }, selected ? selected.label : props.placeholder),
      forceRender: true
    }, React.createElement("div", {
      className: `${classPrefix}-content`
    }, level.options === optionSkeleton ? React.createElement("div", {
      className: `${classPrefix}-skeleton`
    }, React.createElement(Skeleton, {
      className: `${classPrefix}-skeleton-line-1`,
      animated: true
    }), React.createElement(Skeleton, {
      className: `${classPrefix}-skeleton-line-2`,
      animated: true
    }), React.createElement(Skeleton, {
      className: `${classPrefix}-skeleton-line-3`,
      animated: true
    }), React.createElement(Skeleton, {
      className: `${classPrefix}-skeleton-line-4`,
      animated: true
    })) : React.createElement(CheckList, {
      value: [value[index]],
      onChange: selectValue => onItemSelect(selectValue[0], index)
    }, level.options.map(option => {
      const active = value[index] === option.value;
      return React.createElement(CheckList.Item, {
        value: option.value,
        key: option.value,
        disabled: option.disabled,
        className: classNames(`${classPrefix}-item`, {
          [`${classPrefix}-item-active`]: active
        })
      }, option.label);
    }))));
  }))));
};