"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapper = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Wrapper extends _react.default.Component {
  constructor() {
    super(...arguments);
    this.element = null;
  }

  componentDidMount() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    // eslint-disable-next-line
    const node = (0, _reactDom.findDOMNode)(this);

    if (node instanceof Element) {
      this.element = node;
    } else {
      this.element = null;
    }
  }

  render() {
    return _react.default.Children.only(this.props.children);
  }

}

exports.Wrapper = Wrapper;