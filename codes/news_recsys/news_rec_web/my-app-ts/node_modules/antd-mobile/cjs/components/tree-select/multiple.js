"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Multiple = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireWildcard(require("react"));

var _nativeProps = require("../../utils/native-props");

var _tree = require("../../utils/tree");

var _withDefaultProps = require("../../utils/with-default-props");

var _checkbox = _interopRequireDefault(require("../checkbox"));

var _usePropsValue = require("../../utils/use-props-value");

var _devLog = require("../../utils/dev-log");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-tree-select-multiple`;

const Multiple = p => {
  const props = (0, _withDefaultProps.mergeProps)({
    options: [],
    fieldNames: {},
    allSelectText: [],
    defaultExpandKeys: [],
    defaultValue: []
  }, p);
  (0, _react.useEffect)(() => {
    (0, _devLog.devWarning)('TreeSelect', 'TreeSelect.Multiple has been deprecated.');
  }, []);
  const labelName = props.fieldNames.label || 'label';
  const valueName = props.fieldNames.value || 'value';
  const childrenName = props.fieldNames.children || 'children'; // 打开的 keys

  const [expandKeys, setExpandKeys] = (0, _usePropsValue.usePropsValue)({
    value: props.expandKeys,
    defaultValue: props.defaultExpandKeys
  }); // 选中的 value（聚合后）

  const [value, setValue] = (0, _usePropsValue.usePropsValue)({
    value: props.value,
    defaultValue: props.defaultValue
  }); // 获取目标所有叶子节点 key 集合

  const getLeafKeys = option => {
    const keys = [];

    const walker = op => {
      var _a;

      if (!op) {
        return;
      }

      if ((_a = op[childrenName]) === null || _a === void 0 ? void 0 : _a.length) {
        op[childrenName].forEach(i => walker(i));
      } else {
        keys.push(op[valueName]);
      }
    };

    walker(option);
    return keys;
  };

  const [deep, optionsMap, optionsParentMap] = (0, _react.useMemo)(() => {
    const deep = (0, _tree.getTreeDeep)(props.options, childrenName);
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
  }, [props.options]); // 将聚合的 value 拆分开，获得叶子节点的 value 集合

  const allSelectedLeafKeys = (0, _react.useMemo)(() => {
    let leafKeys = [];
    value.forEach(v => {
      const option = optionsMap.get(v);
      leafKeys = leafKeys.concat(getLeafKeys(option));
    });
    return leafKeys;
  }, [value, optionsMap]); // 子级有被选中的节点集合

  const dotMap = (0, _react.useMemo)(() => {
    const map = new Map(); // 遍历 allChildrenValues, 向上递归

    const walker = key => {
      const parentOption = optionsParentMap.get(key);

      if (!parentOption) {
        return;
      }

      map.set(parentOption[valueName], true);
      walker(parentOption[valueName]);
    };

    allSelectedLeafKeys.forEach(key => {
      map.set(key, true);
      walker(key);
    });
    return map;
  }, [optionsParentMap, value]);

  const onChange = targetKeys => {
    var _a;

    let groupKeys = [...targetKeys];
    let unusedKeys = [];

    const walker = keys => {
      keys.forEach(key => {
        var _a;

        if (unusedKeys.includes(key)) {
          return;
        }

        const parent = optionsParentMap.get(key);

        if (!parent) {
          return;
        }

        const childrenKeys = ((_a = parent[childrenName]) === null || _a === void 0 ? void 0 : _a.map(i => i[valueName])) || [];

        if (childrenKeys.every(i => groupKeys.includes(i))) {
          groupKeys.push(parent[valueName]);
          unusedKeys = unusedKeys.concat(childrenKeys);
        }
      });
    }; // 遍历 deep 次 groupKeys，每次往上聚合一层


    for (let i = 0; i < deep; i++) {
      walker(groupKeys);
    }

    groupKeys = groupKeys.filter(i => !unusedKeys.includes(i));
    const groupOptions = groupKeys.map(i => optionsMap.get(i));
    setValue(groupKeys);
    (_a = props.onChange) === null || _a === void 0 ? void 0 : _a.call(props, groupKeys, groupOptions);
  };

  const onItemSelect = option => {
    var _a;

    const parentNodes = [];
    let current = option;

    while (current) {
      parentNodes.unshift(current);
      const next = optionsParentMap.get(current[valueName]);
      current = next;
    }

    const keys = parentNodes.map(i => i[valueName]);
    setExpandKeys(keys);
    (_a = props.onExpand) === null || _a === void 0 ? void 0 : _a.call(props, keys, parentNodes);
  }; // 渲染全选节点


  const renderSelectAllItem = (columnOptions, index) => {
    var _a;

    const text = (_a = props.selectAllText) === null || _a === void 0 ? void 0 : _a[index];

    if (!text) {
      return;
    }

    let currentLeafKeys = [];
    columnOptions.forEach(option => {
      currentLeafKeys = currentLeafKeys.concat(getLeafKeys(option));
    });
    const allSelected = currentLeafKeys.every(i => allSelectedLeafKeys.includes(i));
    return _react.default.createElement("div", {
      onClick: () => {
        if (allSelected) {
          onChange(allSelectedLeafKeys.filter(i => !currentLeafKeys.includes(i)));
        } else {
          onChange(allSelectedLeafKeys.concat(currentLeafKeys));
        }
      },
      className: `${classPrefix}-item`
    }, text);
  }; // 渲染


  const renderSelectAllLeafItem = (columnOptions, index) => {
    var _a;

    const text = (_a = props.selectAllText) === null || _a === void 0 ? void 0 : _a[index];

    if (!text) {
      return;
    }

    const currentLeafKeys = columnOptions.map(i => i[valueName]);
    const allSelected = currentLeafKeys.every(i => allSelectedLeafKeys.includes(i));
    const halfSelected = allSelected ? false : currentLeafKeys.some(i => allSelectedLeafKeys.includes(i));
    return _react.default.createElement("div", {
      onClick: () => {
        if (allSelected) {
          onChange(allSelectedLeafKeys.filter(i => !currentLeafKeys.includes(i)));
        } else {
          onChange(allSelectedLeafKeys.concat(currentLeafKeys));
        }
      },
      className: (0, _classnames.default)(`${classPrefix}-item`, `${classPrefix}-item-leaf`)
    }, _react.default.createElement(_checkbox.default, {
      className: `${classPrefix}-item-checkbox`,
      checked: allSelected,
      indeterminate: halfSelected
    }), text);
  }; // 渲染节点


  const renderItem = option => {
    const isExpand = expandKeys.includes(option[valueName]);
    return _react.default.createElement("div", {
      key: option[valueName],
      onClick: () => {
        if (!isExpand) {
          onItemSelect(option);
        }
      },
      className: (0, _classnames.default)(`${classPrefix}-item`, {
        [`${classPrefix}-item-expand`]: isExpand
      })
    }, option[labelName], !!dotMap.get(option[valueName]) && _react.default.createElement("div", {
      className: `${classPrefix}-dot`
    }));
  }; // 渲染叶子节点


  const renderLeafItem = option => {
    const isSelected = allSelectedLeafKeys.includes(option[valueName]);
    return _react.default.createElement("div", {
      key: option[valueName],
      onClick: () => {
        if (isSelected) {
          onChange(allSelectedLeafKeys.filter(val => val !== option[valueName]));
        } else {
          onChange([...allSelectedLeafKeys, option[valueName]]);
        }
      },
      className: (0, _classnames.default)(`${classPrefix}-item`, `${classPrefix}-item-leaf`)
    }, _react.default.createElement(_checkbox.default, {
      className: `${classPrefix}-item-checkbox`,
      checked: isSelected
    }), option[labelName]);
  };

  const renderItems = (columnOptions = [], index) => {
    if (columnOptions.length === 0) {
      return;
    }

    const isLeaf = deep === index + 1;

    if (isLeaf) {
      return _react.default.createElement(_react.default.Fragment, null, renderSelectAllLeafItem(columnOptions, index), columnOptions.map(option => {
        return renderLeafItem(option);
      }));
    }

    return _react.default.createElement(_react.default.Fragment, null, renderSelectAllItem(columnOptions, index), columnOptions.map(option => {
      return renderItem(option);
    }));
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

      const column = _react.default.createElement("div", {
        key: i,
        className: (0, _classnames.default)(`${classPrefix}-column`),
        style: {
          width
        }
      }, renderItems(i === 0 ? props.options : (_a = optionsMap.get(expandKeys[i - 1])) === null || _a === void 0 ? void 0 : _a[childrenName], i));

      columns.push(column);
    }

    return columns;
  };

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classPrefix
  }, renderColumns()));
};

exports.Multiple = Multiple;