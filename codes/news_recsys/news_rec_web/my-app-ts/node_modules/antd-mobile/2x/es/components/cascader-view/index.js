import "./cascader-view.css";
import { CascaderView } from './cascader-view';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { optionSkeleton } from './option-skeleton';
export default attachPropertiesToComponent(CascaderView, {
  optionSkeleton
});