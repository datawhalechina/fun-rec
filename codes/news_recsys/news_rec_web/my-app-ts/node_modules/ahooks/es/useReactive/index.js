import { useRef } from 'react';
import useCreation from '../useCreation';
import useUpdate from '../useUpdate'; // k:v 原对象:代理过的对象

var proxyMap = new WeakMap(); // k:v 代理过的对象:原对象

var rawMap = new WeakMap();

function isObject(val) {
  return typeof val === 'object' && val !== null;
}

function observer(initialVal, cb) {
  var existingProxy = proxyMap.get(initialVal); // 添加缓存 防止重新构建proxy

  if (existingProxy) {
    return existingProxy;
  } // 防止代理已经代理过的对象
  // https://github.com/alibaba/hooks/issues/839


  if (rawMap.has(initialVal)) {
    return initialVal;
  }

  var proxy = new Proxy(initialVal, {
    get: function get(target, key, receiver) {
      var res = Reflect.get(target, key, receiver);
      return isObject(res) ? observer(res, cb) : Reflect.get(target, key);
    },
    set: function set(target, key, val) {
      var ret = Reflect.set(target, key, val);
      cb();
      return ret;
    },
    deleteProperty: function deleteProperty(target, key) {
      var ret = Reflect.deleteProperty(target, key);
      cb();
      return ret;
    }
  });
  proxyMap.set(initialVal, proxy);
  rawMap.set(proxy, initialVal);
  return proxy;
}

function useReactive(initialState) {
  var update = useUpdate();
  var stateRef = useRef(initialState);
  var state = useCreation(function () {
    return observer(stateRef.current, function () {
      update();
    });
  }, []);
  return state;
}

export default useReactive;