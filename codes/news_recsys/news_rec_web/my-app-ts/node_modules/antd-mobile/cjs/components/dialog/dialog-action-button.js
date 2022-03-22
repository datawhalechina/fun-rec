"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogActionButton = void 0;

var _tslib = require("tslib");

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

var _button = _interopRequireDefault(require("../button"));

var _nativeProps = require("../../utils/native-props");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const DialogActionButton = props => {
  const {
    action
  } = props;
  const [loading, setLoading] = (0, _react.useState)(false);

  function handleClick() {
    return (0, _tslib.__awaiter)(this, void 0, void 0, function* () {
      setLoading(true);

      try {
        const promise = props.onAction();
        yield promise;
        setLoading(false);
      } catch (e) {
        setLoading(false);
        throw e;
      }
    });
  }

  return (0, _nativeProps.withNativeProps)(props.action, _react.default.createElement(_button.default, {
    key: action.key,
    onClick: handleClick,
    className: (0, _classnames.default)('adm-dialog-button', {
      'adm-dialog-button-bold': action.bold
    }),
    fill: 'none',
    shape: 'rectangular',
    block: true,
    color: action.danger ? 'danger' : 'primary',
    loading: loading,
    disabled: action.disabled
  }, action.text));
};

exports.DialogActionButton = DialogActionButton;