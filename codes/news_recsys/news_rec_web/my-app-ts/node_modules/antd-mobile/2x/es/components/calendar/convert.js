export function convertValueToRange(selectionMode, value) {
  if (selectionMode === undefined) {
    return null;
  }

  if (value === null) {
    return null;
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value, value];
}