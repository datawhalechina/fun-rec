import "./index-bar.css";
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { Panel } from './panel';
import { IndexBar } from './index-bar';
export default attachPropertiesToComponent(IndexBar, {
  Panel
});