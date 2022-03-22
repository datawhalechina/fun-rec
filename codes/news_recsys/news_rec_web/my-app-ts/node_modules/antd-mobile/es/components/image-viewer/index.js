import "./image-viewer.css";
import { attachPropertiesToComponent } from '../../utils/attach-properties-to-component';
import { ImageViewer, MultiImageViewer } from './image-viewer';
import { showMultiImageViewer, showImageViewer, clearImageViewer } from './methods';
const Multi = attachPropertiesToComponent(MultiImageViewer, {
  show: showMultiImageViewer
});
export default attachPropertiesToComponent(ImageViewer, {
  Multi,
  show: showImageViewer,
  clear: clearImageViewer
});