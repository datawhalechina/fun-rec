import "./capsule-tabs.css";
import { CapsuleTab, CapsuleTabs } from './capsule-tabs';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
export default attachPropertiesToComponent(CapsuleTabs, {
  Tab: CapsuleTab
});