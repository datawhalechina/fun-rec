export function generateIntArray(from, to) {
  const array = [];

  for (let i = from; i <= to; i++) {
    array.push(i);
  }

  return array;
}