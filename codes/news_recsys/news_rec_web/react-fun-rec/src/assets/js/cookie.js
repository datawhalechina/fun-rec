
//  保存cookie
//  json 需要存储cookie的对象
//  days 默认存储多少天
export function setCookie(json, days) {
    // 设置过期时间
    let data = new Date(
        new Date().getTime() + days * 24 * 60 * 60 * 1000
    ).toUTCString();

    for (var key in json) {
        document.cookie = key + "=" + json[key] + "; expires=" + data
    }
}


// 获取cookie
// name 需要获取cookie的key
export function getCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2])
    } else {
        return null
    }
}


//  删除cookie
//  name 需要删除cookie的key
export function clearCookie(name) {
    let json = {};
    json[name] = '';
    setCookie(json, -1)
}