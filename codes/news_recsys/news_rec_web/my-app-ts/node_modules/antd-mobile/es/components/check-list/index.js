import "./check-list.css";
import { CheckList } from './check-list';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { CheckListItem } from './check-list-item';
export default attachPropertiesToComponent(CheckList, {
  Item: CheckListItem
});