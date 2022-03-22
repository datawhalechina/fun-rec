export function attachPropertiesToComponent(component, properties) {
  const ret = component;

  for (const key in properties) {
    if (properties.hasOwnProperty(key)) {
      ret[key] = properties[key];
    }
  }

  return ret;
}