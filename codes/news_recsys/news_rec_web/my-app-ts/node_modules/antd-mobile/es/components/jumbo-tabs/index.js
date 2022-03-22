import "./jumbo-tabs.css";
import { JumboTab, JumboTabs } from './jumbo-tabs';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
export default attachPropertiesToComponent(JumboTabs, {
  Tab: JumboTab
});