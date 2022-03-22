import { Cascader } from './cascader';
import { prompt } from './prompt';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import "./cascader.css";
import { optionSkeleton } from '../cascader-view/option-skeleton';
export default attachPropertiesToComponent(Cascader, {
  prompt,
  optionSkeleton
});