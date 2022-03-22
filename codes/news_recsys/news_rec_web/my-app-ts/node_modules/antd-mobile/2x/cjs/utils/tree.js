"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTreeDeep = getTreeDeep;

// 找到树的深度
function getTreeDeep(treeData, childrenName = 'children') {
  const walker = tree => {
    let deep = 0;
    tree.forEach(item => {
      if (item[childrenName]) {
        deep = Math.max(deep, walker(item[childrenName]) + 1);
      } else {
        deep = Math.max(deep, 1);
      }
    });
    return deep;
  };

  return walker(treeData);
}