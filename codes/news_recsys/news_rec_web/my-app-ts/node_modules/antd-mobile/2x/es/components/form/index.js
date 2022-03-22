import "./index.css";
import { Form } from './form';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { FormItem } from './form-item';
import { Header } from './header';
import { useForm } from 'rc-field-form';
import { FormSubscribe } from './form-subscribe';
import { FormArray } from './form-array';
export default attachPropertiesToComponent(Form, {
  Item: FormItem,
  Subscribe: FormSubscribe,
  Header,
  Array: FormArray,
  useForm
});