import "./tree-select.css";
import { TreeSelect } from './tree-select';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { Multiple } from './multiple';
export default attachPropertiesToComponent(TreeSelect, {
  Multiple
});