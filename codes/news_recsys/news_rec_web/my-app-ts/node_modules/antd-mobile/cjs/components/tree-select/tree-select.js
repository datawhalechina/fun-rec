"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TreeSelect = void 0;

var _classnames = _interopRequireDefault(require("classnames"));

var _react = _interopRequireWildcard(require("react"));

var _nativeProps = require("../../utils/native-props");

var _tree = require("../../utils/tree");

var _withDefaultProps = require("../../utils/with-default-props");

var _usePropsValue = require("../../utils/use-props-value");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const classPrefix = `adm-tree-select`;
const defaultProps = {
  options: [],
  fieldNames: {},
  defaultValue: []
};

const TreeSelect = p => {
  const props = (0, _withDefaultProps.mergeProps)(defaultProps, p);
  const labelName = props.fieldNames.label || 'label';
  const valueName = props.fieldNames.value || 'value';
  const childrenName = props.fieldNames.children || 'children';
  const [value, setValue] = (0, _usePropsValue.usePropsValue)({
    value: props.value,
    defaultValue: props.defaultValue
  });
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
      return _react.default.createElement("div", {
        key: item[valueName],
        className: (0, _classnames.default)(`${classPrefix}-item`, {
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

      const column = _react.default.createElement("div", {
        key: i,
        className: (0, _classnames.default)(`${classPrefix}-column`),
        style: {
          width
        }
      }, renderItems(i === 0 ? props.options : (_a = optionsMap.get(value[i - 1])) === null || _a === void 0 ? void 0 : _a[childrenName], i));

      columns.push(column);
    }

    return columns;
  };

  return (0, _nativeProps.withNativeProps)(props, _react.default.createElement("div", {
    className: classPrefix
  }, renderColumns()));
};

exports.TreeSelect = TreeSelect;