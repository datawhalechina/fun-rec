import "./list.css";
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { List } from './list';
import { ListItem } from './list-item';
export default attachPropertiesToComponent(List, {
  Item: ListItem
});