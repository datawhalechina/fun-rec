"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withCache = withCache;

function withCache(generate) {
  let cache = null;
  return () => {
    if (cache === null) {
      cache = generate();
    }

    return cache;
  };
}