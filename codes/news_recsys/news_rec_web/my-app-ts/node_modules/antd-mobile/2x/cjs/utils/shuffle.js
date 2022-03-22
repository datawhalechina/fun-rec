"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffle = shuffle;

/**
 * 数组打乱
 * @param array 任意数组
 * @returns any[] 打乱后的数组
 */
function shuffle(array) {
  const result = [...array];

  for (let i = result.length; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [result[i - 1], result[j]] = [result[j], result[i - 1]];
  }

  return result;
}