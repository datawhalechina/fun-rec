import "./swiper.css";
import { Swiper } from './swiper';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { SwiperItem } from './swiper-item';
export default attachPropertiesToComponent(Swiper, {
  Item: SwiperItem
});