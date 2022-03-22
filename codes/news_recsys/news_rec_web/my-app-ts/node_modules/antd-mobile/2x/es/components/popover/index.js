import "./popover.css";
import "./popover-menu.css";
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { PopoverMenu } from './popover-menu';
import { Popover } from './popover';
export default attachPropertiesToComponent(Popover, {
  Menu: PopoverMenu
});