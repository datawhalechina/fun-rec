"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sidebar = void 0;

var _react = _interopRequireWildcard(require("react"));

var _classnames = _interopRequireDefault(require("classnames"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const classPrefix = `adm-index-bar`;

const Sidebar = props => {
  const [interacting, setInteracting] = (0, _react.useState)(false);
  return _react.default.createElement("div", {
    className: (0, _classnames.default)(`${classPrefix}-sidebar`, {
      [`${classPrefix}-sidebar-interacting`]: interacting
    }),
    onMouseDown: () => {
      setInteracting(true);
    },
    onMouseUp: () => {
      setInteracting(false);
    },
    onTouchStart: () => {
      setInteracting(true);
    },
    onTouchEnd: () => {
      setInteracting(false);
    },
    onTouchMove: e => {
      if (!interacting) return;
      const {
        clientX,
        clientY
      } = e.touches[0];
      const target = document.elementFromPoint(clientX, clientY);
      if (!target) return;
      const index = target.dataset['index'];

      if (index) {
        props.onActive(index);
      }
    }
  }, props.indexItems.map(({
    index,
    brief
  }) => {
    const active = index === props.activeIndex;
    return _react.default.createElement("div", {
      className: `${classPrefix}-sidebar-row`,
      onMouseDown: () => {
        props.onActive(index);
      },
      onTouchStart: () => {
        props.onActive(index);
      },
      onMouseEnter: () => {
        if (interacting) {
          props.onActive(index);
        }
      },
      "data-index": index,
      key: index
    }, interacting && active && _react.default.createElement("div", {
      className: `${classPrefix}-sidebar-bubble`
    }, brief), _react.default.createElement("div", {
      className: (0, _classnames.default)(`${classPrefix}-sidebar-item`, {
        [`${classPrefix}-sidebar-item-active`]: active
      }),
      "data-index": index
    }, _react.default.createElement("div", null, brief)));
  }));
};

exports.Sidebar = Sidebar;