/*
 * MIT License http://opensource.org/licenses/MIT
 * Author: Ben Holloway @bholloway
 */
'use strict';

const fsUtils = (fs) => {
  // fs from enhanced-resolver doesn't include fs.existsSync so we need to use fs.statsSync instead
  const withStats = (fn) => (absolutePath) => {
    try {
      return fn(fs.statSync(absolutePath));
    } catch (e) {
      return false;
    }
  };

  return {
    isFileSync: withStats((stats) => stats.isFile()),
    isDirectorySync: withStats((stats) => stats.isDirectory()),
    existsSync: withStats((stats) => stats.isFile() || stats.isDirectory())
  };
};

module.exports = fsUtils;