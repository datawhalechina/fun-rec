"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTabListScroll = void 0;

var _web = require("@react-spring/web");

var _useMutationEffect = require("./use-mutation-effect");

var _bound = require("./bound");

var _ahooks = require("ahooks");

var _useIsomorphicUpdateLayoutEffect = require("./use-isomorphic-update-layout-effect");

const useTabListScroll = (targetRef, activeIndex) => {
  const [{
    scrollLeft
  }, api] = (0, _web.useSpring)(() => ({
    scrollLeft: 0,
    config: {
      tension: 300,
      clamp: true
    }
  }));

  function animate(immediate = false) {
    const container = targetRef.current;
    if (!container) return;
    if (activeIndex === undefined) return;
    const activeTabWrapper = container.children.item(activeIndex);
    const activeTab = activeTabWrapper.children.item(0);
    const activeTabLeft = activeTab.offsetLeft;
    const activeTabWidth = activeTab.offsetWidth;
    const containerWidth = container.offsetWidth;
    const containerScrollWidth = container.scrollWidth;
    const containerScrollLeft = container.scrollLeft;
    const maxScrollDistance = containerScrollWidth - containerWidth;
    if (maxScrollDistance <= 0) return;
    const nextScrollLeft = (0, _bound.bound)(activeTabLeft - (containerWidth - activeTabWidth) / 2, 0, containerScrollWidth - containerWidth);
    api.start({
      scrollLeft: nextScrollLeft,
      from: {
        scrollLeft: containerScrollLeft
      },
      immediate
    });
  }

  (0, _ahooks.useIsomorphicLayoutEffect)(() => {
    animate(true);
  }, []);
  (0, _useIsomorphicUpdateLayoutEffect.useIsomorphicUpdateLayoutEffect)(() => {
    animate();
  }, [activeIndex]);
  (0, _useMutationEffect.useMutationEffect)(() => {
    animate(true);
  }, targetRef, {
    subtree: true,
    childList: true,
    characterData: true
  });
  return {
    scrollLeft,
    animate
  };
};

exports.useTabListScroll = useTabListScroll;