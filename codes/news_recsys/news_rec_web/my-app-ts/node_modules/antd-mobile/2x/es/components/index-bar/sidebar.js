import React, { useState } from 'react';
import classNames from 'classnames';
const classPrefix = `adm-index-bar`;
export const Sidebar = props => {
  const [interacting, setInteracting] = useState(false);
  return React.createElement("div", {
    className: classNames(`${classPrefix}-sidebar`, {
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
    return React.createElement("div", {
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
    }, interacting && active && React.createElement("div", {
      className: `${classPrefix}-sidebar-bubble`
    }, brief), React.createElement("div", {
      className: classNames(`${classPrefix}-sidebar-item`, {
        [`${classPrefix}-sidebar-item-active`]: active
      }),
      "data-index": index
    }, React.createElement("div", null, brief)));
  }));
};