"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachPropertiesToComponent = attachPropertiesToComponent;

function attachPropertiesToComponent(component, properties) {
  const ret = component;

  for (const key in properties) {
    if (properties.hasOwnProperty(key)) {
      ret[key] = properties[key];
    }
  }

  return ret;
}