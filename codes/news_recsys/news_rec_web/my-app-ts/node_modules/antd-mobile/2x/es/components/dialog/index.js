import "./dialog.css";
import { show } from './show';
import { alert } from './alert';
import { confirm } from './confirm';
import { clear } from './clear';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { Dialog } from './dialog';
export default attachPropertiesToComponent(Dialog, {
  show,
  alert,
  confirm,
  clear
});