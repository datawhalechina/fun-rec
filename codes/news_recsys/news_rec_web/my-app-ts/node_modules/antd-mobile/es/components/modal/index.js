import "./modal.css";
import { show } from './show';
import { alert } from './alert';
import { confirm } from './confirm';
import { clear } from './clear';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { Modal } from './modal';
export default attachPropertiesToComponent(Modal, {
  show,
  alert,
  confirm,
  clear
});