var __read = this && this.__read || function (o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
      r,
      ar = [],
      e;

  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) {
      ar.push(r.value);
    }
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }

  return ar;
};

var __spread = this && this.__spread || function () {
  for (var ar = [], i = 0; i < arguments.length; i++) {
    ar = ar.concat(__read(arguments[i]));
  }

  return ar;
};

import { useCallback, useRef, useState } from 'react';

var useDynamicList = function useDynamicList(initialList) {
  if (initialList === void 0) {
    initialList = [];
  }

  var counterRef = useRef(-1);
  var keyList = useRef([]);
  var setKey = useCallback(function (index) {
    counterRef.current += 1;
    keyList.current.splice(index, 0, counterRef.current);
  }, []);

  var _a = __read(useState(function () {
    initialList.forEach(function (_, index) {
      setKey(index);
    });
    return initialList;
  }), 2),
      list = _a[0],
      setList = _a[1];

  var resetList = useCallback(function (newList) {
    keyList.current = [];
    setList(function () {
      newList.forEach(function (_, index) {
        setKey(index);
      });
      return newList;
    });
  }, []);
  var insert = useCallback(function (index, item) {
    setList(function (l) {
      var temp = __spread(l);

      temp.splice(index, 0, item);
      setKey(index);
      return temp;
    });
  }, []);
  var getKey = useCallback(function (index) {
    return keyList.current[index];
  }, []);
  var getIndex = useCallback(function (key) {
    return keyList.current.findIndex(function (ele) {
      return ele === key;
    });
  }, []);
  var merge = useCallback(function (index, items) {
    setList(function (l) {
      var temp = __spread(l);

      items.forEach(function (_, i) {
        setKey(index + i);
      });
      temp.splice.apply(temp, __spread([index, 0], items));
      return temp;
    });
  }, []);
  var replace = useCallback(function (index, item) {
    setList(function (l) {
      var temp = __spread(l);

      temp[index] = item;
      return temp;
    });
  }, []);
  var remove = useCallback(function (index) {
    setList(function (l) {
      var temp = __spread(l);

      temp.splice(index, 1); // remove keys if necessary

      try {
        keyList.current.splice(index, 1);
      } catch (e) {
        console.error(e);
      }

      return temp;
    });
  }, []);
  var move = useCallback(function (oldIndex, newIndex) {
    if (oldIndex === newIndex) {
      return;
    }

    setList(function (l) {
      var newList = __spread(l);

      var temp = newList.filter(function (_, index) {
        return index !== oldIndex;
      });
      temp.splice(newIndex, 0, newList[oldIndex]); // move keys if necessary

      try {
        var keyTemp = keyList.current.filter(function (_, index) {
          return index !== oldIndex;
        });
        keyTemp.splice(newIndex, 0, keyList.current[oldIndex]);
        keyList.current = keyTemp;
      } catch (e) {
        console.error(e);
      }

      return temp;
    });
  }, []);
  var push = useCallback(function (item) {
    setList(function (l) {
      setKey(l.length);
      return l.concat([item]);
    });
  }, []);
  var pop = useCallback(function () {
    // remove keys if necessary
    try {
      keyList.current = keyList.current.slice(0, keyList.current.length - 1);
    } catch (e) {
      console.error(e);
    }

    setList(function (l) {
      return l.slice(0, l.length - 1);
    });
  }, []);
  var unshift = useCallback(function (item) {
    setList(function (l) {
      setKey(0);
      return [item].concat(l);
    });
  }, []);
  var shift = useCallback(function () {
    // remove keys if necessary
    try {
      keyList.current = keyList.current.slice(1, keyList.current.length);
    } catch (e) {
      console.error(e);
    }

    setList(function (l) {
      return l.slice(1, l.length);
    });
  }, []);
  var sortList = useCallback(function (result) {
    return result.map(function (item, index) {
      return {
        key: index,
        item: item
      };
    }) // add index into obj
    .sort(function (a, b) {
      return getIndex(a.key) - getIndex(b.key);
    }) // sort based on the index of table
    .filter(function (item) {
      return !!item.item;
    }) // remove undefined(s)
    .map(function (item) {
      return item.item;
    });
  }, // retrive the data
  []);
  return {
    list: list,
    insert: insert,
    merge: merge,
    replace: replace,
    remove: remove,
    getKey: getKey,
    getIndex: getIndex,
    move: move,
    push: push,
    pop: pop,
    unshift: unshift,
    shift: shift,
    sortList: sortList,
    resetList: resetList
  };
};

export default useDynamicList;