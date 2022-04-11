export const sessionStorage = {
  
  //存储
  set(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  },

  //取出数据
  get(key) {
    const value = window.sessionStorage.getItem(key)
    if (value && value != "undefined" && value != "null") {
      return JSON.parse(value)
    }
    return null
  },

  // 删除数据
  remove(key) {
    window.sessionStorage.removeItem(key)
  }
}
