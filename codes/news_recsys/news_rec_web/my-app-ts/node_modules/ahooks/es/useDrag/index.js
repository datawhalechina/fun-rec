import useLatest from '../useLatest';
import { getTargetElement } from '../utils/domTarget';
import useEffectWithTarget from '../utils/useEffectWithTarget';

var useDrag = function useDrag(data, target, options) {
  if (options === void 0) {
    options = {};
  }

  var optionsRef = useLatest(options);
  useEffectWithTarget(function () {
    var targetElement = getTargetElement(target);

    if (!(targetElement === null || targetElement === void 0 ? void 0 : targetElement.addEventListener)) {
      return;
    }

    var onDragStart = function onDragStart(event) {
      var _a, _b;

      (_b = (_a = optionsRef.current).onDragStart) === null || _b === void 0 ? void 0 : _b.call(_a, event);
      event.dataTransfer.setData('custom', JSON.stringify(data));
    };

    var onDragEnd = function onDragEnd(event) {
      var _a, _b;

      (_b = (_a = optionsRef.current).onDragEnd) === null || _b === void 0 ? void 0 : _b.call(_a, event);
    };

    targetElement.setAttribute('draggable', 'true');
    targetElement.addEventListener('dragstart', onDragStart);
    targetElement.addEventListener('dragend', onDragEnd);
    return function () {
      targetElement.removeEventListener('dragstart', onDragStart);
      targetElement.removeEventListener('dragend', onDragEnd);
    };
  }, [], target);
};

export default useDrag;