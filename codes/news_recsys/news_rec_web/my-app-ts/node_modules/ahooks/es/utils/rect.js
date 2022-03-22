var getScrollTop = function getScrollTop(el) {
  if (el === document || el === document.body) {
    return Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
  }

  return el.scrollTop;
};

var getScrollHeight = function getScrollHeight(el) {
  return el.scrollHeight || Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
};

var getClientHeight = function getClientHeight(el) {
  return el.clientHeight || Math.max(document.documentElement.clientHeight, document.body.clientHeight);
};

export { getScrollTop, getScrollHeight, getClientHeight };