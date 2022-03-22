import "./collapse.css";
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { Collapse, CollapsePanel } from './collapse';
export default attachPropertiesToComponent(Collapse, {
  Panel: CollapsePanel
});