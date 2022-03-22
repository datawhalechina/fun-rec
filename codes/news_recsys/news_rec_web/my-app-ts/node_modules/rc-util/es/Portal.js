import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import canUseDom from './Dom/canUseDom';
var Portal = /*#__PURE__*/forwardRef(function (props, ref) {
  var didUpdate = props.didUpdate,
      getContainer = props.getContainer,
      children = props.children;
  var containerRef = useRef(); // Ref return nothing, only for wrapper check exist

  useImperativeHandle(ref, function () {
    return {};
  }); // Create container in client side with sync to avoid useEffect not get ref

  var initRef = useRef(false);

  if (!initRef.current && canUseDom()) {
    containerRef.current = getContainer();
    initRef.current = true;
  } // [Legacy] Used by `rc-trigger`


  useEffect(function () {
    didUpdate === null || didUpdate === void 0 ? void 0 : didUpdate(props);
  });
  useEffect(function () {
    return function () {
      var _containerRef$current, _containerRef$current2;

      // [Legacy] This should not be handle by Portal but parent PortalWrapper instead.
      // Since some component use `Portal` directly, we have to keep the logic here.
      (_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : (_containerRef$current2 = _containerRef$current.parentNode) === null || _containerRef$current2 === void 0 ? void 0 : _containerRef$current2.removeChild(containerRef.current);
    };
  }, []);
  return containerRef.current ? /*#__PURE__*/ReactDOM.createPortal(children, containerRef.current) : null;
});
export default Portal;