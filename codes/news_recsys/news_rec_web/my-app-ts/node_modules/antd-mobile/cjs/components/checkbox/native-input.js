"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NativeInput = void 0;

var _react = _interopRequireWildcard(require("react"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const NativeInput = props => {
  const inputRef = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    if (props.disabled) return;
    if (!inputRef.current) return;
    const input = inputRef.current;

    function handleClick(e) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      props.onChange(input.checked);
    }

    input.addEventListener('click', handleClick);
    return () => {
      input.removeEventListener('click', handleClick);
    };
  }, [props.disabled, props.onChange]);
  return _react.default.createElement("input", {
    ref: inputRef,
    type: 'checkbox',
    checked: props.checked,
    onChange: () => {},
    disabled: props.disabled,
    id: props.id
  });
};

exports.NativeInput = NativeInput;