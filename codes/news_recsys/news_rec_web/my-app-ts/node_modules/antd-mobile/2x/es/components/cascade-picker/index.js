import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { prompt } from './prompt';
import { CascadePicker } from './cascade-picker';
export default attachPropertiesToComponent(CascadePicker, {
  prompt
});