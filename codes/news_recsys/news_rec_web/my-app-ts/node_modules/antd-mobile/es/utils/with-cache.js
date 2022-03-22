export function withCache(generate) {
  let cache = null;
  return () => {
    if (cache === null) {
      cache = generate();
    }

    return cache;
  };
}