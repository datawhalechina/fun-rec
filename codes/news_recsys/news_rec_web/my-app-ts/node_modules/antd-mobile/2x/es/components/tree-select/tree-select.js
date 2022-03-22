import classNames from 'classnames';
import React, { useMemo } from 'react';
import { withNativeProps } from '../../utils/native-props';
import { getTreeDeep } from '../../utils/tree';
import { mergeProps } from '../../utils/with-default-props';
import { usePropsValue } from '../../utils/use-props-value';
const classPrefix = `adm-tree-select`;
const defaultProps = {
  options: [],
  fieldNames: {},
  defaultValue: []
};
export const TreeSelect = p => {
  const props = mergeProps(defaultProps, p);
  const labelName = props.fieldNames.label || 'label';
  const valueName = props.fieldNames.value || 'value';
  const childrenName = props.fieldNames.children || 'children';
  const [value, setValue] = usePropsValue({
    value: props.value,
    defaultValue: props.defaultValue
  });
  const [deep, optionsMap, optionsParentMap] = useMemo(() => {
    const deep = getTreeDeep(props.options, childrenName);
    const optionsMap = new Map();
    const optionsParentMap = new Map();

    function traverse(current, children) {
      children.forEach(item => {
        optionsParentMap.set(item[valueName], current);
        optionsMap.set(item[valueName], item);

        if (item[childrenName]) {
          traverse(item, item[childrenName]);
        }
      });
    }

    traverse(undefined, props.options);
    return [deep, optionsMap, optionsParentMap];
  }, [props.options]);

  const onItemSelect = node => {
    var _a; // 找到父级节点


    const parentNodes = [];
    let current = node;

    while (current) {
      parentNodes.push(current);
      const next = optionsParentMap.get(current[valueName]);
      current = next;
    }

    const values = parentNodes.reverse().map(i => i[valueName]);
    setValue(values);
    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, values, {
      options: parentNodes
    });
  };

  const renderItems = (columnOptions = [], index) => {
    return columnOptions.map(item => {
      const isActive = item[valueName] === value[index];
      return React.createElement("div", {
        key: item[valueName],
        className: classNames(`${classPrefix}-item`, {
          [`${classPrefix}-item-active`]: isActive
        }),
        onClick: () => {
          if (!isActive) {
            onItemSelect(item);
          }
        }
      }, item[labelName]);
    });
  };

  const renderColumns = () => {
    var _a;

    const columns = [];

    for (let i = 0; i < deep; i++) {
      let width = `${100 / deep}%`; // 两列的第一列宽度为 33.33，两列的第二列为 66.67%

      if (deep === 2 && i === 0) {
        width = `33.33%`;
      }

      if (deep === 2 && i === 1) {
        width = `66.67%`;
      }

      const column = React.createElement("div", {
        key: i,
        className: classNames(`${classPrefix}-column`),
        style: {
          width
        }
      }, renderItems(i === 0 ? props.options : (_a = optionsMap.get(value[i - 1])) === null || _a === void 0 ? void 0 : _a[childrenName], i));
      columns.push(column);
    }

    return columns;
  };

  return withNativeProps(props, React.createElement("div", {
    className: classPrefix
  }, renderColumns()));
};