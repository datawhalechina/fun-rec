import { isDev } from './is-dev';
export function devWarning(component, message) {
  if (isDev) {
    console.warn(`[antd-mobile: ${component}] ${message}`);
  }
}
export function devError(component, message) {
  if (isDev) {
    console.error(`[antd-mobile: ${component}] ${message}`);
  }
}