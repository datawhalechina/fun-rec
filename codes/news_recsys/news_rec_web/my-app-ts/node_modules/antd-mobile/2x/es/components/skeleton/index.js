import "./skeleton.css";
import { Skeleton, SkeletonParagraph, SkeletonTitle } from './skeleton';
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
export default attachPropertiesToComponent(Skeleton, {
  Title: SkeletonTitle,
  Paragraph: SkeletonParagraph
});