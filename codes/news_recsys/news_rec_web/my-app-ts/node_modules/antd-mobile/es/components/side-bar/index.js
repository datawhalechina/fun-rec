import "./side-bar.css";
import { SideBar, SideBarItem } from './side-bar';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
export default attachPropertiesToComponent(SideBar, {
  Item: SideBarItem
});