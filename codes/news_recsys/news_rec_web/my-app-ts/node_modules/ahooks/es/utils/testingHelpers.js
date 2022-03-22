export function sleep(time) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve();
    }, time);
  });
}
export function request(req) {
  return new Promise(function (resolve, reject) {
    return setTimeout(function () {
      if (req === 0) {
        reject(new Error('fail'));
      } else {
        resolve('success');
      }
    }, 1000);
  });
}