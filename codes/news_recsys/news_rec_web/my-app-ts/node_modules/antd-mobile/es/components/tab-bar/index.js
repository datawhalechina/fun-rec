import "./tab-bar.css";
import { TabBar, TabBarItem } from './tab-bar';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
export default attachPropertiesToComponent(TabBar, {
  Item: TabBarItem
});