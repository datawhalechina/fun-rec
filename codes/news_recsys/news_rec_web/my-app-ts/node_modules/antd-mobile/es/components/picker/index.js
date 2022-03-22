import "./picker.css";
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { Picker } from './picker';
import { prompt } from './prompt';
export default attachPropertiesToComponent(Picker, {
  prompt
});