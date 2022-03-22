export function resolveContainer(getContainer) {
  const container = typeof getContainer === 'function' ? getContainer() : getContainer;
  return container || document.body;
}