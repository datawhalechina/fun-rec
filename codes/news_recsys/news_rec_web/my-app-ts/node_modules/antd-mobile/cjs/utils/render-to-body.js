"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderToBody = renderToBody;

var _reactDom = _interopRequireDefault(require("react-dom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function renderToBody(element) {
  const container = document.createElement('div');
  document.body.appendChild(container);

  function unmount() {
    const unmountResult = _reactDom.default.unmountComponentAtNode(container);

    if (unmountResult && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }

  _reactDom.default.render(element, container);

  return unmount;
}