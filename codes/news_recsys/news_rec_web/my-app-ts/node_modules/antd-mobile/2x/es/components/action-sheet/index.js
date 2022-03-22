import "./action-sheet.css";
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { ActionSheet, showActionSheet } from './action-sheet';
export default attachPropertiesToComponent(ActionSheet, {
  show: showActionSheet
});