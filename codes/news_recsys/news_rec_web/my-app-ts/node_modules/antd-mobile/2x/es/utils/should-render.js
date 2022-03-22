import { useInitialized } from './use-initialized';
export const ShouldRender = props => {
  const shouldRender = useShouldRender(props.active, props.forceRender, props.destroyOnClose);
  return shouldRender ? props.children : null;
};
export function useShouldRender(active, forceRender, destroyOnClose) {
  const initialized = useInitialized(active);
  if (forceRender) return true;
  if (active) return true;
  if (!initialized) return false;
  return !destroyOnClose;
}